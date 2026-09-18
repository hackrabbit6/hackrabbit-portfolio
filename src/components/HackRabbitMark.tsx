import './HackRabbitMark.css'

export function HackRabbitMark({ compact = false }: { compact?: boolean }) {
  return (
    <img
      className={compact ? 'hackrabbit-mark compact' : 'hackrabbit-mark'}
      src="/rabbit.svg"
      alt="黑兔实验室的玉兔标记"
      width={compact ? 44 : 88}
      height={compact ? 44 : 88}
    />
  )
}
