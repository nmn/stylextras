# @stylextras/open-props

This package provides the ability to easily use Open Props with StyleX.

### Installation

```bash
npm install @stylextras/open-props
```

## Usage

### Direct Imports

You can import specific token categories directly:

```typescript
import * as stylex from '@stylexjs/stylex';
import { colors } from '@stylextras/open-props/colors.stylex';
import { fonts } from '@stylextras/open-props/fonts.stylex';
import { sizes } from '@stylextras/open-props/sizes.stylex';

const styles = stylex.create({
  container: {
    backgroundColor: colors.blue2,
    color: colors.gray10,
    fontSize: fonts.size3,
    padding: sizes.spacing2,
  },
});
```

### Creating a Design Token System (Recommended)

For better organization, theming support, and consistent design language, you can create a design token system using StyleX's `defineVars`:

1.  Create a tokens file:

```typescript
// src/utils/tokens.stylex.ts
import { defineVars } from '@stylexjs/stylex';
import { colors as openPropsColors } from '@stylextras/open-props/colors.stylex';
import { sizes as openPropsSizes } from '@stylextras/open-props/sizes.stylex';
import { fonts as openPropsFonts } from '@stylextras/open-props/fonts.stylex';
import { shadows as openPropsShadows } from '@stylextras/open-props/shadows.stylex';

// Define your color tokens
export const colors = defineVars({
  // Core colors
  primary: openPropsColors.blue6,
  secondary: openPropsColors.purple6,
  accent: openPropsColors.orange6,

  // Text colors
  textPrimary: openPropsColors.gray9,
  textSecondary: openPropsColors.gray7,
  textInverse: openPropsColors.gray0,

  // Background colors
  backgroundPrimary: openPropsColors.gray0,
  backgroundSecondary: openPropsColors.gray1,
  backgroundTertiary: openPropsColors.gray2,

  // Status colors
  success: openPropsColors.green6,
  warning: openPropsColors.yellow6,
  error: openPropsColors.red6,
  info: openPropsColors.blue5,

  // Direct mappings for backward compatibility
  blue2: openPropsColors.blue2,
  blue6: openPropsColors.blue6,
  gray10: openPropsColors.gray10,
  // Add other mappings as needed
});

// Define your spacing tokens
export const spacing = defineVars({
  xs: openPropsSizes.spacing1,
  sm: openPropsSizes.spacing2,
  md: openPropsSizes.spacing3,
  lg: openPropsSizes.spacing4,
  xl: openPropsSizes.spacing5,

  // Direct mappings
  spacing1: openPropsSizes.spacing1,
  spacing2: openPropsSizes.spacing2,
  // Add other mappings as needed
});

// Define your typography tokens
export const typography = defineVars({
  fontSizeSmall: openPropsFonts.size2,
  fontSizeMedium: openPropsFonts.size3,
  fontSizeLarge: openPropsFonts.size4,

  fontWeightRegular: openPropsFonts.weight4,
  fontWeightMedium: openPropsFonts.weight5,
  fontWeightBold: openPropsFonts.weight7,

  // Direct mappings
  size3: openPropsFonts.size3,
  // Add other mappings as needed
});

// Define your elevation tokens
export const elevation = defineVars({
  low: openPropsShadows.shadow1,
  medium: openPropsShadows.shadow2,
  high: openPropsShadows.shadow3,

  // Direct mappings
  shadow1: openPropsShadows.shadow1,
  shadow2: openPropsShadows.shadow2,
  // Add other mappings as needed
});

```

2.  Then use these tokens in your components:


```typescript
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, typography } from '../utils/tokens.stylex';

const styles = stylex.create({
  button: {
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.fontSizeMedium,
    backgroundColor: colors.primary,
    color: colors.textInverse,
    border: 'none',
    borderRadius: spacing.xs,
    cursor: 'pointer',
  },
});

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button {...stylex.props(styles.button)} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Theming
 
One of the major benefits of using `defineVars` is the ability to create and switch between themes:


```typescript
// src/utils/themes.stylex.ts
import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';
import { colors as openPropsColors } from '@stylextras/open-props/colors.stylex';

// Light theme (default)
export const lightTheme = stylex.createTheme(colors, {
  // Core colors remain the same as defaults

  // Background colors
  backgroundPrimary: openPropsColors.gray0,
  backgroundSecondary: openPropsColors.gray1,
  backgroundTertiary: openPropsColors.gray2,

  // Text colors
  textPrimary: openPropsColors.gray9,
  textSecondary: openPropsColors.gray7,
});

// Dark theme
export const darkTheme = stylex.createTheme(colors, {
  // Core colors with adjusted brightness for dark mode
  primary: openPropsColors.blue5,
  secondary: openPropsColors.purple5,
  accent: openPropsColors.orange5,

  // Background colors
  backgroundPrimary: openPropsColors.gray9,
  backgroundSecondary: openPropsColors.gray8,
  backgroundTertiary: openPropsColors.gray7,

  // Text colors
  textPrimary: openPropsColors.gray0,
  textSecondary: openPropsColors.gray2,
  textInverse: openPropsColors.gray9,
});

// Brand theme example
export const brandTheme = stylex.createTheme(colors, {
  primary: '#ff0066', // Custom brand color
  secondary: '#6600cc',
  accent: '#00ccff',

  // Other colors adjusted for brand
  success: '#00cc66',
  warning: '#ffcc00',
  error: '#ff3300',
});

```

Applying themes in your application, example for Next.js

```tsx
// src/components/theme/ThemeProvider.tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { lightTheme, darkTheme } from '../../utils/themes.stylex';
import { useState } from 'react';
import { colors } from '@stylextras/open-props/colors.stylex'
import { sizes } from '@stylextras/open-props/sizes.stylex';
import { fonts } from '@stylextras/open-props/fonts.stylex';
import { borders } from '@stylextras/open-props/borders.stylex';
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div {...stylex.props(isDarkMode ? darkTheme : lightTheme)}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        {...stylex.props(styles.button)}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      {children}
    </div>
  );
}

const styles = stylex.create({
  button: {
    position: 'fixed',
    top: sizes.spacing3,
    right: sizes.spacing3,
    padding: `${sizes.spacing2} ${sizes.spacing3}`,
    borderRadius: borders.radius2,
    borderWidth: borders.size1,
    borderStyle: 'solid',
    borderColor: colors.gray7,
    backgroundColor: colors.gray7,
    color: colors.gray0,
    fontSize: fonts.size1,
    cursor: 'pointer',
    boxShadow: colors.gray8,
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: colors.gray5,
      boxShadow: colors.gray4,
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
});

```

Then in the application (Next.js example):

```tsx
// app/layout.tsx
import ThemeProvider from '../components/theme/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Available Token Categories

| Category | Import Path | Description |
| --- | --- | --- |
| Colors | `colors.stylex` | Core color palette |
| HSL Colors | `colorsHSL.stylex` | Colors in HSL format |
| OKLCH Colors | `colorsOKLCH.stylex` | Colors in OKLCH format |
| OKLCH Hues | `colorsOKLCHHues.stylex` | OKLCH color hues |
| Gray OKLCH | `grayOKLCH.stylex` | Gray scale in OKLCH |
| Highlights | `highlights.stylex` | Highlight colors |
| Typography | `fonts.stylex` | Font sizes, families, weights |
| Spacing | `sizes.stylex` | Spacing and sizing tokens |
| Layouts | `layouts.stylex` | Layout-related tokens |
| Aspect Ratios | `aspects.stylex` | Common aspect ratios |
| Z-Index | `zIndex.stylex` | Z-index values |
| Animations | `animations.stylex` | Animation durations and properties |
| Animation Names | `animationNames.stylex` | Named animations |
| Easings | `easings.stylex` | Easing functions |
| Borders | `borders.stylex` | Border styles and radii |
| Gradients | `gradients.stylex` | Predefined gradients |
| Masks | `masksCornerCuts.stylex`, `masksEdges.stylex` | CSS masks |
| Shadows | `shadows.stylex` | Box and text shadows |
| SVG | `svg.stylex` | SVG-related tokens |


## Example Components


### Button Component with Variants

```typescript
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, typography } from '../utils/tokens.stylex';

const styles = stylex.create({
  base: {
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
    borderRadius: spacing.xs,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  primary: {
    backgroundColor: colors.primary,
    color: colors.textInverse,
    ':hover': {
      backgroundColor: colors.blue7, // Darker shade on hover
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.textInverse,
    ':hover': {
      backgroundColor: colors.purple7, // Darker shade on hover
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    ':hover': {
      backgroundColor: colors.backgroundSecondary,
    },
  },
  small: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.fontSizeSmall,
  },
  large: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.fontSizeLarge,
  },
});

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick
}) {
  return (
    <button
      {...stylex.props(
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        size === 'small' && styles.small,
        size === 'large' && styles.large,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

```

### Card Component with Elevation

```typescript
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, elevation } from '../utils/tokens.stylex';

const styles = stylex.create({
  card: {
    padding: spacing.lg,
    borderRadius: spacing.sm,
    backgroundColor: colors.backgroundPrimary,
    transition: 'box-shadow 0.3s ease',
  },
  low: {
    boxShadow: elevation.low,
  },
  medium: {
    boxShadow: elevation.medium,
  },
  high: {
    boxShadow: elevation.high,
  },
  interactive: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: elevation.high,
    },
  },
});

export function Card({
  children,
  elevation = 'medium',
  interactive = false,
  onClick
}) {
  return (
    <div
      {...stylex.props(
        styles.card,
        elevation === 'low' && styles.low,
        elevation === 'medium' && styles.medium,
        elevation === 'high' && styles.high,
        interactive && styles.interactive,
      )}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </div>
  );
}
```