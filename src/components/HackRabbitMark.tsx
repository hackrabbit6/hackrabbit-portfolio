import './HackRabbitMark.css'

export function HackRabbitMark({ compact = false }: { compact?: boolean }) {
  // role="img" 才能让读屏软件把整块 ASCII 当一张图读出 aria-label；
  // 只写 aria-label 的话 <pre> 是 generic role，读屏会逐个念里面的符号。
  return (
    <pre
      className={compact ? 'hackrabbit-mark compact' : 'hackrabbit-mark'}
      role="img"
      aria-label="hackrabbit 的 ASCII 兔子标记"
    >
{`(\\(\\
(•ᴥ•)
/ づ`}
    </pre>
  )
}
