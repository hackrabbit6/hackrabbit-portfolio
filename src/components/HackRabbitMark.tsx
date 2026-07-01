import './HackRabbitMark.css'

export function HackRabbitMark({ compact = false }: { compact?: boolean }) {
  return (
    <pre className={compact ? 'hackrabbit-mark compact' : 'hackrabbit-mark'} aria-label="hackrabbit mark">
{`(\\(\\
(•ᴥ•)
/ づ`}
    </pre>
  )
}
