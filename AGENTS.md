# AGENTS

Guidance for automated assistants working in this repository.

## Stack

- **React 19** with **Vite 8** (`src/main.jsx` → `src/App.jsx`)
- **IBM Carbon** (`@carbon/react`, `@carbon/icons-react`) and global styles in `src/main.jsx`
- **React Router** (`react-router-dom`) in `App.jsx`
- **Builder.io** (`@builder.io/react`): custom components registered in `src/builder-registry.js` (imported from `main.jsx` before the app)

## Environment variables (`.env`)

- `VITE_OPENWEATHER_API_KEY` — OpenWeatherMap [forecast](https://openweathermap.org/api) API; used by `WeatherDashboard`
- `VITE_BUILDER_PUBLIC_API_KEY` — Builder.io **public** key; `builder.init()` in `builder-registry.js`, catch-all route in `App.jsx`

Restart the dev server after changing `.env`.

## Routes

- `/weather/:zip` — Renders `WeatherDashboard` (ZIP from URL params)
- `*` — Renders `BuilderComponent` with `model="page"` when the Builder public key is set; otherwise a short message

`WeatherDashboard` also accepts a `zip` prop when used as a registered Builder custom component; non-empty `zip` from props overrides the route param.

## Important files

| File | Role |
|------|------|
| `src/WeatherDashboard.jsx` | 5-day / 3-hour forecast UI (Carbon layout) |
| `src/builder-registry.js` | `Builder.registerComponent(WeatherDashboard, …)` |
| `src/App.jsx` | Router and Builder catch-all |
| `src/App.scss` | App shell padding |

## Commands

- `npm run dev` — development
- `npm run build` — production build
- `npm run lint` — ESLint

## Testing Instructions
​This project uses Vitest for unit testing.
​Whenever you create or update a component in /src/components, you MUST automatically generate a corresponding .test.tsx file in the same directory.
    > - Always run npm test after code generation to ensure the new component and its tests pass.