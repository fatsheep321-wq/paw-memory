"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { PetAvatar, accessories, type Accessory, type Animal } from "./pet-avatar";
import { DEMO_OBJECT_URL, qrReliefStl } from "@/lib/fabrication/qr-relief";
import { Awakening } from "./awakening";

export function StoryStudio({ compact = false }: { compact?: boolean }) {
  const [animal, setAnimal] = useState<Animal>("dog");
  const [printing, setPrinting] = useState(false);
  const [accessory, setAccessory] = useState<Accessory>("rain");
  const [mode, setMode] = useState<"model" | "engraving">("model");
  const [modelUrl, setModelUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("/demo/pet-cover.jpg");
  const [bindings, setBindings] = useState<Partial<Record<Accessory, string>>>({});
  const [urlInput, setUrlInput] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showMemory, setShowMemory] = useState(false);
  const urls = useRef<string[]>([]);
  const active = accessories[accessory];
  const objectUrl = bindings[accessory] ? `${bindings[accessory]}?accessory=${accessory}` : DEMO_OBJECT_URL;
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("pawstory-accessory-links-v1") || "{}");
      const cleaned: Partial<Record<Accessory, string>> = {};
      for (const key of ["rain", "birthday", "snack"] as const) if (typeof saved[key] === "string" && /^https:\/\/paw-memory404\.vercel\.app\/m\/[0-9a-f-]{36}$/.test(saved[key])) cleaned[key] = saved[key];
      const params = new URLSearchParams(window.location.search); const id = params.get("memory");
      const chosen = params.get("accessory");
      if (chosen === "rain" || chosen === "birthday" || chosen === "snack") setAccessory(chosen);
      if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        const key: Accessory = chosen === "birthday" || chosen === "snack" ? chosen : "rain";
        cleaned[key] = `https://paw-memory404.vercel.app/m/${id}`;
        localStorage.setItem("pawstory-accessory-links-v1", JSON.stringify(cleaned));
      }
      setBindings(cleaned);
    } catch { setNotice("浏览器不允许保存配置，本次仍可生成和下载二维码。"); }
    return () => urls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => { setUrlInput(bindings[accessory] || ""); setError(""); setShowMemory(false); }, [accessory, bindings]);
  useEffect(() => {
    let active = true; setQr("");
    QRCode.toDataURL(objectUrl, { width: 600, margin: 4, errorCorrectionLevel: "M" }).then((value) => { if (active) setQr(value); }).catch(() => { if (active) setError("二维码生成失败，请重试。"); });
    return () => { active = false; };
  }, [objectUrl]);
  async function downloadPrintableQr() {
    setPrinting(true); setError("");
    try {
      const data=qrReliefStl(objectUrl);
      const url=URL.createObjectURL(new Blob([data],{type:"model/stl"}));
      const link=document.createElement("a"); link.href=url; link.download=`pawstory-${animal}-${accessory}-${bindings[accessory] ? "story" : "demo"}-qr-60mm.stl`; link.click();
      window.setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch {setError("打印文件生成失败，请重试。");} finally {setPrinting(false);}
  }
  function bind() {
    try {
      const url = new URL(urlInput.trim());
      if (url.origin !== "https://paw-memory404.vercel.app" || !/^\/m\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(url.pathname)) throw new Error();
      const next = { ...bindings, [accessory]: `${url.origin}${url.pathname}` }; setBindings(next); setError("");
      try { localStorage.setItem("pawstory-accessory-links-v1", JSON.stringify(next)); } catch { setNotice("配置未保存在此浏览器，请下载二维码留存。"); }
    } catch { setError("请粘贴发布成功后获得的本站 /m/回忆编号 链接。"); }
  }
  function loadFile(file: File | undefined, model: boolean) {
    if (!file) return;
    if (file.size > (model ? 30 : 10) * 1024 * 1024 || (model ? !file.name.toLowerCase().endsWith(".glb") : !["image/jpeg", "image/png", "image/webp"].includes(file.type))) { setError(model ? "请选择 30 MB 内的 GLB 模型。" : "请选择 10 MB 内的 JPEG、PNG 或 WebP 照片。"); return; }
    const url = URL.createObjectURL(file); urls.current.push(url); setError("");
    if (model) setModelUrl(url); else setPhotoUrl(url);
  }
  return <div className={`story-studio ${compact ? "studio-compact" : ""}`}>
    <div className="studio-main">
      <div className="studio-toolbar"><span className="eyebrow">YOUR LITTLE COMPANION</span><div className="segmented"><button type="button" aria-pressed={mode === "model"} onClick={() => setMode("model")}>3D 摆件</button><button type="button" aria-pressed={mode === "engraving"} onClick={() => setMode("engraving")}>雕刻立牌</button></div></div>
      <div className="animal-picker" aria-label="选择示例宠物">{([["dog","小狗","忠实的小伙伴"],["cat","小猫","慵懒的小冒险家"],["alpaca","羊驼","软乎乎的好朋友"]] as const).map(([key,name,desc])=><button type="button" key={key} aria-pressed={animal===key} onClick={()=>{setAnimal(key);setModelUrl("");}}><strong>{name}</strong><small>{desc}</small></button>)}</div>
      <div className={`companion-scene scene-${accessory}`}>
        <div className="scene-orbit" />
        {mode === "model" ? <PetAvatar accessory={accessory} animal={animal} qrUrl={objectUrl} modelUrl={modelUrl || undefined} /> : <div className="engraving-object"><div className="engraving-board"><img src={photoUrl} alt="宠物照片的雕刻风格视觉预览" />{qr && <img className="engraving-object-qr" src={qr} alt="立牌上的故事二维码" />}<span>PAWSTORY · 爪爪奇遇</span></div><div className="engraving-base" /></div>}
        <div className="scene-label"><span>{mode === "model" ? "01 / 可触摸的分身" : "02 / 留在木纹里的模样"}</span><strong>{active.name} · {active.title}</strong></div>
      </div>
      <div className="accessory-picker" aria-label="为实体分身选择配件">{(Object.keys(accessories) as Accessory[]).map((key) => <button type="button" key={key} aria-pressed={accessory === key} onClick={() => setAccessory(key)}><span style={{ background: accessories[key].color }}>{accessories[key].icon}</span><strong>{accessories[key].name}</strong><small>{key === "rain" ? "雨天散步" : key === "birthday" ? "生日回忆" : "日常小故事"}</small></button>)}</div>
      <p className="small-note">{modelUrl ? "已导入本地 GLB。配件暂未自动适配导入模型；选择配件仍可绑定故事。" : "原创示例摆件与配件，用于演示换装；不是照片生成结果；可下载的 STL 是作品前方的浮雕二维码牌。"}{mode === "engraving" && " 雕刻图为视觉效果，制作需使用 MakerMuse 导出的文件。"}</p>
    </div>
    {!compact && <aside className="story-binding"><span className="eyebrow">EVERY ACCESSORY TELLS A STORY</span><h2>{active.title}</h2><p className="story-quote">“{active.greeting}”</p><p>给这件小配件，留下一段只属于你们的回忆。</p>
      <Link className="ps-button" href={`/create?accessory=${accessory}`}>为{active.name}上传故事 ↗</Link>
      <label className="binding-label">或关联已发布的故事<input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="粘贴你的回忆页面链接" /></label><button type="button" className="ps-button secondary" onClick={bind}>保存配件链接，生成二维码</button>
      {error && <p role="alert" className="form-error">{error}</p>}{notice && <p className="small-note">{notice}</p>}
      {qr && <div className="binding-qr"><img src={qr} alt={`${active.name}的专属故事二维码`} /><a href={qr} download={`pawstory-${accessory}.png`}>下载二维码图片 ↓</a><a href={objectUrl} target="_blank" rel="noreferrer">打开关联故事 ↗</a><small>{bindings[accessory] ? "已绑定你的故事。请打开确认内容正确。" : "当前为豆包示例二维码；绑定自己的故事后，牌上的二维码和 STL 会同步更新。"}</small></div>}
      <div className="qr-print-card"><span className="eyebrow">QR IS PART OF THE OBJECT</span><h3>把故事，打印在作品上。</h3><p>60 × 60 mm 独立固定牌，底厚 2 mm、二维码浮雕 0.8 mm。可装在摆件底座或立牌上。</p><button type="button" className="ps-button" disabled={printing} onClick={downloadPrintableQr}>{printing ? "正在生成…" : bindings[accessory] ? "下载专属浮雕二维码 STL ↓" : "下载示例浮雕二维码 STL ↓"}</button><small>STL 已包含二维码立体轮廓。导入切片软件后，为浅色底板和深色浮雕设置换色，再生成适合你的打印机的文件。STL 不保存颜色；打印后需实际扫码确认。此文件仅包含二维码牌。</small></div>
      <p className="small-note">每件配件可使用不同的已发布故事。绑定配置仅保存在此浏览器；下载的二维码可跨设备打开云端回忆。</p>
    </aside>}
    {!compact && <>
      <section className="maker-handoff"><div><span className="eyebrow">PHOTO → OBJECT</span><h2>从一张照片，开始创造。</h2><p>在 MakerMuse 上传照片，创作宠物模型或雕刻图案。完成后导入 GLB 查看，或将制作文件交给打印与雕刻设备。</p><a className="ps-button" href="https://www.makermuse.ai/" target="_blank" rel="noreferrer">前往 MakerMuse 创作 ↗</a><p className="small-note">外部创作工具；本站未接入其生成 API，不会自动传送你的照片。</p></div><div className="import-actions"><label>导入宠物模型 · GLB<input type="file" accept=".glb" onChange={(event) => loadFile(event.target.files?.[0], true)} /></label><label>更换雕刻预览照片<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => loadFile(event.target.files?.[0], false)} /></label>{modelUrl && <button type="button" onClick={() => setModelUrl("")}>返回示例摆件</button>}<small>导入文件仅用于当前浏览器预览，刷新后需重新选择。请保留原始制作文件。</small></div></section>
      <section className="studio-awaken"><span className="eyebrow">A MEMORY COMES ALIVE</span><h2>静止的模样，再次有了温度。</h2><p>体验模型恢复颜色、照片显现，再进入真实视频的过渡。此处统一播放豆包示例，并非所选猫或羊驼的真实影像。</p><button type="button" className="ps-button secondary" onClick={() => setShowMemory(!showMemory)}>{showMemory ? "收起示例" : "体验唤醒动效 ✦"}</button>{showMemory && <Awakening photoUrl="/demo/pet-cover.jpg" videoUrl="/demo/pet-memory.mp4" petName="豆包" warmMessage={accessories.rain.greeting} accessory={accessory} animal={animal} sculpture={mode === "model"} />}</section>
    </>}
  </div>;
}
