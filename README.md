# RTS Map

Working title for a very simple prototype of a second map-based game.

## Goal
Build a small, testable browser prototype that proves the core gameplay loop before investing in a larger architecture.

## Current intent
This project should start lean:
- static front end
- minimal dependencies
- easy to run locally
- easy to test on a phone through GitHub Pages

## Suggested early prototype scope
A good first playable version might include:
- a map
- a player marker or simulated player position
- visible nodes or POIs
- one or two basic interaction types
- simple game state shown on screen

## Development approach
- keep changes incremental
- use feature branches
- keep `main` stable
- test experimental work through a separate branch when needed

## GitHub Pages workflow
This repo may be tested on mobile through GitHub Pages.

Typical workflow:
1. keep `main` as the stable version
2. do experimental work on a feature branch
3. push the feature branch
4. temporarily point GitHub Pages at that branch if needed for mobile testing
5. switch back when done

Note: GitHub Pages only serves one branch/folder source per repository at a time, so branch-based mobile testing should be treated as a temporary preview workflow.

## Local run options
Because this is expected to be a static web prototype, a local run can usually be as simple as serving the repo folder with any lightweight static server.

Examples:
- VS Code Live Server
- Python simple server
- any minimal local static server

## Initial milestone ideas
- Milestone 1: map renders and loads reliably
- Milestone 2: nodes appear on the map
- Milestone 3: player can interact with nodes
- Milestone 4: one basic strategic mechanic works
- Milestone 5: mobile GitHub Pages testing is smooth

## Repository conventions
See `AGENTS.md` for repo-specific instructions intended for coding agents and contributors.
See `PLANS.md` for the staged implementation roadmap.
