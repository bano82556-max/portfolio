# Personal Developer Portfolio

A modern, fast, responsive personal portfolio website built with semantic **HTML5**, clean **CSS3**, and modular **JavaScript**.

---

## 🌟 Features

- **Responsive Design**: Flawless experience on desktops, tablets, and mobile smartphones.
- **Dark / Light Theme Toggle**: Seamless switcher with preference saved in `localStorage`.
- **Interactive Navigation**: Sticky glassmorphic navbar, active scrollspy highlighting, and mobile slide-out menu.
- **Hero Section**: Engaging developer presentation, badge indicator, animated code card, and social links.
- **About Me**: Bio summary, key strengths, and live metric counters.
- **Skills Matrix**: Categorized tags for Frontend, Backend, Databases/Cloud, and DevOps/Tooling.
- **Featured Projects**: Filterable project gallery by category (All, Full Stack, Frontend, Cloud & AI) with demo and GitHub code links.
- **Experience & Education Timeline**: Career journey and academic milestones.
- **Interactive Contact Form**: Client-side validation, loading animation, feedback messages, and one-click email copy button.
- **Zero External JS Dependencies**: Lightweight, ultra-fast load time, pure vanilla code.

---

## 📂 Project Structure

```text
portfolio/
├── index.html        # Semantic HTML5 structure and content
├── style.css         # Modern styling, theme variables, glassmorphism, responsive layout
├── script.js         # Theme switcher, scrollspy, project filters, mobile menu, form logic
└── README.md         # Documentation and customization guide
```

---

## 🚀 How to Run Locally

You can open the website in your browser directly:

### Option 1: Open in Browser
Double-click `index.html` or open it with your browser:
- On macOS:
  ```bash
  open index.html
  ```
- On Linux:
  ```bash
  xdg-open index.html
  ```
- On Windows:
  ```cmd
  start index.html
  ```

### Option 2: Using a Local Development Server
If you prefer running a local HTTP server:
```bash
# Using Python 3:
python3 -m http.server 3000

# Using Node.js npx:
npx serve .
```
Then visit `http://localhost:3000` in your web browser.

---

## ✏️ How to Customize

1. **Personal Information**:
   - Open `index.html` and update your name, title, bio, and social media URLs (GitHub, LinkedIn, Twitter/X).
2. **Email Address**:
   - Change `muskan.dev@example.com` in `index.html` and `script.js` to your real email address.
3. **Projects**:
   - Add or modify `<article class="project-card">` entries in `index.html` with your real projects, GitHub repository links, and live demos.
4. **Resume / CV**:
   - Place your resume PDF in the directory (e.g. `resume.pdf`) and update the `#cv-btn` link in `index.html`:
     ```html
     <a href="resume.pdf" target="_blank" class="btn btn-ghost" id="cv-btn">...</a>
     ```

---

## 🌐 Free Deployment Options

- **GitHub Pages**:
  1. Create a GitHub repository (e.g., `portfolio`).
  2. Push these files to `main`.
  3. Go to **Settings** > **Pages** > Select `Deploy from a branch` (`main` / root) and click Save.
- **Vercel / Netlify**:
  - Drag and drop this folder onto [Netlify Drop](https://app.netlify.com/drop) or import from GitHub on [Vercel](https://vercel.com).

