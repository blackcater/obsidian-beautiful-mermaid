# Obsidian Beautiful Mermaid Plugin

This is a plugin for Obsidian that adds beautiful mermaid diagrams to your notes.

This plugin depends on [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid).

## beautiful-mermaid

Basic usage:

```ts
import { renderMermaid } from 'beautiful-mermaid'

const svg = await renderMermaid(`
  graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
`)
```

Custom theme:

```ts
import { renderMermaid } from 'beautiful-mermaid'

const svg = await renderMermaid(diagram, {
  bg: '#1a1b26',
  fg: '#a9b1d6',
  // Optional enrichment:
  line: '#3d59a1',    // Edge/connector color
  accent: '#7aa2f7',  // Arrow heads, highlights
  muted: '#565f89',   // Secondary text, labels
  surface: '#292e42', // Node fill tint
  border: '#3d59a1',  // Node stroke
})
```

Use preset theme:

```ts
import { renderMermaid, THEMES } from 'beautiful-mermaid'

const svg = await renderMermaid(diagram, THEMES['tokyo-night'])
```

15 carefully curated themes ship out of the box:


| Theme               | Type  | Background | Accent    |
| ------------------- | ----- | ---------- | --------- |
| `zinc-light`        | Light | `#FFFFFF`  | Derived   |
| `zinc-dark`         | Dark  | `#18181B`  | Derived   |
| `tokyo-night`       | Dark  | `#1a1b26`  | `#7aa2f7` |
| `tokyo-night-storm` | Dark  | `#24283b`  | `#7aa2f7` |
| `tokyo-night-light` | Light | `#d5d6db`  | `#34548a` |
| `catppuccin-mocha`  | Dark  | `#1e1e2e`  | `#cba6f7` |
| `catppuccin-latte`  | Light | `#eff1f5`  | `#8839ef` |
| `nord`              | Dark  | `#2e3440`  | `#88c0d0` |
| `nord-light`        | Light | `#eceff4`  | `#5e81ac` |
| `dracula`           | Dark  | `#282a36`  | `#bd93f9` |
| `github-light`      | Light | `#ffffff`  | `#0969da` |
| `github-dark`       | Dark  | `#0d1117`  | `#4493f8` |
| `solarized-light`   | Light | `#fdf6e3`  | `#268bd2` |
| `solarized-dark`    | Dark  | `#002b36`  | `#268bd2` |
| `one-dark`          | Dark  | `#282c34`  | `#c678dd` |
