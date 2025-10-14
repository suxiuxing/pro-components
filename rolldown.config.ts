import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { esmExternalRequirePlugin } from 'rolldown/experimental';
import pkg from './package.json';

const external = () => {
  return esmExternalRequirePlugin({
    external: [
      /^antd/,
      /^dayjs/,
      'es-toolkit/compat',
      'react/jsx-runtime',
      'react-is',
      ...Object.keys(pkg.dependencies),
    ],
  });
};

export default defineConfig([
  {
    input: './src/index.ts',
    plugins: [dts(), external()],
    output: { dir: 'dist/esm', format: 'es' },
  },
  {
    input: './src/index.ts',
    plugins: [external()],
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  },
]);
