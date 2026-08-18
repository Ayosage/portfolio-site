export const THEMES = ['green', 'amber', 'paper'] as const
export type Theme = (typeof THEMES)[number]

// GREEN is the house default on every device; system light-preference no
// longer selects paper. The dial (persisted) remains the only theme input.
export function resolveTheme(stored: string | null, _prefersLight: boolean): Theme {
  void _prefersLight // retained for call-site compatibility; no longer selects paper
  if (stored && (THEMES as readonly string[]).includes(stored)) return stored as Theme
  return 'green'
}

export function applyTheme(t: Theme): void {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem('bs01-theme', t)
  } catch {
    /* private mode: theme still applies for this page view */
  }
}
