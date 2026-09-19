import Link from "next/link";
import { StoryStudio } from "@/app/components/story-studio";
import { Reveal } from "@/app/components/reveal";

export default function Home() {
  return <div className="pawstory-home">
    <section className="ps-hero"><div className="hero-copy"><span className="eyebrow hero-enter">PAWSTORY / 爪爪奇遇</span><h1 className="hero-enter hero-enter-2">让陪伴<br />拥有<span>形状，</span><br />让回忆<span className="handwritten">再次发生。</span></h1><p className="hero-enter hero-enter-3">一张照片，一个可以换装的小小分身。<br />一件配件，一段被重新唤醒的陪伴。</p><div className="hero-actions"><Link className="ps-button" href="/studio">创造它的奇遇 ↗</Link><Link className="ps-text-link" href="/awaken/demo">先唤醒一段回忆 ✦</Link></div><div className="hero-footnote"><span>3D 打印摆件</span><i /> <span>激光雕刻立牌</span><i /> <span>配件故事</span></div></div><div className="hero-object"><StoryStudio compact /><div className="floating-note">小小的它，<br />装着大大的回忆。<span>♡</span></div></div></section>
    <section className="ps-manifesto"><Reveal><span className="eyebrow">NOT JUST ANOTHER FIGURINE</span><h2>相册里的它，<br />也可以陪在你的桌边。</h2><p>照片和视频不必沉睡在手机里。让熟悉的模样成为可以触摸的作品，<br className="desktop-break" />再用一次换装，把平凡的某一天带回眼前。</p></Reveal></section>
    <section className="ps-process"><div className="section-heading"><span className="eyebrow">FROM A PHOTO TO A LITTLE ADVENTURE</span><h2>四步，让陪伴有形。</h2></div><div className="process-grid">{[
      ["01", "留下它的模样", "挑选一张喜欢的照片，在 MakerMuse 创作模型或雕刻图案。", "PHOTO"],
      ["02", "把喜欢握在手里", "用 3D 打印制作宠物摆件，或用激光雕刻制作平面立牌。", "MAKE"],
      ["03", "为配件装进故事", "雨衣、生日帽、小零食，分别连接一段视频和专属问候。", "DRESS"],
      ["04", "扫码，让回忆发生", "静态作品渐渐恢复颜色，过渡到真实的宠物影像。", "AWAKEN"],
    ].map(([n, title, text, label]) => <Reveal key={n}><article><div><span>{n}</span><small>{label}</small></div><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></section>
    <section className="ps-stories"><div className="section-heading"><span className="eyebrow">A WARDROBE OF MEMORIES</span><h2>换上的，是那一天。</h2><p>衣服、帽子和食物配件，属于桌边的宠物分身。<br />每一个小物件，都可以成为故事入口。</p></div><div className="story-cards">{[
      ["rain", "☂", "雨衣", "那场没躲开的雨", "雨再大，有你在就是好天气。"],
      ["birthday", "✦", "生日帽", "愿望里一直有你", "每一年的愿望，都是你在身边。"],
      ["snack", "♡", "小零食", "幸福是一块小饼干", "最普通的一天，也值得再看一遍。"],
    ].map(([key, icon, name, title, quote]) => <Link key={key} href={`/studio?accessory=${key}`} className={`story-card card-${key}`}><div className="story-symbol">{icon}</div><small>{name} / 故事灵感</small><h3>{title}</h3><p>“{quote}”</p><span>为它留一个故事 ↗</span></Link>)}</div></section>
    <section className="ps-two-worlds"><div className="world-photo"><img src="/demo/pet-cover.jpg" alt="穿着黄色雨衣的豆包" /><span>从可以触摸的作品，到会动的陪伴。</span></div><div><span className="eyebrow">TOUCH THE OBJECT. FEEL THE MEMORY.</span><h2>它不只是<br />一个模型。</h2><p>它是雨天的一次散步，是生日时摇晃的尾巴，也是等你回家时亮起来的眼睛。</p><p>让照片成为作品，让配件成为故事入口。让值得珍藏的时刻，以更有温度的方式留在身边。</p><Link href="/awaken/demo" className="ps-button">唤醒豆包的雨天回忆 ✦</Link></div></section>
    <section className="ps-final"><span className="eyebrow">LET YOUR NEXT STORY BEGIN</span><h2>每段陪伴，都值得一场奇遇。</h2><Link href="/studio" className="ps-button">开始创造 PawStory ↗</Link><p>当前提供示例换装、GLB 导入、真实视频故事与配件二维码。<br />照片生成在 MakerMuse 完成；实体制作与配件装配需另行打样。</p></section>
  </div>;
}
