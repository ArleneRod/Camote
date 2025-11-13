# Camote E-Commerce App

## Project Overview
This is a React-based e-commerce application built with Vite and Firebase.

## Tech Stack
- **Frontend**: React 19, React Router DOM
- **Build Tool**: Vite
- **Backend/Hosting**: Firebase
- **Styling**: CSS

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment
This project is configured for automatic deployment to Firebase Hosting via GitHub Actions.

### Auto-Deploy Workflow
Every push to the `main` branch automatically triggers:
1. Build the application
2. Deploy to Firebase Hosting
3. Preview deployment URL available in PR comments (for pull requests)

### Manual Deployment
To deploy manually:
```bash
npm run build
firebase deploy
```

## GitHub Repository
https://github.com/ArleneRod/Camote

## Firebase Setup
The app uses Firebase for:
- Hosting
- Authentication (if configured)
- Database (if configured)

## Development Workflow
1. Create a feature branch
2. Make your changes
3. Push commits to GitHub
4. GitHub Actions automatically deploys to Firebase
5. Access your live site at the Firebase Hosting URL