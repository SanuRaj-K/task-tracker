# Taskly

A responsive task tracker with a calm workspace dashboard, built with React and Vite.

## Run locally

Requires Node.js 22.13+ or Node.js 24+. Node.js 24 is recommended for the development and test tools.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Features

- Create, edit, complete, and delete tasks, with a short undo window after deletion.
- Search titles and descriptions; filter by status or category.
- Sort by original order, title, completion, or priority.
- Switch between card and list layouts.
- View live task counts and completion progress.
- Add categories, priorities, and optional descriptions.
- Keep changes across reloads using browser storage.
- Use keyboard shortcuts (`Ctrl/⌘ + K`), labelled controls, native modal focus handling, and reduced-motion support.
- See loading skeletons, empty states, and a retry action when the API is unavailable.

## Data and persistence

The first visit loads 15 todos from [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Imported titles and completion states are preserved; imported tasks default to the Work category and Medium priority because the API does not supply these fields.

After loading, tasks are stored under `taskly.tasks.v1` in localStorage. All subsequent changes are local to this browser, with no backend writes or cross-device sync. Even an empty list is preserved. If loading fails, you can retry or create your own task. If storage is unavailable, a notice explains that changes last for the current session.

New tasks receive a UUID automatically. Completing a task updates the shared task state, so filters, cards, and summary counts agree. Network requests are cancelled on unmount and have a timeout.

## Structure

```text
src/
  App.jsx                    Workspace and task interactions
  App.css                    Responsive dashboard styles
  index.css                  Global styles and design tokens
  hooks/use-tasks.js          API loading, persistence, task mutations
  components/                Reusable task controls, cards, and dialogs
  tests/                     Interaction and persistence regression checks
```

## Checks

```sh
npm run test
npm run lint
npm run build
npm run format:check
```

Tests use a simulated DOM and mocked API responses to verify task interactions, persistence, and failure handling. They do not replace a visual browser review. `npm run preview` serves the production build locally.
