import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { esmExternalRequirePlugin } from 'rolldown/experimental';

const external = () => {
  return esmExternalRequirePlugin({
    external: ['antd', 'dayjs', 'react', 'react/jsx-runtime', 'react-dom'],
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
