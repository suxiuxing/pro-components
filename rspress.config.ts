import {join} from 'node:path';
import {defineConfig} from '@rspress/core';
import {pluginLlms} from '@rspress/plugin-llms';
import {pluginSitemap} from '@rspress/plugin-sitemap';
import {pluginApiDocgen} from '@rspress/plugin-api-docgen';
import {pluginPreview} from '@rspress/plugin-preview';

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
