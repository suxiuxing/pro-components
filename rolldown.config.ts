import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig([
  {
    input: './src/index.ts',
    plugins: [dts()],
    output: { dir: 'dist/esm', format: 'es' },
    external: ['react', 'react-dom', 'antd'],
  },
  {
    input: './src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
    },
    external: ['react', 'react-dom', 'antd'],
  },
]);
