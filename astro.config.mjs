// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // 生产 origin：canonical / og:image / og:url 需要绝对地址。
  site: 'https://hackrabbit.cc.cd',
  integrations: [react()]
});