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
- work directly on `main` for normal development in this repo
- keep commits small and easy to reason about
- push `main` when the current step is ready to test

## GitHub Pages workflow
This repo may be tested on mobile through GitHub Pages.

Typical workflow:
1. make the next small change on `main`
2. verify it locally as far as possible
3. push `main`
4. open the GitHub Pages site on phone and confirm the change there

This repository is separate from other game projects, so using `main` directly is the preferred workflow here.

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
