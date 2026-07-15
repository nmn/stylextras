# Themes and variables

- Preserve the independent StyleX variable sets: colors, spacing, radius, stroke, typography, elevation, blur, and motion.
- Keep a small core and same-set derived variables together in each `defineVars()` call.
- Do not introduce foundation/semantic/component token layers.
- Theme exports remain plain `stylex.createTheme()` objects that can be applied to any element.
- Do not add a provider, context, `ThemeRoot`, or other wrapper requirement.
- Every variable set can be themed independently; documentation controls must expose those independent choices.
- Accent themes may tint surrounding surfaces, but the tint must remain subtle.
- In dark mode, nested or top-layer content must be lighter than the surface beneath it.

