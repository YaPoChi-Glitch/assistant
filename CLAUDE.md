# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Collaboration

- Общайся со мной по-русски.
- Я junior — перед каждым изменением коротко объясняй, **что** меняешь и **зачем**.
- Перед большими изменениями (затрагивают несколько файлов или меняют архитектуру) сначала покажи план и дождись подтверждения.
- Приложение запускается через **Expo Go на Android** — нативные модули, требующие dev build, недоступны.

## Commands

```bash
npx expo start          # start dev server
npx expo start --ios    # start on iOS simulator
npx expo start --android
npx expo lint           # lint (eslint-config-expo flat config)
npx tsc --noEmit        # typecheck
npx expo install <pkg>  # always use this instead of npm install for Expo packages
```

Run lint and typecheck before declaring any task done. No test suite is configured yet.

## Architecture

This is an Expo SDK 58 app using **Expo Router** for file-based navigation. No `ios/` or `android/` directories — they are generated via Continuous Native Generation; configure native behavior only in `app.json`.

```
src/
  app/
    _layout.tsx   # Root Stack navigator; DarkTheme forced, no headers
    index.tsx     # Single screen: quick-capture list
  storage.ts      # AsyncStorage abstraction — loadEntries / saveEntries
  types.ts        # Entry type and EntryType union + labels
assets/           # Icons and splash images
```

Path alias `@/*` maps to `src/*`.

### Data flow

`Entry` objects (`id`, `text`, `type: 'task'|'idea'|'purchase'`, `done`, `createdAt`) are persisted entirely in AsyncStorage under the key `"entries"`. All mutations go through `updateEntries()` in `index.tsx`, which calls `setEntries` and `saveEntries` atomically. `storage.ts` is intentionally thin so swapping to a remote backend only requires changing that one file.

### UI conventions

- UI strings are in Russian.
- Dark-only (`userInterfaceStyle: "dark"` in `app.json`; `DarkTheme` in layout).
- Colors are defined as a local `colors` object per screen — no shared theme file yet.
- React Compiler (`experiments.reactCompiler: true`) and typed routes (`experiments.typedRoutes: true`) are both enabled.
- Web output mode is `"server"` (SSR).
