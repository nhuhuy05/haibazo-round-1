# Haibazo Number Game

A small React + Vite number-clicking game

## Gameplay

- Click dots in ascending order: `1 -> 2 -> 3 -> ...`
- Wrong click ends the game (`GAME OVER`)
- Clear all dots to win (`ALL CLEARED`)
- Supports optional `Auto Play` mode

## Tech Stack

- React 18
- Vite

## Project Structure

- `src/main.jsx`: app entry point
- `src/App.jsx`: top-level app shell
- `src/components/Game.jsx`: game UI (view/controller)
- `src/components/useGameEngine.js`: core game logic hook
- `src/components/Dot.jsx`: dot component
- `src/components/game.constants.js`: shared game constants

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

