# PLANS.md

## Purpose
This file describes the preferred implementation order for the early RTS Map prototype.

It is intentionally lightweight. The aim is to keep development focused on proving the core loop quickly.

## Working rule
Always prefer the smallest version of a feature that proves the idea.
Do not jump ahead to polish, scale, or complex abstractions unless asked.

## Phase 0 — project skeleton
Goal: create a clean starting point.

Target outcomes:
- simple static project structure
- app loads in browser
- map container and UI shell exist
- deployment remains GitHub Pages friendly

Exit criteria:
- project opens cleanly
- no obvious console errors
- structure is easy to build on

## Phase 1 — base map
Goal: show an interactive map.

Target outcomes:
- map renders successfully
- sensible default location/zoom
- map resizing works reasonably on desktop and mobile

Exit criteria:
- user can open the page and see a working map
- map remains usable on a phone-sized screen

## Phase 2 — player presence
Goal: represent the player on the map.

Target outcomes:
- player marker shown
- either live geolocation or a simple simulated/dev position
- map can center on player

Exit criteria:
- player location is visible and understandable
- fallback behavior exists if geolocation is unavailable

## Phase 3 — nodes / POIs
Goal: show interactable map objects.

Target outcomes:
- a small set of nodes/POIs are displayed
- nodes are visually distinct from player marker
- clicking/tapping a node gives a basic response

Exit criteria:
- user can identify nodes and interact with them
- interaction works on mobile tap input

## Phase 4 — first core mechanic
Goal: prove the game is more than just a map viewer.

Examples of acceptable first mechanics:
- claim a node
- activate a control radius
- convert nearby nodes
- spend a simple resource
- toggle between node states

Exit criteria:
- one meaningful game action changes the game state
- that state change is visible on the map

## Phase 5 — simple game loop
Goal: connect actions into a repeatable loop.

Target outcomes:
- player can perform repeated actions with consequences
- UI communicates the current state clearly enough
- at least one reason exists to move, claim, or expand

Exit criteria:
- prototype feels like a game loop has begun
- user can explain what they are trying to do in one sentence

## Phase 6 — main-based testing workflow
Goal: make remote testing easy.

Target outcomes:
- `main` workflow is stable
- GitHub Pages testing works cleanly
- instructions are clear enough for repeatable phone testing

Exit criteria:
- `main` can be pushed and tested on phone
- the update loop stays simple and repeatable

## Phase 7 — cleanup pass
Goal: keep momentum without letting the prototype rot.

Target outcomes:
- remove obvious dead code
- simplify confusing files
- improve naming where needed
- document known limitations

Exit criteria:
- next iteration starts from a clean base

## Decision rules
When choosing between two implementations:
- choose the one with fewer moving parts
- choose the one easier to test on GitHub Pages
- choose the one easier to explain in one paragraph
- choose the one easier to undo if the idea is wrong

## Anti-goals for the prototype stage
Do not prioritize these unless explicitly requested:
- production backend
- accounts or auth
- matchmaking or multiplayer infrastructure
- big content systems
- advanced performance work
- elaborate UI polish
- framework-heavy rewrites

## Suggested first implementation prompt for Codex
Read `AGENTS.md` and follow it strictly.
Build the smallest possible playable prototype for RTS Map in incremental steps.
Work on `main`, keep changes small, verify after each step, and commit each meaningful step.
Push `main` when the environment allows it.
