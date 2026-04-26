# Design System Indexing Plan

## Goal
Use Builder.io's AI-powered Design System Indexing to automatically discover and catalog design system components, icons, and tokens so that Builder's AI code generation uses your actual components instead of generic code.

## Context
- This project uses `@carbon/react` (Carbon Design System by IBM) and `@carbon/icons-react`
- Currently, only one custom component (`WeatherDashboard`) is manually registered in `src/builder-registry.js`
- No auto-discovery or indexing is configured yet
- Builder SDK: `@builder.io/react` v9.3.0

## How Design System Indexing Works
Builder's `index-repo` command (via `@builder.io/dev-tools`):
1. Scans the codebase to discover components and their architectural relationships
2. Detects design tokens (CSS/SASS variables, theme tokens)
3. Indexes icon libraries (all available icon names, variants, import paths)
4. Uploads component information to Builder's servers
5. Enables AI code generation that uses *your* components with correct imports and props

## Recommended Approach

### Step 1: Index the Carbon design system package
Since Carbon is a third-party package (not code you own), run indexing against it using the `--designSystemPackage` flag from within this repository:

```bash
npx "@builder.io/dev-tools@latest" index-repo --designSystemPackage @carbon/react
```

This tells Builder to scan the `@carbon/react` package in `node_modules` and map its components, props, and usage patterns.

For Carbon icons, also index:
```bash
npx "@builder.io/dev-tools@latest" index-repo --designSystemPackage @carbon/icons-react
```

**Alternatively (higher accuracy):** Clone the `@carbon/react` source repository and run `index-repo` directly inside it — this gives the AI richer context including documentation, Storybook stories, and code comments.

### Step 2: Index this application's custom components
Run indexing on the application source to capture custom components (like `WeatherDashboard`) and any wrappers built around Carbon:

```bash
npx "@builder.io/dev-tools@latest" index-repo
```

Run this from the project root. The command will scan `src/` for components, tokens, and patterns.

### Step 3: Verify indexing results
After running the commands:
- Go to the Builder.io dashboard → Design System Intelligence page
- Review the list of discovered components on the left panel
- Use the search bar to verify Carbon components and custom components appear

### Step 4: (Optional) Set up CI/CD to keep the index fresh
Add a step to your CI pipeline to re-run `index-repo` on each deploy or when the design system dependency updates. This ensures the index stays current as components evolve.

```yaml
# Example GitHub Actions step
- name: Index Design System
  run: npx "@builder.io/dev-tools@latest" index-repo --designSystemPackage @carbon/react
  env:
    BUILDER_PUBLIC_API_KEY: ${{ secrets.BUILDER_PUBLIC_API_KEY }}
```

## Key Files
- `src/builder-registry.js` — existing manual component registrations (no changes needed for indexing)
- `package.json` — `@carbon/react` and `@carbon/icons-react` are already installed

## Expected Outcome
After indexing, Builder's AI will:
- Generate code using Carbon components (`Button`, `Modal`, `DataTable`, etc.) with correct imports
- Use the right Carbon icon names from `@carbon/icons-react`
- Respect Carbon's prop API and usage patterns
- Apply Carbon design tokens for colors, spacing, and typography

## Notes
- Indexing typically achieves ~70% mapping accuracy automatically
- The Builder.io dashboard provides a visual interface to review and adjust any edge cases
- No code changes to the app are required — indexing is a one-time CLI operation
