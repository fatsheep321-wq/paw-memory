"use client";

import jsQR from "jsqr";
import { createBaseStl, createEngravingSvg, validateStlBytes, validateSvgStructure } from "./artifacts";
import type { TagParameters } from "./types";

async function decodeSvgQr(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("SVG 无法渲染，因此不会开放雕刻下载。"));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 840;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("浏览器无法建立 SVG 验证画布。");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    return jsQR(pixels.data, pixels.width, pixels.height)?.data ?? null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type BrowserArtifactVerification = {
  baseValid: boolean;
  engravingValid: boolean;
  stl: Uint8Array | null;
  svg: string | null;
  details: string;
};

export async function verifyBrowserArtifacts(parameters: TagParameters, shareUrl: string, asciiLabel: string): Promise<BrowserArtifactVerification> {
  try {
    const stl = createBaseStl(parameters);
    const stlResult = validateStlBytes(stl, parameters);
    if (!stlResult.valid) {
      return { baseValid: false, engravingValid: false, stl: null, svg: null, details: stlResult.messages.join("；") };
    }

    if (!asciiLabel) {
      return { baseValid: true, engravingValid: false, stl, svg: null, details: "底座已通过重导入与闭合检查；请输入 ASCII 雕刻标签以验证面板。" };
    }

    const svg = createEngravingSvg(parameters, shareUrl, asciiLabel);
    const structure = validateSvgStructure(svg, parameters, shareUrl);
    if (!structure.valid) {
      return { baseValid: true, engravingValid: false, stl, svg: null, details: "雕刻 SVG 尺寸、图层或固定孔安全区检查未通过。" };
    }
    const decoded = await decodeSvgQr(svg);
    if (decoded !== shareUrl) {
      return { baseValid: true, engravingValid: false, stl, svg: null, details: "SVG 已渲染，但 QR 实际解码不等于当前回忆网址。" };
    }

    return {
      baseValid: true,
      engravingValid: true,
      stl,
      svg,
      details: `已重导 STL 并确认闭合；SVG 渲染后 QR 解码为 ${decoded}`,
    };
  } catch (error) {
    return {
      baseValid: false,
      engravingValid: false,
      stl: null,
      svg: null,
      details: error instanceof Error ? error.message : "制造文件验证失败。",
    };
  }
}
