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
        {/* 合作在前、全职在后 —— 与首屏的「独立优先」口径一致，见 CONTEXT.md。
            CJK 默认可在任意两字之间断行，词组要逐个锁住不许拆。 */}
        <h2>
          <span className="nowrap">接项目</span>，也<span className="nowrap">接合作</span>。
        </h2>
        <p>我能交付稳定业务,也能把 AI 流程做成可运行产品。</p>
        <p className="contact-secondary">
          也看合适的<span className="nowrap">全职机会</span>，
          <span className="nowrap">AI 应用</span>与<span className="nowrap">远程</span>优先。
        </p>
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
