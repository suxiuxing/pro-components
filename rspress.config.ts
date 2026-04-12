import { join } from 'node:path';

import { defineConfig } from '@rspress/core';
import { pluginApiDocgen } from '@rspress/plugin-api-docgen';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginSitemap } from '@rspress/plugin-sitemap';

export default defineConfig({
  root: join(__dirname, 'docs'),
  plugins: [
    pluginLlms(),
    pluginSitemap({
      siteUrl: 'https://suxiuxing.github.io/pro-components/',
    }),
    pluginApiDocgen(),
    pluginPreview(),
  ],
});
