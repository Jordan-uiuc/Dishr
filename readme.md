# Dishr

A modern recipe discovery app with Tinder-style swiping. Discover new meals, swipe right to save, swipe left to pass.

## Features

- 🍽️ Random recipe discovery from TheMealDB API
- 👆 Intuitive swipe gestures (right to save, left to dismiss)
- 📱 Responsive design optimized for mobile
- ⚡ Fast and smooth animations with Framer Motion
- 🎨 Clean UI built with Tailwind CSS
- ☁️ Serverless backend with AWS Lambda
- 🔄 Card deck system prevents duplicate recipes

## Tech Stack

### Frontend
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks

### Backend
- **Runtime**: AWS Lambda (Python 3.12)
- **API Gateway**: REST API for serverless endpoints
- **External API**: TheMealDB (free recipe database)
- **Testing**: pytest with moto and responses

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.12
- AWS CLI configured
- npm or yarn

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dishr.git
   cd dishr
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   # Add your API Gateway URL to VITE_API_BASE_URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup

1. Set up Python virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Deploy Lambda functions:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh get_recipes
   ```

4. Run tests:
   ```bash
   pytest tests/ -v
   ```

## Project Structure

```
dishr/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SwipeCard.tsx    # Individual swipe card
│   │   │   └── SwipeDeck.tsx    # Card deck manager
│   │   ├── types/
│   │   │   └── Meal.ts          # TypeScript interfaces
│   │   ├── api.tsx              # API calls to backend
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── functions/
│   │   ├── get_recipes/
│   │   │   └── lambda_function.py
│   │   ├── get_favorites/
│   │   └── save_swipe/
│   ├── tests/
│   │   └── test_get_recipes.py
│   ├── deploy.sh                # Lambda deployment script
│   └── requirements.txt
├── .gitignore
└── README.md
```

## How It Works

1. **Recipe Fetching**: AWS Lambda function calls TheMealDB API for random recipes
2. **Deck Management**: Frontend maintains a 3-card deck, preventing duplicates
3. **Swipe Interactions**: 
   - Swipe right (>140px) to save a recipe
   - Swipe left (<-140px) to dismiss
   - Cards animate and show visual feedback
4. **Card Replacement**: When swiped, new unique recipes are fetched automatically
5. **Visual Stack**: Cards are layered with scaling and offset effects

## API Endpoints

- `GET /get_recipe` - Fetch a random recipe from TheMealDB
- `POST /save_like` - Save a liked recipe (future implementation)

## Development

### Running Tests

Frontend:
```bash
cd frontend
npm test
```

Backend:
```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```

### Deployment

Deploy backend changes:
```bash
cd backend
./deploy.sh get_recipes
```

Deploy frontend:
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Current Features

- [x] Random recipe discovery
- [x] Swipe gestures for liking/disliking recipes
- [x] DynamoDB integration for saving favorites

## Future Features

- [ ] User authentication with AWS Cognito
- [ ] Recipe categories and filtering
- [ ] Detailed recipe instructions view
- [ ] Meal planning functionality
- [ ] Shopping list generation
- [ ] Social features (sharing, ratings)
- [ ] Offline support with PWA

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### Backend
Currently uses no environment variables (free TheMealDB API)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for providing the free recipe API
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [AWS Lambda](https://aws.amazon.com/lambda/) for serverless computing