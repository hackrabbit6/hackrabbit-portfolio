// 最小化的 node 类型声明。
//
// 仓库没有装 @types/node（不想为了一个构建期的小功能多一个依赖），
// 而 sitemap 需要在构建时读文件、问 git 要最后提交时间。
// 这里只声明实际用到的那几个 API，不污染全局类型。
//
// 如果以后装了 @types/node，删掉这个文件即可。
declare module 'node:child_process' {
  export function execFileSync(
    file: string,
    args: string[],
    options: {
      encoding: 'utf8'
      stdio: ['ignore', 'pipe', 'ignore']
    },
  ): string
}

declare module 'node:path' {
  export function relative(from: string, to: string): string
  export function dirname(p: string): string
  export function resolve(...parts: string[]): string
}

declare const process: { cwd(): string }

declare module 'node:fs' {
  export function readFileSync(path: string, encoding: 'utf8'): string
  export function existsSync(path: string): boolean
}
