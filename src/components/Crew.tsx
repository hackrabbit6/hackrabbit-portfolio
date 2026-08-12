import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Crew.css'

const crew = [
  { agent: 'Claude Code', role: '规划 / 大段重构 / code review' },
  { agent: 'Codex 桌面版', role: '执行 / GUI / 截图 / 高频重复' },
  { agent: 'herdr', role: '多 agent 管理 / 运行状态' },
]

export function Crew() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.from('.band-row', {
      y: 24,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.band', start: 'top 88%' },
    })
  }, [])

  return (
    <section className="band" id="crew">
      <div className="band-row">
        <p className="band-label">现在</p>
        <p className="band-now">2026 起 · 独立开发 / AI 工具与前端实验</p>
      </div>
      <div className="band-row">
        <p className="band-label">AI 工具</p>
        <ul className="crew-list">
          {crew.map((item) => (
            <li className="crew-item" key={item.agent}>
              <strong>{item.agent}</strong>
              <span>{item.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
