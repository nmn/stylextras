'use client';

import * as stylex from '@stylexjs/stylex';
import { blurThemes } from '@stylextras/ui/blur-themes';
import { colorThemes } from '@stylextras/ui/color-themes';
import { elevationThemes } from '@stylextras/ui/elevation-themes';
import { motionThemes } from '@stylextras/ui/motion-themes';
import { radiusThemes } from '@stylextras/ui/radius-themes';
import { spacingThemes } from '@stylextras/ui/spacing-themes';
import { strokeThemes } from '@stylextras/ui/stroke-themes';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import { typographyThemes } from '@stylextras/ui/typography-themes';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  type WebsiteAppearance,
  type WebsiteStyleName,
  type WebsiteStyleSelection,
  type WebsiteThemeAxes,
  defaultWebsiteTheme,
  matchingStyleName,
  themeAxesForStyle,
} from '@/components/catalog/theme-config';

type ThemeAxis = keyof WebsiteThemeAxes;

type WebsiteThemeContextValue = {
  appearance: WebsiteAppearance;
  axes: WebsiteThemeAxes;
  setAppearance: (appearance: WebsiteAppearance) => void;
  setAxis: <Key extends ThemeAxis>(
    key: Key,
    value: WebsiteThemeAxes[Key],
  ) => void;
  setStyle: (style: WebsiteStyleName) => void;
  styleName: WebsiteStyleSelection;
};

const WebsiteThemeContext = createContext<WebsiteThemeContextValue | null>(
  null,
);
const subscribeToHydration = () => () => undefined;

export function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

export function HTML({ children }: { children: ReactNode }) {
  const [axes, setAxes] = useState<WebsiteThemeAxes>(defaultWebsiteTheme);
  const [appearance, setAppearance] = useState<WebsiteAppearance>('system');
  const styleName = matchingStyleName(axes);

  const setAxis = useCallback(
    <Key extends ThemeAxis>(key: Key, value: WebsiteThemeAxes[Key]) => {
      setAxes((current) =>
        current[key] === value ? current : { ...current, [key]: value },
      );
    },
    [],
  );

  const setStyle = useCallback((style: WebsiteStyleName) => {
    setAxes(themeAxesForStyle(style));
  }, []);

  const context = useMemo<WebsiteThemeContextValue>(
    () => ({ appearance, axes, setAppearance, setAxis, setStyle, styleName }),
    [appearance, axes, setAppearance, setAxis, setStyle, styleName],
  );

  return (
    <WebsiteThemeContext.Provider value={context}>
      <html
        {...stylex.props(
          colorThemes.neutral,
          colorThemes[axes.color],
          spacingThemes[axes.spacing],
          radiusThemes[axes.radius],
          strokeThemes[axes.stroke],
          typographyThemes[axes.typography],
          elevationThemes[axes.elevation],
          blurThemes[axes.blur],
          motionThemes[axes.motion],
          styles.document,
          styles[appearance],
        )}
        lang="en"
        suppressHydrationWarning
      >
        {children}
      </html>
    </WebsiteThemeContext.Provider>
  );
}

export function useWebsiteTheme() {
  const context = useContext(WebsiteThemeContext);
  if (!context) throw new Error('useWebsiteTheme must be used within HTML');
  return context;
}

const styles = stylex.create({
  document: {
    fontFamily: typography.fontSans,
    color: colors.fg,
  },
  light: {
    colorScheme: 'light',
  },
  dark: {
    colorScheme: 'dark',
  },
  system: {
    colorScheme: 'light dark',
  },
});
