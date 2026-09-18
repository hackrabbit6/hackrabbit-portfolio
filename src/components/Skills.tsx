import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

const lead =
  '把一件事从想法做到能上线、能交付，并用 AI 把一个人的产出放大成一支队伍。'

const capabilities = [
  {
    title: 'AI 内容自动化',
    text: '把内容生产做成流水线：选题 → 调研 → 成稿 → 配图 → 发布包；用 AI 提效，人做事实与结论。',
    ai: 'agent 跑素材与初稿，我定选题、事实与结论。',
  },
  {
    title: '独立交付：想法 → 上线',
    text: '从开发、构建、打包到交付：Web 应用、iOS 出包、壳子对接，一个人走完流程。',
    ai: '用 agent 做原型与排查，我做产品判断与收口。',
  },
  {
    title: '跨端支付与 SDK 链路',
    text: '微信 / 支付宝 / 米大师：从拉起、回调到订单状态与多端兼容；把公共能力封成一套 SDK，供多款游戏接入。',
    ai: 'agent 列兼容矩阵，我盯支付链路与线上风险。',
  },
  {
    title: '复杂中后台',
    text: '多平台广告投放、供应链电子表格：复杂表单与表格、状态以服务端为准、状态回显与国际化。',
    ai: 'agent 搭常规结构，我审业务状态与验收。',
  },
]

export function Skills() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.from('.skill-card', {
      y: 48,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 78%' },
    })
  }, [])

  return (
    <section className="skills" id="skills">
      <div className="section-kicker">
        <p className="eyebrow">能力</p>
        <h2>我能交付什么</h2>
        <p className="skills-lead">{lead}</p>
      </div>
      <div className="skills-grid">
        {capabilities.map((item) => (
          <article className="skill-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <small>&gt; agent boost: {item.ai}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
