import { StoryStudio } from "@/app/components/story-studio";
export const metadata = { title: "奇遇创作台" };
export default function StudioPage() { return <section className="ps-studio-page"><div className="section-heading"><span className="eyebrow">THE PAWSTORY ATELIER</span><h1>给小小的它，<br />一个大大的故事。</h1><p>选择作品形态，为配件关联回忆，再把故事带到手边。</p></div><StoryStudio /></section>; }
