// 公众号长文的唯一数据源（NIGHT-MAP.md 的地标 lab 对应 /writing/ 与 /now/）。
// 首页的「最近更新」与写作页的列表都读这里，避免两处各写一份数字。
//
// date 取自文章页里的 create_time（Unix 时间戳）按东八区换算，不是估的。
// 新增文章：补一条，date 填发布日期，列表会自动按日期倒序。

export type Article = { title: string; href: string; summary?: string; date?: string }

export const articles: Article[] = [
  {
    title: '用 AI 学习，为什么有人学得更快，有人只是更快抄完？',
    date: '2026-08-10',
    href: 'https://mp.weixin.qq.com/s/TXXY8mF-R0SpYEPfIkeIAQ',
    summary: '完成得快不等于学会了：撤掉 AI 再做一遍，才知道有没有真会。',
  },
  {
    title: '近 9 成健康搜索出现 AI 摘要，排第一也不能直接信',
    date: '2026-08-08',
    href: 'https://mp.weixin.qq.com/s/xTFSXX-GoId90nqUuyg57Q',
    summary: 'AI 摘要已成健康搜索的默认入口，但它引的来源和原研究常对不上。',
  },
  {
    title: '简历、合同发给 AI 安全吗？最长可能留 5 年',
    date: '2026-07-25',
    href: 'https://mp.weixin.qq.com/s/VmF8_zQNecOLFsumIF8gPw',
    summary: '各家留存规则不同，「删除聊天」不等于删除，最长可能留 5 年。',
  },
  {
    title: '50 款 AI 工具，普通人不用全装',
    date: '2026-07-20',
    href: 'https://mp.weixin.qq.com/s/g_j_fP9HmOfHaw-stvEeZw',
    summary: '不用装满 50 款：先留一个常用助手、一个能给出来源的搜索入口。',
  },
  {
    title: '连续 5 年赚 30%，概率约 1/595,000',
    date: '2026-07-14',
    href: 'https://mp.weixin.qq.com/s/ZXoxNGGSZkRXwWoFDAgKIQ',
    summary: '把「稳定年化」换算成概率，这件事还成不成立就清楚了。',
  },
  {
    title: '4 次全对，也不能证明你用 AI',
    date: '2026-07-13',
    href: 'https://mp.weixin.qq.com/s/7NO4TQt9fV-zbW97Lz4Mtg',
    summary: '检测分数只是嫌疑提示；真被质疑时，能自证的是版本历史和草稿。',
  },
  {
    title: '金价半年跌 25%：该慌的和该高兴的，不是同一批人',
    date: '2026-07-03',
    href: 'https://mp.weixin.qq.com/s/RZyJpzKxvAf4FSKmNIO0Kw',
    summary: '同一波下跌，央行在买、抢金的人在套：先分清你属于哪一类。',
  },
]

export const writingCount = articles.length

// 日期全齐才按日期倒序；否则维持人工顺序（新 → 旧）。
const allDated = articles.every((a) => a.date)

export const ordered: Article[] = allDated
  ? [...articles].sort((a, b) => (b.date as string).localeCompare(a.date as string))
  : articles

/** 最新一篇的完整发布日期，例如 2026-08-10；日期没填齐时为 null */
export const latestDate: string | null = allDated ? ((ordered[0].date as string) ?? null) : null

/** 最新一篇的年月，例如 2026-08，用于列表标签 */
export const latestMonth: string | null = latestDate ? latestDate.slice(0, 7) : null
