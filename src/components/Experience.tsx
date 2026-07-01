import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Experience.css'

const experience = [
  {
    company: '九月稻田',
    role: '前端开发工程师',
    time: '2024.03 - 2024.08',
    detail: '我在广告买量系统里交付 Vue3 + Vite 页面、接口联调、多平台广告投放流程和国际化配置。',
  },
  {
    company: '602 游戏',
    role: '前端开发工程师',
    time: '2021.10 - 2024.01',
    detail: '我把 H5 SDK、充值活动、公众号业务和桌面端工具推进上线,处理支付对接、移动端适配、壳包通信和 WebSocket 数据解析。',
  },
  {
    company: '嘉仕软件江苏有限公司',
    role: '前端开发工程师',
    time: '2021.03 - 2021.10',
    detail: '我在供应链与数据管理平台里交付复杂表格、数据展示、报表功能、公式计算和性能优化。',
  },
  {
    company: '广州顶点思维教育科技有限公司',
    role: '前端开发工程师',
    time: '2019.11 - 2021.03',
    detail: '我在教育平台里做学生端、教师端和后台维护,把 Vue H5 WebApp、Android 原生能力调用和 Socket 通信接进业务。',
  },
]

export function Experience() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
      gsap.from(item, {
        x: -36,
        opacity: 0.4,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 82%', toggleClass: 'is-lit' },
      })
    })
  }, [])

  return (
    <section className="experience" id="experience">
      <div className="section-kicker">
        <p className="eyebrow">experience</p>
        <h2>工作经历</h2>
      </div>
      <div className="timeline">
        {experience.map((item) => (
          <article className="timeline-item" key={`${item.company}-${item.time}`}>
            <time>{item.time}</time>
            <div>
              <h3>{item.company}</h3>
              <p>{item.role}</p>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
