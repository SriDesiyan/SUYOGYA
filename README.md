# SUYOGYA

> **SBI Agentic AI Digital Engagement Intelligence Platform**
> 
> *Knowing when to engage is more valuable than knowing what to sell.*

SUYOGYA is a state-of-the-art enterprise digital engagement intelligence platform designed for the State Bank of India. Built with Apple spatial UI aesthetics, high-performance web graphics, and strict enterprise code quality metrics, it simulates real-time wealth segment advisory signals.

---

## 🛠️ Technology Stack

SUYOGYA integrates modern, industry-standard frontend and developer tooling:

- **Core & Runtime**: React 18, TypeScript (Strict Mode), Vite (ESNext build targeting ES2020)
- **Styling & UI**: Tailwind CSS (Custom spatial HSL theme tokens), Custom UI Primitives, Lucide Icons
- **3D Graphics & Motion**: Three.js, React Three Fiber (R3F), `@react-three/drei` (Spatial points mesh), GSAP (Staggered card/metrics load animations), Framer Motion (Route indicator transitions)
- **Layout & Scroll**: React Router v6, Lenis (Smooth kinetic scrolling)
- **Data & State Management**: `@tanstack/react-query` (Simulated live queries/mutations), Axios (API client)
- **Form & Validation**: React Hook Form, Zod (Schema-validated inputs)
- **Analytics Visualization**: Recharts (Engagement channels area charts), Custom SVG animated charts
- **Quality & Workflows**: ESLint (Strict rules), Prettier, Husky (Git pre-commit hooks running checks)
- **Virtualization**: Docker (Multi-stage node building + Nginx static server production distribution), Docker Compose

---

## 📁 Project Architecture & Directory Layout

```text
SUYOGYA/
├── .husky/                 # Git hooks configurations (pre-commit checks)
├── public/                 # Static assets (favicons, SVG layouts)
├── src/
│   ├── @types/             # Custom global TypeScript typings
│   ├── components/         # Reusable components
│   │   ├── 3d/             # Three.js / React Three Fiber components
│   │   │   └── SignalSphere.tsx
│   │   ├── layout/         # Platform shell layouts (Navbar, Sidebar)
│   │   └── ui/             # Apple spatial design system components
│   ├── design/             # Design system theme tokens (color scales, curves)
│   ├── hooks/              # Custom reusable React hooks
│   ├── lib/                # Shared helper libraries (motion physics, class merger utils)
│   ├── pages/              # Routed view canvases (Dashboard, DesignSystem)
│   ├── providers/          # Shared contexts (ThemeProvider, QueryClient, Toast)
│   ├── styles/             # Global CSS and Tailwind directives
│   ├── App.tsx             # Route definitions and layouts wrapper
│   ├── main.tsx            # Root bootstrap and provider wrapper
│   └── vite-env.d.ts       # Vite global environment typings
├── .dockerignore           # Exclusions list for containerization
├── .env.example            # Environment variables template
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc             # Prettier styling layout
├── Dockerfile              # Multi-stage production container build directives
├── docker-compose.yml      # Port mappings and environment inject orchestrator
├── nginx.conf              # Custom Nginx static fallback rule (supports React Router redirects)
├── postcss.config.js       # PostCSS processor rules
├── tailwind.config.ts      # Design system color and animation injection mapping
├── tsconfig.json           # TS projects reference compiler setup
└── vite.config.ts          # Vite asset bundling rules (R3F code split chunks)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (version 20 or higher)
- npm (version 10 or higher)
- Docker (optional, for containerized run)

### Setup & Local Installation

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/SriDesiyan/SUYOGYA.git
   cd SUYOGYA
   ```

2. Initialize local configuration file:
   ```bash
   cp .env.example .env
   ```

3. Install node dependencies:
   ```bash
   npm install
   ```

4. Initialize Git Hooks:
   ```bash
   npx husky
   ```

---

## 💻 Running the Application

### Local Development Server

Spin up the local Vite server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Verification (Lints, Types & Build)

Ensure your code is clean before committing:
```bash
# Run ESLint rules
npm run lint

# Run strict TypeScript compiler verification
npm run typecheck

# Build standard production bundle locally
npm run build
```

### Docker Local Container Run

SUYOGYA supports fully containerized deployments.

1. Build and run the app in production mode on port 8080:
   ```bash
   docker-compose up --build -d
   ```
2. Open [http://localhost:8080](http://localhost:8080) to inspect.

---

## 🛡️ Git Workflows & Enterprise Standards

1. **Commit Message Format**: Follow semantic commits, e.g., `feat: initialize SUYOGYA enterprise project`.
2. **Pre-commit Checks**: On every git commit attempt, Husky runs `npm run typecheck && npm run lint`. Commits fail if compile check errors or ESLint warnings are detected.
3. **Theme system**: Default theme is **Light (White)**. Use the navbar toggler to select **Dark (Classic spatial indigo)**. Preferences are stored in browser localStorage.
