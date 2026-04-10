# Pluton

[![License: Unlicensed](https://img.shields.io/badge/License-Unlicensed-lightgrey.svg)](#license)

Personal AI tutor that teaches you in the way you understand.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## About the Project

Pluton is a personal AI tutor designed for learners who want to learn anything new, at their own level. It combines content summarization, interactive quizzes, and personalized learning paths into a single workspace.

### Problem it solves

Most learning tools are either too generic or too fragmented. Pluton brings all the core learning workflows into one place and adapts them to the user.

### Key goals

- Personalize learning based on the user profile and behavior
- Reduce time spent extracting notes and building study plans
- Keep learners consistent with clear roadmaps and daily tasks

## Features

- YouTube summarizer for quick, level-aware notes
- PDF extractor for instant Q&A and key concept extraction
- Quiz generator for practice and retention
- Doubt Finisher chat for explanations and guidance
- Subject-based roadmaps and progress tracking
- To-do and journal for daily learning habits
- Personalized learning profile and interview onboarding

## Tech Stack

### Languages

- JavaScript (frontend)
- Python (backend)

### Frameworks

- React + Vite (frontend)
- FastAPI (backend)

### Libraries and Services

- Tailwind CSS
- Supabase (database + auth)
- Groq API (LLM inference)

### Tools

- Vercel (frontend deployment)
- Railway (backend deployment)

## Project Structure

```
.
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── railway.json
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .env.example
```

## Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase project (URL + keys)
- Groq API key

### Steps

```bash
git clone https://github.com/AdixMeena/roronoazoro.git
cd roronoazoro
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Usage

### Run locally

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Example commands:

```bash
npm run dev
uvicorn main:app --reload
```

Expected output: The landing page loads and you can sign in, add subjects, generate roadmaps, and use the AI tutor.

Screenshots: Add screenshots here when available.

## Configuration

### Frontend environment variables (frontend/.env)

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend environment variables (backend/.env)

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:5173
```

## API Documentation

Base URL: `/`

### Health

`GET /health`

Response:

```json
{ "status": "healthy" }
```

### Personalized response

`POST /personalize`

Request:

```json
{
   "user_id": "uuid",
   "query": "Explain recursion",
   "context": "",
   "language": "english"
}
```

Response:

```json
{
   "personalized_prompt": "...",
   "response": "..."
}
```

### Generate profile from activity

`POST /generate-profile`

Request:

```json
{
   "user_id": "uuid",
   "user_data": {
      "chat_messages": [],
      "quizzes": [],
      "pdf_extractions": [],
      "roadmaps": []
   }
}
```

Response:

```json
{ "learning_profile": "..." }
```

### Generate profile from interview

`POST /generate-profile-from-interview`

Request:

```json
{
   "user_id": "uuid",
   "interview_responses": {
      "learning_style": { "value": "visual", "label": "By watching videos or seeing diagrams" }
   }
}
```

Response:

```json
{ "learning_profile": "..." }
```

## Testing

No automated tests yet.

## Deployment

### Frontend (Vercel)

- Root: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BACKEND_URL`

### Backend (Railway)

- Root: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GROQ_API_KEY`, `FRONTEND_URL`

## Roadmap

- Add advanced analytics for learning patterns
- Add reminders and calendar integrations
- Improve AI personalization using longer-term history

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

Unlicensed. No license has been specified.

## Author

- adixmeena

## Acknowledgments

- Supabase for auth and database
- Groq for fast LLM inference

## 🌐 Deploy to Vercel

```bash
npm run build
# Then push to GitHub and connect to Vercel
# Add your .env variables in Vercel → Settings → Environment Variables
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.jsx      # Main layout with sidebar + mobile nav
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── StarField.jsx      # Cosmic background animation
│   └── ProtectedRoute.jsx # Auth guard
├── context/
│   └── AuthContext.jsx    # Global auth state
├── lib/
│   └── clients.js         # Supabase + GitHub Models AI setup
├── pages/
│   ├── Landing.jsx        # Public landing page
│   ├── Auth.jsx           # Login / Signup
│   ├── Dashboard.jsx      # Home with subjects & stats
│   ├── PDFExtractor.jsx   # PDF → notes + Q&A
│   ├── QuizLab.jsx        # Quiz generator + taker
│   ├── DoubtFinisher.jsx  # AI chat
│   ├── Roadmap.jsx        # Subject roadmap tracker
│   ├── TodoJournal.jsx    # To-do + journal
│   └── Profile.jsx        # User profile + achievements
├── App.jsx                # Router setup
├── main.jsx               # Entry point
└── index.css              # Global cosmic styles
```

---

## 🎨 Design System

- **Colors**: Cosmic dark theme — deep space blues + nebula purples + aurora greens
- **Fonts**: Syne (headings) + DM Sans (body) + JetBrains Mono (code)
- **Components**: Glass morphism cards with blur effects
- **Responsive**: Full mobile support with bottom nav

---
