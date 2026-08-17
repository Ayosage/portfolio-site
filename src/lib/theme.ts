export const THEMES = ['green', 'amber', 'paper'] as const
export type Theme = (typeof THEMES)[number]

export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored && (THEMES as readonly string[]).includes(stored)) return stored as Theme
  return prefersLight ? 'paper' : 'green'
}

export function applyTheme(t: Theme): void {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem('bs01-theme', t)
  } catch {
    /* private mode: theme still applies for this page view */
  }
}
