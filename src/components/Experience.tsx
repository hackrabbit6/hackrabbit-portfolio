import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Experience.css'

const experience = [
  {
    company: '独立开发',
    role: '前端 / AI 应用',
    time: '2024.08 - 至今',
    detail:
      'AI 音乐生成、数字亲人等应用原型与本地工具；用 Bun + Elysia、Go + Gin 补轻量接口与全栈联调。',
  },
  {
    company: '九月稻田',
    role: '前端开发工程师',
    time: '2024.03 - 2024.08',
    detail:
      '广告买量系统：Vue3 + Vite 多平台投放（创建 / 推送 / 暂停）、复杂表单与状态回显、vue-i18n 国际化。',
  },
  {
    company: '602 游戏',
    role: '前端开发工程师',
    time: '2021.10 - 2024.01',
    detail:
      'H5 游戏发行 SDK、充值活动与公众号业务；微信 / 支付宝支付链路、壳包通信与多端兼容，另做过 TikTok 弹幕捕捉桌面工具。',
  },
  {
    company: '嘉仕软件江苏有限公司',
    role: '前端开发工程师',
    time: '2021.03 - 2021.10',
    detail: '供应链电子表格系统：动态表格、公式计算、报表展示与渲染性能优化。',
  },
  {
    company: '广州顶点思维教育科技有限公司',
    role: '前端开发工程师',
    time: '2019.11 - 2021.03',
    detail: '教育平台学生端 / 教师端：Vue H5 WebApp、扫码拍照、Socket 通信与 Android 原生能力调用。',
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
