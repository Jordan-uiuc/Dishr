# Dishr

A modern recipe discovery app with Tinder-style swiping. Discover new meals, swipe right to save, swipe left to pass.

## Features

- 🍽️ Random recipe discovery from TheMealDB API
- 👆 Intuitive swipe gestures (right to save, left to dismiss)
- 📱 Responsive design optimized for mobile
- ⚡ Fast and smooth animations with Framer Motion
- 🎨 Clean UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **API**: TheMealDB (free recipe database)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dishr.git
   cd dishr
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
dishr/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── SwipeCard.tsx    # Main swipe card component
│   │   ├── types/
│   │   │   └── Meal.ts          # TypeScript interfaces
│   │   ├── api.tsx              # API calls to TheMealDB
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## How It Works

1. The app fetches random recipes from TheMealDB API
2. Each recipe is displayed as a swipeable card showing:
   - Recipe image
   - Recipe name
   - List of ingredients
3. Swipe right (>200px) to save a recipe
4. Swipe left (<-200px) to dismiss
5. Cards snap back to center for smaller swipes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Features

- [ ] User authentication
- [ ] Save recipes to personal collection
- [ ] Recipe categories and filtering
- [ ] Detailed recipe instructions
- [ ] Meal planning functionality
- [ ] Shopping list generation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for providing the free recipe API
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities