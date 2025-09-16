# 🏃‍♂️ Life Runner

**Life Runner** is a prototype endless runner game where each lane represents a life decision. As the player progresses through ages, they must make choices that affect stats like health, happiness, knowledge, relationships, and wealth. The game integrates AI to generate dynamic, age-based decision gates so every playthrough is different.

## ✨ Features
- Three-lane endless runner gameplay (move left/right with arrow keys).
- Age-based progression (0 → 80 years).
- Dynamic decision gates generated with AI.
- Player stats that evolve based on choices.
- Loading spinner overlay while new decisions are being generated.

## 🛠️ Setup

### Prerequisites
- Node.js v18+
- npm
- An OpenAI API key (saved locally in a `.env` file).

### Install & Run
```bash
# clone repository
git clone git@github.com:WPeytz/LifeRunner.git
cd LifeRunner

# install dependencies
npm install

# run development server
npm start
```

Then open `http://localhost:3000` in your browser.

## ⚙️ Environment
Create a `.env` file in the project root (never commit this file) with:
```
OPENAI_API_KEY=sk-your-key-here
```

## 🎮 Controls
- `←` / `→` : Move between lanes
- Decisions appear as blocks; choose a lane to make your choice.

## 🚀 Roadmap
- Improve AI prompts for richer, sequential storytelling.
- Balance stat effects and add more nuanced outcomes.
- Add visuals and animations for better gameplay feel.
- Deploy to a public host for playtesting.

## 📜 License
MIT
