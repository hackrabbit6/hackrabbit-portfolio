import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Crew.css'

const crew = [
  {
    agent: 'Claude Code',
    role: '规划 / 大段重构 / code review',
    flow: '我先用第一性原理把问题拆成 spec,再让它产出实现计划和 review 意见,最后我收口取舍。',
  },
  {
    agent: 'Codex 桌面版',
    role: '执行 / GUI / 截图 / 高频重复',
    flow: '我把已经对齐的计划交给它落地,浏览器验证、截图和重复检查由它跑,我验收最终 diff。',
  },
  {
    agent: 'OpenSpec 工作流',
    role: '规范 / 边界 / 防跑偏',
    flow: '我先用规范把需求、约束和验收写清楚,再进入实现,避免 vibe coding 把问题越做越散。',
  },
]

export function Crew() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.crew',
          start: 'top top',
          end: '+=1200',
          pin: true,
          scrub: true,
        },
      })
      tl.from('.crew-card', { xPercent: 40, opacity: 0, stagger: 0.5 })
      return () => tl.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="crew" id="crew">
      <div className="crew-heading">
        <p className="eyebrow">My AI Crew</p>
        <h2>我不是一个人写代码,我管理一队 AI 智能体。</h2>
        <p>我保留方向判断、业务取舍和最终验收,把能被规范化的执行交给 agent。</p>
      </div>
      <div className="crew-track">
        {crew.map((item) => (
          <article className="crew-card" key={item.agent}>
            <p>&gt; status: online</p>
            <h3>{item.agent}</h3>
            <strong>{item.role}</strong>
            <span>{item.flow}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
