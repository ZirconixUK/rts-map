# AGENTS.md

## Project
Working title: **RTS Map**.

This repository is for a very simple browser-based prototype of a second map game. The goal is to build a playable vertical slice quickly, keep the code easy to understand, and avoid unnecessary complexity.

## Product intent
RTS Map is a lightweight real-world map strategy prototype. Early versions should focus on proving the core interaction loop, not on polish or scale.

Priorities, in order:
1. Get a minimal playable prototype working.
2. Keep the architecture simple and easy to iterate on.
3. Make mobile browser testing easy via GitHub Pages.
4. Avoid large refactors unless explicitly requested.

## Tech assumptions
Unless the user explicitly asks otherwise, assume:
- Static front end only
- HTML, CSS, and JavaScript
- No backend
- No framework unless needed
- GitHub Pages deployment
- Mobile-first testing matters

If a framework would clearly help, explain why before introducing it.

## Working style
- Make small, incremental changes.
- Prefer simple solutions over clever ones.
- Preserve readability.
- Do not rewrite large parts of the project unless explicitly asked.
- Do not introduce unnecessary dependencies.
- Keep filenames and structure straightforward.

## Git workflow
- Work directly on `main` by default for this repository.
- Do not create a feature branch unless the user explicitly asks for one.
- Keep commits small and coherent.
- After each meaningful implementation step:
  1. verify the app still works
  2. summarize what changed
  3. commit the change
  4. push `main` if the environment allows it
- Do not change GitHub Pages settings unless explicitly asked.

## Commit message style
Use conventional, readable commit messages such as:
- `feat: add base map and player marker`
- `feat: render interactive POI nodes`
- `fix: prevent map UI from overlapping controls`
- `refactor: split map setup from game state`
- `docs: update prototype roadmap`

## Verification before commit
Before each commit, do the most appropriate checks available.

Preferred order:
1. Run automated tests if they exist.
2. Run linting if configured.
3. If there are no tests, do a lightweight manual sanity check.

For a static prototype, minimum manual checks are:
- page loads without obvious errors
- no major console errors
- core interaction for the current feature still works
- layout is acceptable on a mobile-sized viewport if relevant

If something cannot be verified locally, say so clearly.

## GitHub Pages awareness
This project is often tested by pushing updates to `main` and viewing them through GitHub Pages on a phone.

Because of that:
- do not assume localhost is enough for final verification
- keep asset paths compatible with GitHub Pages where possible
- avoid breaking relative paths
- note any GitHub Pages caveats in summaries when relevant

## Scope control
For early prototype work, optimize for speed of learning.

Good early tasks:
- render a map
- show player position or simulated position
- load and render nodes/POIs
- basic selection and interaction
- simple overlays or ranges
- one or two core game mechanics

Avoid prematurely building:
- account systems
- backend services
- complex content pipelines
- advanced optimization
- large state management abstractions
unless explicitly requested.

## When requirements are unclear
When the user asks for implementation and some details are missing:
- make reasonable, conservative assumptions
- choose the simplest approach that can be tested quickly
- document those assumptions in the summary
- only ask for clarification when the choice would materially change the structure

## File safety
Be careful with:
- deployment configuration
- secrets or environment files
- large generated assets
- unrelated files not needed for the current task

## Output expectations
When finishing a step, provide:
- a short summary of what changed
- any assumptions made
- how it was verified
- any follow-up suggestions only if genuinely useful

## Review guidance
When reviewing code in this repo:
- prioritize broken functionality, regressions, and complexity creep
- flag unnecessary dependencies
- flag anything that will make GitHub Pages deployment awkward
- prefer actionable feedback over broad stylistic criticism
