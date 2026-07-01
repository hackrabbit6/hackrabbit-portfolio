import { HackRabbitMark } from './HackRabbitMark'
import './Contact.css'

const next = ['博客', 'GitHub 项目', '自媒体']

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
      <div className="next-grid" aria-label="后续分期入口">
        {next.map((item) => (
          <a href="#" className="next-card" key={item} aria-label={`${item} 即将上线`}>
            <span>soon</span>
            <strong>{item}</strong>
            <p>Phase {next.indexOf(item) + 2}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
