# ⚡ Shubham Jamliya — Portfolio 2025

![Project Status](https://img.shields.io/badge/System-ONLINE-success?style=for-the-badge&color=00ff00)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

> **"Crafting digital experiences with kinetic typography and interactive depth."**

A high-performance personal portfolio that blends **editorial design** with **immersive engineering**. This project ditches standard static layouts for a fluid, motion-driven experience—featuring velocity-based animations, expanding accordions, and glitch aesthetics.

---

## 🏗️ Tech Stack

Built for speed and smooth 60fps animations.

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Core** | **React (Vite)** | Fast HMR and component-based architecture. |
| **Styling** | **Tailwind CSS** | Utility-first styling with custom typography configs. |
| **Motion** | **Framer Motion** | Physics-based animations, scroll velocity, and layout transitions. |
| **3D** | **Three.js** | Interactive constructivist sculpture in the hero (lazy-loaded chunk). |
| **Scroll** | **Lenis** | Smooth wheel scrolling on the home page (off for reduced-motion users). |
| **Routing** | **React Router DOM** | Client-side routing. |
| **Logic** | **Custom Hooks** | `useScroll`, `useTransform`, `useVelocity` for scroll physics. |

---

## 🚀 Key Features

### 1. Cinematic Hero Section (`Hero.tsx` + `three/HeroScene.tsx`)
* **3D Sculpture:** The red/black hero poster rebuilt as a toon-shaded Three.js scene — hover a shape to swap its colour, click to spin it, drag to rotate, scroll to watch it drift apart.
* **3D Letter Flip:** Each letter of the name flips up on load and lifts on hover.
* **Graceful Fallback:** The original poster image is shown if WebGL is unavailable.
* **Micro-Interactions:** Magnetic CTA, rotating "I build…" ticker and live availability badge.

### 2. The "Accordion" Gallery (`Projects.jsx`)
* **Interactive Expansion:** Projects are displayed as compressed strips that expand horizontally (desktop) or vertically (mobile) on interaction.
* **Gamified UX:** A tactile, high-end feel that reveals details and imagery only when the user focuses on a specific item.
* **Responsive Layout:** Automatically switches axis based on device width.

### 3. Kinetic Capabilities (`Skills.jsx`)
* **Velocity Scrolling:** The skill streams accelerate based on how fast the user scrolls the page.
* **Infinite Marquee:** Seamless looping tracks of technical skills.
* **Stroke Typography:** Uses transparent outline text that fills in solid upon hover.

### 4. Smart Navigation (`Navbar.jsx`)
* **Intelligent Hiding:** The navbar vanishes on scroll-down to maximize viewing area and reappears instantly on scroll-up.
* **Flip Links:** Navigation items feature a slot-machine style "flip" animation on hover.
* **Glassmorphism:** Frosted glass effect for a modern, floating interface.

### 5. System Glitch 404 (`NotFound.jsx`)
* **Cyberpunk Aesthetic:** A custom error page featuring RGB split text and noise grain.
* **Analog Feel:** Mimics a digital signal loss or system crash.

### 6. New Sections
* **Capabilities (`Services.tsx`):** 3D tilt cards with light glare, a red fill wipe and a hard brutalist shadow.
* **Kinetic Tapes (`TapeBand.tsx`):** Two crossing strips whose speed and direction follow your scroll.
* **Skill Orbit (`SkillSphere.tsx`):** A draggable 3D sphere of every tool; pick a discipline to light up its tags.
* **Process (`Process.tsx`):** A pinned section that scrolls horizontally on desktop, with cards that swing in 3D.
* **Quick Note (`ContactForm.tsx`):** Validated form that opens the visitor's mail app pre-filled.

### 7. Site-wide Polish
* **Intro Preloader:** Counter + double curtain, once per session.
* **Custom Cursor:** Context labels (`data-cursor="VIEW"`) on interactive areas; mouse devices only.
* **Command Palette:** `⌘K` / `Ctrl+K` to jump to any section, copy the email or switch theme.
* **Light / Dark Theme:** Circular "ink spill" reveal via the View Transitions API (defaults to light).
* **Page Transitions:** Red curtain wipe between routes.
* **Details:** Scroll progress bar, scroll-spy nav, count-up stats, film grain, keyboard navigation in the archive (↑/↓, J/K), tap-to-expand experience on touch, reduced-motion support.

---

## 🛠️ Installation & Setup

Clone the repository and initialize the development environment.

```bash
# 1. Clone the repository
git clone https://github.com/Shubhamjamliya/myPortfolio.git

# 2. Navigate into the directory
cd myPortfolio

# 3. Install dependencies
npm install

# 4. Initialize development server
npm run dev
