import type { BaseLayoutProps } from '@/components/layout/shared';
import * as stylex from '@stylexjs/stylex';
import LogoBold from '@/components/LogoBold';
import { colors } from '@stylextras/ui/tokens/color.stylex';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <LogoBold xstyle={styles.logo} />
      ),
    },
    githubUrl: 'https://github.com/nmn/stylextras',
    links: [
      {
        type: 'main',
        text: 'Docs',
        url: '/docs',
        active: 'nested-url'
      },
      {
        type: 'main',
        text: 'Playground',
        url: '/playground',
        active: 'nested-url'
      },
    ],
  };
}

const styles = stylex.create({
  logo: {
    color: colors.fg,
    // width: 48,
    height: 36,
  },
});
