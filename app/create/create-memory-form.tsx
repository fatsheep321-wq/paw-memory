"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Upload } from "tus-js-client";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  IMAGE_BUCKET,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  TUS_CHUNK_BYTES,
  VIDEO_BUCKET,
} from "@/lib/memories/constants";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { PetAvatar, accessories, type Accessory } from "@/app/components/pet-avatar";

const initialProgress = { photo: 0, video: 0 };

type Phase =
  | "idle"
  | "validating"
  | "authenticating"
  | "creating"
  | "uploading-photo"
  | "uploading-video"
  | "publishing"
  | "success"
  | "error";

type FormErrors = Partial<Record<"petName" | "warmMessage" | "photo" | "video" | "share", string>>;

type UploadedObject = {
  fileKey: string;
  path: string;
  uploaded: boolean;
  verified: boolean;
};

type DraftReference = {
  id: string;
  ownerId: string;
};

type PublishResult = {
  id: string;
  shareUrl: string;
  qrDataUrl: string;
};

const phaseLabels: Record<Phase, string> = {
  idle: "準備建立回憶",
  validating: "正在檢查表單與媒體…",
  authenticating: "正在建立安全的建立者身分…",
  creating: "正在建立草稿…",
  "uploading-photo": "正在上傳照片…",
  "uploading-video": "正在上傳影片，可在網路中斷後重試…",
  publishing: "正在確認檔案並發布…",
  success: "回憶已發布",
  error: "發布未完成，可修正後重試",
};

function fileIdentity(file: File) {
  return `${file.name}:${file.size}:${file.type}:${file.lastModified}`;
}

function extensionFor(file: File) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };

  return extensions[file.type];
}

function validateFields(
  petName: string,
  warmMessage: string,
  photo: File | null,
  video: File | null,
  shareConfirmed: boolean,
) {
  const errors: FormErrors = {};
  const normalizedName = petName.trim();
  const normalizedMessage = warmMessage.trim();

  if (!normalizedName || normalizedName.length > 60) {
    errors.petName = "寵物名字需為 1 至 60 個字。";
  }

  if (!normalizedMessage || normalizedMessage.length > 1000) {
    errors.warmMessage = "暖心話需為 1 至 1000 個字。";
  }

  if (!photo) {
    errors.photo = "請選擇一張照片。";
  } else if (!ALLOWED_IMAGE_TYPES.includes(photo.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    errors.photo = "照片僅支援 JPEG、PNG 或 WebP。";
  } else if (photo.size === 0 || photo.size > MAX_IMAGE_BYTES) {
    errors.photo = "照片必須非空且不超過 10 MB。";
  }

  if (!video) {
    errors.video = "請選擇一段影片。";
  } else if (!ALLOWED_VIDEO_TYPES.includes(video.type as (typeof ALLOWED_VIDEO_TYPES)[number])) {
    errors.video = "影片僅支援 MP4 或 WebM。";
  } else if (video.size === 0 || video.size > MAX_VIDEO_BYTES) {
    errors.video = "影片必須非空且不超過 50 MB。";
  }

  if (!shareConfirmed) {
    errors.share = "發布前必須確認公開分享範圍。";
  }

  return errors;
}

async function verifyImageCanDecode(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    if (!bitmap.width || !bitmap.height) {
      throw new Error("照片沒有有效尺寸。");
    }
    bitmap.close();
  } catch {
    throw new Error("瀏覽器無法讀取這張照片，請改用相容的 JPEG、PNG 或 WebP。" );
  }
}

async function verifyVideoCanLoad(file: File) {
  const probe = document.createElement("video");
  const support = probe.canPlayType(file.type);

  if (!support) {
    throw new Error("目前瀏覽器不支援所選影片格式，請改用 H.264/AAC MP4 或相容的 WebM。" );
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error("影片相容性檢查逾時。"));
      }, 15000);

      probe.preload = "metadata";
      probe.muted = true;
      probe.playsInline = true;
      probe.onloadedmetadata = () => {
        window.clearTimeout(timeout);
        if (!Number.isFinite(probe.duration) || probe.duration <= 0) {
          reject(new Error("影片沒有有效長度。"));
          return;
        }
        resolve();
      };
      probe.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("瀏覽器無法解析影片编码。"));
      };
      probe.src = objectUrl;
      probe.load();
    });
  } catch {
    throw new Error("影片副檔名正確，但目前瀏覽器無法確認编码可播放；請改用 H.264/AAC MP4。" );
  } finally {
    probe.removeAttribute("src");
    probe.load();
    URL.revokeObjectURL(objectUrl);
  }
}

function uploadWithTus({
  file,
  bucket,
  objectPath,
  accessToken,
  onProgress,
  onUploadCreated,
}: {
  file: File;
  bucket: string;
  objectPath: string;
  accessToken: string;
  onProgress: (progress: number) => void;
  onUploadCreated: (upload: Upload | null) => void;
}) {
  const config = getSupabasePublicConfig();

  if (!config) {
    return Promise.reject(new Error("Supabase 尚未配置，無法上傳。"));
  }

  return new Promise<void>(async (resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${config.url}/storage/v1/upload/resumable`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        apikey: config.publishableKey,
      },
      metadata: {
        bucketName: bucket,
        objectName: objectPath,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: TUS_CHUNK_BYTES,
      retryDelays: [0, 1000, 3000, 5000, 10000],
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      fingerprint: async () => `${bucket}:${objectPath}:${fileIdentity(file)}`,
      onProgress(bytesSent, bytesTotal) {
        onProgress(Math.round((bytesSent / bytesTotal) * 100));
      },
      onError(error) {
        onUploadCreated(null);
        reject(error);
      },
      onSuccess() {
        onProgress(100);
        onUploadCreated(null);
        resolve();
      },
    });

    onUploadCreated(upload);

    try {
      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    } catch (error) {
      onUploadCreated(null);
      reject(error);
    }
  });
}

async function verifyStoredObject(
  bucket: string,
  objectPath: string,
  expectedSize: number,
  expectedType: string,
) {
  const client = getBrowserSupabaseClient();
  if (!client) {
    throw new Error("Supabase 尚未配置。" );
  }

  const parts = objectPath.split("/");
  const fileName = parts.pop();
  const folder = parts.join("/");
  const { data, error } = await client.storage.from(bucket).list(folder, {
    limit: 20,
    search: fileName,
  });

  if (error) {
    throw new Error(`無法確認雲端檔案：${error.message}`);
  }

  const stored = data.find((item) => item.name === fileName);
  if (!stored) {
    throw new Error("上傳请求已完成，但雲端找不到檔案，因此不会发布。" );
  }

  const storedSize = Number(stored.metadata?.size);
  if (!Number.isFinite(storedSize) || storedSize <= 0) {
    throw new Error("雲端未回报有效檔案大小，因此不会发布。" );
  }
  if (storedSize !== expectedSize) {
    throw new Error("雲端檔案大小與本機不同，因此不会发布。" );
  }

  const storedType = String(stored.metadata?.mimetype || "").toLowerCase();
  if (storedType !== expectedType.toLowerCase()) {
    throw new Error("雲端檔案格式與本機不同，因此不会发布。" );
  }
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--sage-light)]">
        <div className="h-full bg-[var(--coral)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function CreateMemoryForm({ siteUrl }: { siteUrl: string }) {
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory>("rain");
  useEffect(() => { const key = new URLSearchParams(window.location.search).get("accessory"); if (key === "rain" || key === "birthday" || key === "snack") setSelectedAccessory(key); }, []);
  const [petName, setPetName] = useState("");
  const [warmMessage, setWarmMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [shareConfirmed, setShareConfirmed] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [operationError, setOperationError] = useState("");
  const [progress, setProgress] = useState(initialProgress);
  const [result, setResult] = useState<PublishResult | null>(null);

  const activeUploadRef = useRef<Upload | null>(null);
  const draftRef = useRef<DraftReference | null>(null);
  const photoUploadRef = useRef<UploadedObject | null>(null);
  const videoUploadRef = useRef<UploadedObject | null>(null);

  const isBusy = !["idle", "error", "success"].includes(phase);
  const isLocked = isBusy || phase === "success";

  useEffect(() => {
    return () => {
      if (activeUploadRef.current) {
        void activeUploadRef.current.abort();
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOperationError("");
    setResult(null);

    const errors = validateFields(petName, warmMessage, photo, video, shareConfirmed);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || !photo || !video) {
      setPhase("error");
      return;
    }

    try {
      setPhase("validating");
      await verifyImageCanDecode(photo);
      await verifyVideoCanLoad(video);

      const client = getBrowserSupabaseClient();
      if (!client) {
        throw new Error("Supabase 尚未配置，無法發布。" );
      }

      setPhase("authenticating");
      const sessionResult = await client.auth.getSession();
      if (sessionResult.error) {
        throw sessionResult.error;
      }

      let session = sessionResult.data.session;
      if (!session) {
        const anonymousResult = await client.auth.signInAnonymously();
        if (anonymousResult.error || !anonymousResult.data.session) {
          throw new Error(anonymousResult.error?.message || "無法建立匿名建立者身分。" );
        }
        session = anonymousResult.data.session;
      }

      const ownerId = session.user.id;
      setPhase("creating");

      if (draftRef.current?.ownerId !== ownerId) {
        draftRef.current = null;
        photoUploadRef.current = null;
        videoUploadRef.current = null;
        setProgress(initialProgress);
      }

      if (!draftRef.current) {
        const { data, error } = await client
          .from("memories")
          .insert({
            owner_id: ownerId,
            pet_name: petName.trim(),
            warm_message: warmMessage.trim(),
            share_confirmed: true,
            status: "draft",
          })
          .select("id")
          .single();

        if (error || !data) {
          throw new Error(error?.message || "無法建立雲端草稿。" );
        }

        draftRef.current = { id: data.id, ownerId };
      } else {
        const { error } = await client
          .from("memories")
          .update({
            pet_name: petName.trim(),
            warm_message: warmMessage.trim(),
            share_confirmed: true,
          })
          .eq("id", draftRef.current.id)
          .eq("owner_id", ownerId);

        if (error) {
          throw new Error(`無法更新草稿：${error.message}`);
        }
      }

      const draftId = draftRef.current.id;
      const photoKey = fileIdentity(photo);
      let photoObject = photoUploadRef.current;
      if (!photoObject || photoObject.fileKey !== photoKey) {
        photoObject = {
          fileKey: photoKey,
          path: `${ownerId}/${draftId}/photo-${crypto.randomUUID()}.${extensionFor(photo)}`,
          uploaded: false,
          verified: false,
        };
        photoUploadRef.current = photoObject;
        setProgress((current) => ({ ...current, photo: 0 }));
      }

      if (!photoObject.verified) {
        setPhase("uploading-photo");
        if (!photoObject.uploaded) {
          await uploadWithTus({
            file: photo,
            bucket: IMAGE_BUCKET,
            objectPath: photoObject.path,
            accessToken: session.access_token,
            onProgress: (value) => setProgress((current) => ({ ...current, photo: value })),
            onUploadCreated: (upload) => {
              activeUploadRef.current = upload;
            },
          });
          photoObject = { ...photoObject, uploaded: true };
          photoUploadRef.current = photoObject;
        }
        await verifyStoredObject(IMAGE_BUCKET, photoObject.path, photo.size, photo.type);
        photoObject = { ...photoObject, verified: true };
        photoUploadRef.current = photoObject;
      }

      const videoKey = fileIdentity(video);
      let videoObject = videoUploadRef.current;
      if (!videoObject || videoObject.fileKey !== videoKey) {
        videoObject = {
          fileKey: videoKey,
          path: `${ownerId}/${draftId}/video-${crypto.randomUUID()}.${extensionFor(video)}`,
          uploaded: false,
          verified: false,
        };
        videoUploadRef.current = videoObject;
        setProgress((current) => ({ ...current, video: 0 }));
      }

      if (!videoObject.verified) {
        setPhase("uploading-video");
        if (!videoObject.uploaded) {
          await uploadWithTus({
            file: video,
            bucket: VIDEO_BUCKET,
            objectPath: videoObject.path,
            accessToken: session.access_token,
            onProgress: (value) => setProgress((current) => ({ ...current, video: value })),
            onUploadCreated: (upload) => {
              activeUploadRef.current = upload;
            },
          });
          videoObject = { ...videoObject, uploaded: true };
          videoUploadRef.current = videoObject;
        }
        await verifyStoredObject(VIDEO_BUCKET, videoObject.path, video.size, video.type);
        videoObject = { ...videoObject, verified: true };
        videoUploadRef.current = videoObject;
      }

      const confirmedPhotoObject = photoUploadRef.current;
      const confirmedVideoObject = videoUploadRef.current;
      if (
        !confirmedPhotoObject?.verified ||
        !confirmedVideoObject?.verified
      ) {
        throw new Error("照片或影片尚未完成雲端確認，因此不会发布。" );
      }

      setPhase("publishing");
      await Promise.all([
        verifyStoredObject(
          IMAGE_BUCKET,
          confirmedPhotoObject.path,
          photo.size,
          photo.type,
        ),
        verifyStoredObject(
          VIDEO_BUCKET,
          confirmedVideoObject.path,
          video.size,
          video.type,
        ),
      ]);

      const shareUrl = `${siteUrl}/m/${draftId}`;
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 360,
        margin: 4,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });

      const { data: publishRows, error: publishError } = await client.rpc(
        "publish_memory",
        {
          p_memory_id: draftId,
          p_pet_name: petName.trim(),
          p_warm_message: warmMessage.trim(),
          p_photo_path: confirmedPhotoObject.path,
          p_video_path: confirmedVideoObject.path,
          p_photo_size: photo.size,
          p_video_size: video.size,
          p_photo_mime: photo.type,
          p_video_mime: video.type,
          p_share_confirmed: shareConfirmed,
        },
      );
      const published = Array.isArray(publishRows) ? publishRows[0] : null;

      if (
        publishError ||
        !published ||
        published.id !== draftId ||
        published.status !== "published" ||
        !published.photo_path ||
        !published.video_path
      ) {
        throw new Error(publishError?.message || "資料庫未確認發布完成。" );
      }

      setResult({ id: published.id, shareUrl, qrDataUrl });
      setPhase("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "發布失敗，請稍後重試。";
      setOperationError(message);
      setPhase("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
      <aside aria-label="建立流程"><label className="binding-label">这段故事属于哪个配件？<select className="my-3 w-full rounded-xl border border-[var(--line)] bg-white p-3" value={selectedAccessory} disabled={isLocked} onChange={(event) => setSelectedAccessory(event.target.value as Accessory)}><option value="rain">小小雨衣 · 雨天散步</option><option value="birthday">生日帽 · 生日回忆</option><option value="snack">小零食 · 日常故事</option></select></label>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ["1", "寵物資料", "名字與想對牠說的話"],
            ["2", "照片與影片", "檢查格式後直傳私有雲端空間"],
            ["3", "公開確認", "持有分享連結者都能瀏覽"],
            ["4", "發布完成", "取得固定網址與 QR Code"],
          ].map(([number, label, description]) => (
            <li key={number} className="flex gap-4 rounded-2xl border border-[var(--line)] bg-white/55 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--coral)] text-sm font-semibold text-white">{number}</span>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5">
          <div className="companion-scene"><PetAvatar accessory={selectedAccessory} /></div><p className="small-note">{accessories[selectedAccessory].name} · 原创示例摆件，非照片生成结果</p>
        </div>
      </aside>

      <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_20px_50px_rgba(65,58,47,0.08)] sm:p-8">
        <div className="grid gap-6">
          <label className="grid gap-2 font-semibold">
            寵物名字
            <input
              value={petName}
              onChange={(event) => setPetName(event.target.value)}
              maxLength={60}
              disabled={isLocked}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 font-normal outline-none focus:border-[var(--coral)]"
              placeholder="例如：豆包"
            />
            {fieldErrors.petName && <span className="text-sm font-normal text-[var(--coral-dark)]">{fieldErrors.petName}</span>}
          </label>

          <label className="grid gap-2 font-semibold">
            寵物照片
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              disabled={isLocked}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-[var(--sage-light)] file:px-4 file:py-2 file:font-semibold"
            />
            <span className="text-xs font-normal leading-5 text-[var(--muted)]">JPEG、PNG、WebP，最大 10 MB。</span>
            {fieldErrors.photo && <span className="text-sm font-normal text-[var(--coral-dark)]">{fieldErrors.photo}</span>}
          </label>

          <label className="grid gap-2 font-semibold">
            回憶影片
            <input
              type="file"
              accept={ALLOWED_VIDEO_TYPES.join(",")}
              onChange={(event) => setVideo(event.target.files?.[0] || null)}
              disabled={isLocked}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-[var(--sage-light)] file:px-4 file:py-2 file:font-semibold"
            />
            <span className="text-xs font-normal leading-5 text-[var(--muted)]">MP4 或 WebM，最大 50 MB。系统会请浏览器检查媒体是否可读取，但仍需在目标手机实测播放相容性。</span>
            {fieldErrors.video && <span className="text-sm font-normal text-[var(--coral-dark)]">{fieldErrors.video}</span>}
          </label>

          <label className="grid gap-2 font-semibold">
            暖心話
            <textarea
              value={warmMessage}
              onChange={(event) => setWarmMessage(event.target.value)}
              maxLength={1000}
              rows={5}
              disabled={isLocked}
              className="resize-y rounded-2xl border border-[var(--line)] bg-white px-4 py-3 font-normal leading-7 outline-none focus:border-[var(--coral)]"
              placeholder="寫下想和牠一起保存的話…"
            />
            <span className="text-right text-xs font-normal text-[var(--muted)]">{warmMessage.length}/1000</span>
            {fieldErrors.warmMessage && <span className="text-sm font-normal text-[var(--coral-dark)]">{fieldErrors.warmMessage}</span>}
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4 text-sm leading-6">
            <input
              type="checkbox"
              checked={shareConfirmed}
              onChange={(event) => setShareConfirmed(event.target.checked)}
              disabled={isLocked}
              className="mt-1 size-4 accent-[var(--coral)]"
            />
            <span>
              我確認發布後，<strong>任何持有分享連結者都可访问</strong>照片、影片與暖心話。這不是只有扫码者可見、也不是不可枚举的私密分享。
            </span>
          </label>
          {fieldErrors.share && <span className="text-sm text-[var(--coral-dark)]">{fieldErrors.share}</span>}

          {(isBusy || phase === "error" || phase === "success") && (
            <div className="rounded-2xl border border-[var(--line)] bg-[#f4f6f0] p-4" aria-live="polite">
              <p className="text-sm font-semibold">{phaseLabels[phase]}</p>
              {(progress.photo > 0 || progress.video > 0) && (
                <div className="mt-4 grid gap-3">
                  <ProgressBar label="照片" value={progress.photo} />
                  <ProgressBar label="影片" value={progress.video} />
                </div>
              )}
              {operationError && <p className="mt-3 text-sm leading-6 text-[var(--coral-dark)]">{operationError}</p>}
            </div>
          )}

          {result && (
            <div className="rounded-3xl border border-[var(--sage)] bg-[#f4f6f0] p-5 text-center sm:p-6">
              <p className="text-sm font-semibold text-[#52634f]">发布成功</p>
              <h2 className="mt-2 text-2xl font-semibold">回忆已经可以跨设备访问</h2>
              <img src={result.qrDataUrl} alt="此真实回忆公开地址的动态 QR Code" className="qr-static mx-auto mt-5 size-56 rounded-xl bg-white p-2" />
              <p className="mt-4 text-xs font-semibold text-[var(--ink)]">此动态 QR 对应本次真实回忆网址</p>
              <p className="mt-1 break-all text-xs leading-5 text-[var(--muted)]">{result.shareUrl}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--coral-dark)]">任何持有此链接或二维码的人都可访问照片、影片与暖心话。</p>
              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                <Link href={result.shareUrl} className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--coral-dark)]">
                  查看回忆页
                </Link>
                <Link href={`/studio?memory=${result.id}&accessory=${selectedAccessory}`} className="rounded-full bg-[var(--coral)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--coral-dark)]">
                  绑定配件与制作二维码
                </Link>
                <a href={result.qrDataUrl} download={`paw-memory-${result.id}.png`} className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-[var(--sage)]">
                  下载二维码
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white/80 p-5 text-left">
                <h3 className="font-semibold">把故事放进实体分身的配件</h3>
                <ol className="mt-3 grid gap-3 text-sm leading-6 text-[var(--muted)] sm:grid-cols-2">
                  <li><strong className="text-[var(--ink)]">1. 打印：</strong>使用下载的原始二维码，保持黑白清晰与四周留白，不要裁切或拉伸。</li>
                  <li><strong className="text-[var(--ink)]">2. 防水：</strong>覆膜或放入透明防水牌套，避免反光膜、污渍和折痕盖住图案。</li>
                  <li><strong className="text-[var(--ink)]">3. 固定：</strong>将二维码固定在摆件底部，或对应的雨衣、生日帽和零食配件上。</li>
                  <li><strong className="text-[var(--ink)]">4. 测试：</strong>用另一部手机扫描每件配件，确认打开的是各自绑定的故事。</li>
                </ol>
                <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs leading-5 text-[var(--muted)]">衣服、帽子和食物配件用于宠物摆件换装；实体制作与装配需要另行打样。</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="px-3 py-2 text-center text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">返回首页</Link>
          <button
            type="submit"
            disabled={isLocked}
            className="rounded-full bg-[var(--coral)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {phase === "error" ? "重试发布" : phase === "success" ? "重新发布当前资料" : isBusy ? phaseLabels[phase] : "确认并发布回忆"}
          </button>
        </div>
      </div>
    </form>
  );
}
