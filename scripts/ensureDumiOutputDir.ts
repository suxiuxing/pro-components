import { mkdir } from 'node:fs/promises';

export default (api: any) => {
  api.describe({
    key: 'ensure-dumi-output-dir',
  });

  api.register({
    key: 'onBuildComplete',
    stage: -Infinity,
    fn: async () => {
      await mkdir(api.paths.absOutputPath, { recursive: true });
    },
  });
};
