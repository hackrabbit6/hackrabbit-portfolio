import { HackRabbitMark } from './HackRabbitMark'
import './Contact.css'

const next = [
  { label: '项目案例', meta: '过程与判断', href: '/work/' },
  { label: 'GitHub', meta: '公开代码', href: 'https://github.com/hackrabbit6' },
  { label: '下载简历', meta: 'PDF', href: '/resume.pdf' },
]

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-main">
        <p className="eyebrow">contact</p>
        <h2>我在找前端、中级前端、偏前端全栈和 AI 应用前端机会。</h2>
        <p>我能交付稳定业务,也能把 AI 流程做成可运行产品。</p>
        <HackRabbitMark compact />
        <div className="contact-links">
          <a href="mailto:hackrabbit6@gmail.com">hackrabbit6@gmail.com</a>
          <a href="https://github.com/hackrabbit6" target="_blank" rel="noreferrer">
            github.com/hackrabbit6
          </a>
        </div>
      </div>
      <div className="next-grid" aria-label="继续了解">
        {next.map((item) => (
          <a href={item.href} className="next-card" key={item.label}>
            <span>explore</span>
            <strong>{item.label}</strong>
            <p>{item.meta} →</p>
          </a>
        ))}
      </div>
    </section>
  )
}
