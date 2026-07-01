import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Manifesto.css'

const pillars = ['健康', '现金流', '认知', 'AI']

export function Manifesto() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.to('.manifesto-title', {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
    })

    gsap.from('.pillar', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pillars', start: 'top 80%' },
    })
  }, [])

  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto-title">
        <p className="eyebrow">first principles</p>
        <h2>先证明我能稳定交付业务前端，再展示我能把 AI 能力接进真实产品流程。</h2>
      </div>
      <p className="manifesto-copy">
        我不是追一个更炫的身份标签。我把健康、现金流、认知和 AI 当成决策支柱,先守住能长期工作的底盘,再让智能体放大我已经能交付的东西。
      </p>
      <div className="pillars" aria-label="四个判断支柱">
        {pillars.map((pillar, index) => (
          <article className="pillar" key={pillar}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{pillar}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
