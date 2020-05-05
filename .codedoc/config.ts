
import { configuration } from '@codedoc/core';

import { theme } from './theme';


export const config = /*#__PURE__*/configuration({
  theme,
  dest: {
    namespace: '/rxline',
    html: 'dist/docs',
    assets: 'dist/docs',
  },
  page: {
    title: {
      base: 'RxLine'
    },
    favicon: '/favicon.ico'
  },
  misc: {
    github: {
      user: 'loreanvictor',
      repo: 'rxline',
    }
  },
});
