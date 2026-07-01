import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { HackRabbitMark } from './HackRabbitMark'
import { HeroCanvas } from './HeroCanvas'
import './Hero.css'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Hero() {
  const [showCanvas, setShowCanvas] = useState(false)

  useEffect(() => {
    const reduce = reducedMotion()
    setShowCanvas(window.innerWidth >= 768 && !reduce)
    if (reduce) return

    gsap.from('.hero-reveal', {
      y: 28,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
    })
  }, [])

  return (
    <section className={showCanvas ? 'hero-act' : 'hero-act static'} id="top">
      {showCanvas ? <HeroCanvas /> : null}
      <nav className="site-nav" aria-label="主导航">
        <a className="brand" href="#top">
          <span>hackrabbit</span>
          <small>cinematic operator</small>
        </a>
        <div>
          <a href="#crew">AI Crew</a>
          <a href="#work">作品</a>
          <a href="#skills">能力</a>
          <a href="#experience">经历</a>
          <a href="#contact">联系</a>
        </div>
      </nav>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-reveal">frontend operator / hackrabbit</p>
          <h1 className="hero-reveal">
            <span>4-5 年前端交付</span> + 我用<span>第一性原理</span>思考、指挥一队{' '}
            <span>AI 智能体</span>,把活干得更快更稳。
          </h1>
          <p className="lead hero-reveal">
            我先用稳定的业务前端交付建立可信度，再把 AI 当成执行队伍来放大产出。写码、联调、验收我都做，只是现在会把可拆给 agent 的重复活交出去。
          </p>
          <p className="crew-status hero-reveal">&gt; crew: 3 agents online</p>
          <a className="scroll-cue hero-reveal" href="#manifesto">scroll to enter</a>
        </div>
        <div className="hero-mark hero-reveal">
          <HackRabbitMark />
        </div>
      </div>
    </section>
  )
}
