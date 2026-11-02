# PINK THEORY — An Interactive 3D Portfolio by Muskan 🌸

> **"A little creativity. A lot of curiosity."**  
> *"Explore. Discover. Create."*

**PINK THEORY** is an interactive, game-like 3D personal portfolio set inside a miniature floating fantasy island, crafted for **Muskan** — an aspiring AI engineer, creative thinker, problem solver, artist, and photography enthusiast.

---

## 🎨 Visual Identity & Palette

- **Primary Colors**:
  - Baby Pink: `#F4DCE5`
  - Cream: `#F8EDE2`
  - Ivory: `#FFFAF5`
  - Dusty Rose: `#C0849B`
  - Deep Plum: `#594450`
  - Soft Brown: `#806773`
- **Typography**:
  - `Playfair Display` for elegant headings
  - `DM Sans` for readable body content
  - `Caveat` for handwritten studio notes
  - `Space Mono` for technical labels & code snippets

---

## 🌟 The Experience & Architecture

### 1. Opening Experience (Cinematic Introduction)
- Warm cream fade-in background with drifting pink particles.
- Greeting: *"Hello, Explorer! You've entered Muskan's little universe."*
- **ENTER MY WORLD** button with a smooth 3D camera zoom dive into the floating island (with instant *Skip Intro* option).

### 2. Main World — 3D Floating Fantasy Island
- Real-time 3D WebGL floating fantasy island rendered via **Three.js**:
  - Tiered pastel cliff layers and grassy island plateau.
  - Curving stone pathways connecting 5 destinations.
  - Stylized miniature trees, flowers, and drifting low-poly clouds.
  - Interactive 3D landmarks with real-time 3D-to-2D projected pins.
  - Drag to orbit & rotate, scroll to zoom, click any building or pin to explore.

### 3. The Five Interactive Destinations

1. **🔬 The Tech Lab (Engineering & Technical Projects)**
   - Modern laboratory with holographic interfaces and code panels.
   - **Smart India Hackathon (SIH)**:
     - Title: *AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities.*
     - Role: **Team Leader** (Problem statement, project vision, proposed solution, team coordination, and presentation delivery).
   - **Plan2Space**:
     - Title: *Transforming 2D Floor Plans into Interactive 3D Layouts.*
     - Role: **Integration & Quality** (Repository structure, shared interface contracts, AI-to-3D viewer planning, QA and testing).
   - Direct link to Muskan's verified GitHub: [`bano82556-max`](https://github.com/bano82556-max).

2. **🎨 The Art Atelier (Authentic Drawings & Sketches)**
   - Traditional artist studio mixed with modern exhibition.
   - Pinned notes, sketchbook aesthetics, and handwritten notes (`Caveat`).
   - Features Muskan's real uploaded artwork:
     - *Reaching for the Blooms* (Colored pencil & ink)
     - *Let's Start The Journey* (*"It's not over until I win"*)
     - *The Art of Sitting Alone* (Graphite reflection on solitude)
     - *Reading in the Shade* (Colored sketch under an old tree)
   - Fullscreen interactive lightbox with prev/next navigation.

3. **🌿 The Nature Gallery (Minimalist Photography Exhibition)**
   - Elegant photography exhibition celebrating quiet skies, natural light, and foliage.
   - Filterable categories: *All Photographs*, *Skies & Light*, *Nature & Leaves*.
   - Features Muskan's real photographs:
     - *Lilac Twilight Over Campus* (Campus architecture under soft lilac dusk skies)
     - *Twilight Through the Canopy* (Amber garden lantern glowing under lush tree leaves)
     - Dedicated placeholder card for future additions.

4. **🧭 My Journey (Personal Story, Skills & Milestones)**
   - Whimsical garden pathway with stone milestone markers.
   - Personal introduction as a first-semester AI engineering student.
   - **Skills Matrix (Clean Visual Tags, No Fake Percentages)**:
     - Programming: Python (*Verified Core*), OOP, HTML5/CSS3, C/C++ (*In Progress*).
     - Tools: Git, GitHub, Terminal / Command Line, VS Code.
     - Interests: Artificial Intelligence, Robotics, Software Development, Machine Learning.
     - Strengths: Logical Thinking, Problem-Solving, Teamwork, Adaptability.
   - Milestone timeline: Academic journey, SIH team leadership, Plan2Space integration, and Robotics club.

5. **📬 The Mailbox (Contact & Professional Connections)**
   - Pastel-pink mailbox graphic with animated sliding letter.
   - Direct contact channels:
     - **Email**: `bano82556@gmail.com` with 1-click copy button.
     - **GitHub**: [`bano82556-max`](https://github.com/bano82556-max).
     - **LinkedIn**: `linkedin.com/in/muskan-ai`.
   - Elegant letter-style contact form.

---

## 🗺️ Persistent Heads-Up Display (HUD) & Discoveries

- **HUD Navigation**: Quick-switch chips to all 5 destinations from anywhere.
- **Exploration Counter**: Tracks discovered destinations (`Explored: X/5 ✨`).
- **Island Map**: Top-down interactive map overlay with clickable location pins.
- **Ambient Audio (Web Audio API)**: Toggles gentle, ethereal resonant chimes.
- **Hidden Easter Eggs**:
  - 🦋 *Golden Butterfly*: Reveals fun facts about Muskan.
  - 🎁 *Mystery Gift Box*: Opens a personal handwritten note.
  - ⭐ *3 Collectible Stars*: Clickable hidden stars on the island.
  - ✈️ *Paper Airplane*: Displays current updates and learning notes.
- **Magical Cursor Experience**: Delicate pink star follower with interaction sparkles.

---

## 🚀 How to Run Locally

Preview immediately in your browser:

- **On macOS (Terminal)**:
  ```bash
  open index.html
  ```
- **Or start a local live server**:
  ```bash
  python3 -m http.server 3000
  ```
  Then visit `http://localhost:3000` in any web browser.
