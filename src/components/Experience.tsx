import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Experience.css'

const experience = [
  {
    company: '九月稻田',
    role: '前端开发工程师',
    time: '2024.03 - 2024.08',
    detail: '广告买量系统：Vue3 + Vite 页面、接口联调、多平台投放流程与国际化。',
  },
  {
    company: '602 游戏',
    role: '前端开发工程师',
    time: '2021.10 - 2024.01',
    detail: 'H5 SDK、充值活动、公众号业务与桌面端工具；支付对接、移动端适配、壳包通信。',
  },
  {
    company: '嘉仕软件江苏有限公司',
    role: '前端开发工程师',
    time: '2021.03 - 2021.10',
    detail: '供应链与数据管理平台：复杂表格、报表、公式计算与性能优化。',
  },
  {
    company: '广州顶点思维教育科技有限公司',
    role: '前端开发工程师',
    time: '2019.11 - 2021.03',
    detail: '教育平台学生端 / 教师端与后台；Vue H5、Android 原生调用与 Socket 通信。',
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
    <section className="experience paper" id="experience">
      <div className="section-kicker">
        <p className="eyebrow">经历</p>
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
