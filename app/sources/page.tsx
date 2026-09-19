import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "模型来源与许可证" };

const sources = [
  {
    status: "采用并改编",
    name: "scadqr / demo_tag.scad",
    url: "https://github.com/xypwn/scadqr/tree/a27e1feeed8b048b730fcd2620c0021b3b52a283",
    commit: "a27e1feeed8b048b730fcd2620c0021b3b52a283",
    author: "Darwin Schuppan and contributors",
    license: "MIT",
    detail: "采用圆角底板、固定孔与 QR padding 的结构思路。项目以 TypeScript／Three.js 重新实现，ZIP 附原 MIT LICENSE 与修改说明。基于开源模型改编，不宣称完全原创。",
  },
  {
    status: "已评估，未复制／未分发",
    name: "parametric-fabric-generator",
    url: "https://github.com/Xipit/parametric-fabric-generator/tree/2075e9a89a97850fd1732e9b2b7a3f9c7d933c01",
    commit: "2075e9a89a97850fd1732e9b2b7a3f9c7d933c01",
    author: "Hanno Witzleb / Xipit",
    license: "无仓库级 LICENSE；嵌入模型各自不同",
    detail: "没有把 README 的聚合许可视为具体模型许可；不复制 SCAD/STL，也不提供其面料下载。页面柔性网格是项目自建参照。",
  },
  {
    status: "已评估，未集成",
    name: "openscad-web-gui",
    url: "https://github.com/seasick/openscad-web-gui/tree/759feee04f5dbf846f4608c3359d5c157256fef3",
    commit: "759feee04f5dbf846f4608c3359d5c157256fef3",
    author: "Clemens",
    license: "GPL-3.0",
    detail: "这是工具而不是模型；没有集成、复制或分发代码。",
  },
];

export default function SourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold tracking-[0.16em] text-[var(--coral-dark)]">MODEL SOURCES</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">模型来源与许可评估</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]">采用、未采用与不可分发的边界分别记录；制造预览不是来源不明模型的重新包装。</p>
      <div className="mt-10 grid gap-5">
        {sources.map((source) => (
          <article key={source.name} className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold tracking-[0.12em] text-[var(--coral-dark)]">{source.status}</p><h2 className="mt-2 text-2xl font-semibold">{source.name}</h2></div><span className="rounded-full bg-[var(--sage-light)] px-3 py-1.5 text-xs font-semibold text-[#52634f]">{source.license}</span></div>
            <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-[8rem_1fr]"><dt className="text-[var(--muted)]">作者</dt><dd>{source.author}</dd><dt className="text-[var(--muted)]">固定 commit</dt><dd className="break-all font-mono text-xs">{source.commit}</dd></dl>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{source.detail}</p>
            <a href={source.url} className="mt-4 inline-flex text-sm font-semibold text-[var(--coral-dark)] underline">查看固定版本项目</a>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] border border-orange-200 bg-orange-50 p-6 text-sm leading-7 text-orange-950/75"><strong>制造边界：</strong>项目没有实现照片转 3D、服装 STL 或实际合身设计；材料、公差、固定强度、防水性和宠物穿戴安全都待实物验证。没有激光功率、速度或 G-code。</div>
      <Link href="/make/demo" className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">返回制造工作台</Link>
    </section>
  );
}
