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
      {/* NOW 薄带已拆掉（决定 3）：现在的状态并入「在做什么」主角区块，
          这里只留 CREW —— 回答「用什么方式做」，不回答「在做什么」。 */}
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
