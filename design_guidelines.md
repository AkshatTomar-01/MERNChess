# Design Guidelines: Premium Chess Platform

## Design Approach
**Reference-Based: Chess.com + Linear + Stripe Aesthetic**
This chess platform combines the game-focused clarity of Chess.com with Linear's refined typography and Stripe's color restraint. The design prioritizes an immersive gaming experience while maintaining professional polish suitable for portfolio showcase.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background Base: 15 11% 9% (rich navy-black #0f172a)
- Surface: 15 11% 13% (elevated panels)
- Surface Elevated: 15 11% 16% (cards, modals)
- Border Subtle: 15 11% 20%
- Border Default: 15 11% 25%

**Accent Colors**
- Primary Teal: 173 80% 40% (#14b8a6 - vibrant teal for CTAs, active states)
- Primary Teal Hover: 173 80% 35%
- Success Green: 142 71% 45% (wins, valid moves)
- Danger Red: 0 84% 60% (losses, invalid moves, resign)
- Warning Amber: 38 92% 50% (draw offers, warnings)

**Text Colors**
- Primary Text: 0 0% 98% (high contrast)
- Secondary Text: 0 0% 71% (muted information)
- Tertiary Text: 0 0% 55% (timestamps, labels)

**Chess-Specific**
- Light Squares: 39 40% 85% (warm cream)
- Dark Squares: 173 25% 45% (muted teal-gray)
- Highlighted Move: 173 80% 40% with 20% opacity overlay
- Last Move Indicator: 38 92% 50% with 15% opacity

### B. Typography

**Font Stack**
- Primary: Inter (via Google Fonts CDN) - UI, body text, stats
- Accent: JetBrains Mono - move notation, game codes, timers

**Hierarchy**
- Hero Heading: text-5xl md:text-6xl font-bold (48-60px)
- Page Title: text-4xl font-bold (36px)
- Section Heading: text-2xl font-semibold (24px)
- Card Title: text-xl font-semibold (20px)
- Body Large: text-base font-medium (16px)
- Body Default: text-sm (14px)
- Caption: text-xs (12px)
- Move Notation: text-sm font-mono (monospace, 14px)

### C. Layout System

**Spacing Primitives**
Use Tailwind units: 2, 3, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Micro spacing: p-2, gap-2, m-2 (8px)
- Component internal: p-4, gap-4 (16px)
- Section spacing: p-8, py-12, py-16 (32-64px)
- Major sections: py-20, py-24 (80-96px)

**Grid & Container**
- Max container width: max-w-7xl (1280px)
- Dashboard grid: grid-cols-1 lg:grid-cols-3 (sidebar-main-panel)
- Game layout: grid-cols-1 lg:grid-cols-[350px_1fr_300px] (history-board-chat)
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Navigation**
- Top nav bar with logo, user profile dropdown, notification bell
- Height: h-16 with px-6 padding
- Sticky positioning with backdrop-blur-lg and border-b
- Profile avatar: 10x10 rounded-full with online status indicator (green dot)

**Dashboard Cards**
- Stat cards: p-6 rounded-xl border with subtle gradient backgrounds
- Win/Loss/Draw counters with large numerals and trend indicators
- Recent matches list with opponent avatars, result badges, date stamps
- "Quick Play" action cards with game mode icons and hover lift effect

**Chess Board Interface**
- 8x8 grid centered in viewport on game page
- Board size: responsive (min 400px, max 600px on desktop)
- Coordinate labels (a-h, 1-8) in tertiary text outside board
- Captured pieces display above/below board with piece icons
- Move highlighting: semi-transparent teal overlay on selected square
- Legal move indicators: small teal dots on valid destination squares

**Side Panels**
- Move History (Left): Scrollable list with alternating white/black moves, algebraic notation, expandable for analysis
- Game Info (Right): Player cards with avatars, ratings, timers; resign/draw buttons; chat interface below
- Panel backgrounds: surface color with rounded-lg borders

**Buttons**
- Primary CTA: bg-teal px-6 py-3 rounded-lg font-semibold with hover:bg-teal-hover
- Secondary: border-teal text-teal px-6 py-3 rounded-lg with hover:bg-teal/10
- Destructive: bg-red px-4 py-2 rounded-lg
- Ghost: text-secondary hover:bg-surface px-4 py-2 rounded-lg

**Modals & Overlays**
- Game Over modal: centered card with result banner, stats recap, "Play Again" and "View Analysis" buttons
- Game code share: modal with large monospace code, copy button, QR code option
- Backdrop: bg-black/60 with backdrop-blur-sm

**Forms & Inputs**
- Input fields: bg-surface border-subtle rounded-lg px-4 py-3 focus:border-teal
- Consistent height: h-12 for all inputs
- Labels: text-sm font-medium mb-2 in secondary text

**Toast Notifications**
- Position: top-right with slide-in animation
- Types: success (green), error (red), info (teal), warning (amber)
- Auto-dismiss after 3-5 seconds with progress bar

### E. Animations

**Minimal & Purposeful**
- Page transitions: Framer Motion fade-in (0.3s ease)
- Card hover: slight lift (translateY -2px) and shadow increase
- Button hover: subtle scale (1.02) on primary CTAs only
- Chess piece moves: smooth drag with snap-to-grid on release
- Move played: brief glow pulse on destination square
- Loading states: subtle shimmer effect on skeleton screens

**No Animations For**
- Background gradients (static)
- Excessive scroll triggers
- Decorative elements without purpose

## Page-Specific Guidelines

### Landing/Marketing Page
**Hero Section** (100vh)
- Split layout: Left 50% - bold headline "Master Chess Online", subheadline, dual CTAs (Sign Up / Watch Demo)
- Right 50% - Animated chess board preview showing live game or famous position
- Background: gradient from #0f172a to slightly lighter navy
- No floating elements, grounded design

**Features Section** (py-24)
- 3-column grid: AI Opponent, Real-time Multiplayer, Match Analysis
- Each card: icon (Heroicons), title, 2-sentence description, subtle hover effect
- Use icons: SparklesIcon, UsersIcon, ChartBarIcon

**How It Works** (py-20)
- 4-step horizontal timeline with connecting lines
- Steps: Create Account → Choose Mode → Play Game → Review & Improve
- Each step: numbered badge, title, brief description

**Testimonials** (py-16, bg-surface)
- 2-column grid of user quotes with avatars, names, skill ratings
- Real-sounding feedback about gameplay experience

**CTA Section** (py-24)
- Centered: Large headline "Ready to Play?", primary CTA "Start Playing Free"
- Supporting text: "Join 10,000+ players worldwide"

### Dashboard Page
- Left sidebar (300px): Navigation menu, user profile summary, quick stats
- Main area: 3x stat cards (Wins/Losses/Draws), "Start New Game" action cards (3 modes), Recent Matches table (5 rows)
- Color-coded result badges: green (won), red (lost), amber (draw)

### Game Page
- Full-screen immersive layout with thin top nav only
- Central board with optimal sizing for viewport
- Left panel: Scrolling move list with jump-to-move interaction
- Right panel: Opponent info card, game controls, chat messages below
- Mobile: Stack panels below board

### Profile Page
- Header: Cover gradient, large avatar, username, rating badge
- Tabs: Overview, Match History, Statistics, Settings
- Overview: Achievement badges, play streak calendar, favorite openings

## Images

**Landing Hero Image**
High-quality 3D rendered chess board with dramatic lighting, modern aesthetic. Position: right 50% of hero section, blend into dark background. Show active game position (not starting position) with pieces mid-game for visual interest.

**Dashboard Placeholder**
User avatars throughout (generate diverse placeholder avatars or use initials in colored circles)

**No other images needed** - focus on typography, layout, and chess board as primary visual

## Responsive Behavior
- Desktop (1024px+): Full multi-column layouts as described
- Tablet (768-1023px): 2-column max, collapsible side panels
- Mobile (<768px): Single column stacking, hamburger menu, bottom navigation for game controls

This design creates a premium, portfolio-worthy chess platform that feels both sophisticated and focused on the core gaming experience.