# 🌐 StudySphere — Global Student Community Platform

> A lightweight educational social platform for high school and university students worldwide.

![StudySphere Banner](https://img.shields.io/badge/StudySphere-v1.0-2563eb?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Features

### Community
- 📝 **Student Feed** — Share notes, tips, questions, and advice
- ❓ **Q&A Hub** — Ask and answer academic questions
- 📚 **Study Notes** — Upload and browse notes by subject
- 👥 **Study Groups** — Join groups with built-in group chat
- 🏆 **Leaderboard** — Top students by XP, streak, and posts

### Study Tools
- ⏱️ **Pomodoro Timer** — Focus / Short Break / Long Break modes
- 🃏 **Flashcards** — Add and flip through study cards
- ✅ **Daily Tasks** — Checklist with progress bar
- 🎯 **Daily Goals** — Track your study goals
- 📅 **Study Planner** — Schedule study sessions by subject
- 📝 **Quick Quiz** — 5-question subject quiz with scoring

### Gamification
- ⭐ XP system with levels
- 🔥 Daily study streaks
- 🏅 Badges (First Post, Week Streak, Scholar, Helper, etc.)
- 🎓 Profile system with stats

### Design
- 🌙 Dark / Light mode
- 📱 Fully mobile responsive
- 🎯 Focus mode (distraction-free)
- 🔍 Real-time search across feed and notes

---

## 🚀 Quick Start

### Option 1 — Open directly
Just open `index.html` in your browser. No server needed.

### Option 2 — Local server (recommended)
```bash
# Python
python -m http.server 3000

# Node.js
npx serve .

# Then open: http://localhost:3000
```

---

## 📂 File Structure

```
studysphere/
├── index.html      # Main HTML (single page app)
├── style.css       # All styles (CSS variables, dark mode, responsive)
├── app.js          # Application logic, routing, all features
├── data.js         # Seed data, constants, sample content
├── manifest.json   # PWA manifest
├── sitemap.xml     # SEO sitemap
├── robots.txt      # SEO robots file
├── .env.example    # API key template
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

---

## 🌍 Deployment

### GitHub Pages
```bash
git init
git add .
git commit -m "Launch StudySphere"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/studysphere.git
git push -u origin main
```
Then: Repo → Settings → Pages → Source: `main` branch → `/root`
Your site: `https://YOUR_USERNAME.github.io/studysphere`

### Netlify
1. Go to [netlify.com](https://netlify.com) → New site from Git
2. Connect your GitHub repo
3. Build command: _(leave empty)_
4. Publish directory: `.` (root)
5. Click Deploy

Or drag-and-drop the folder to [app.netlify.com/drop](https://app.netlify.com/drop)

---

## 🔐 API Security

If adding Groq AI features:
1. Copy `.env.example` → `.env`
2. Add your `GROQ_API_KEY` in `.env`
3. `.env` is in `.gitignore` — it will never be committed
4. For GitHub Actions, add secrets at: Repo → Settings → Secrets → Actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | HTML5 + CSS3 (custom, no framework) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | `localStorage` (no backend needed) |
| Fonts | Sora + JetBrains Mono (Google Fonts) |
| Icons | Font Awesome 6 |
| PWA | Web App Manifest |

---

## 📱 Subjects Covered
Mathematics · Physics · Chemistry · Biology · Computer Science · Languages · Economics · History

---

## 📄 License
MIT — free to use, modify, and deploy.

---

> Built with ❤️ for students everywhere. Study hard, help others, grow together. 🌍
