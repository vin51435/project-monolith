# 🏋️ 6-Day PPL Workout Routine — Next.js + Tailwind CSS

A responsive, mobile-first Next.js web application built with Tailwind CSS displaying the complete **6-Day PPL + Daily Night Routine (6 kg Dumbbells + Pull-Up Ledge)** program.

Designed for gym and home workouts with one-thumb mobile controls, interactive set check-offs, a built-in rest timer with audio chime, and pre-configured static export for one-click deployment to **Hostinger** web hosting.

---

## ✨ Features

- **📱 Mobile-First UX**: Large touch targets (≥44px), quick-tap bottom navigation, and swipeable day switchers designed for handheld smartphone workout sessions.
- **⏱️ Integrated Rest Timer**: Floating rest countdown with one-tap presets (30s, 45s, 60s, 75s, 90s, 120s), real-time progress circle, and built-in synthesizer chime (no external audio assets required).
- **✅ Interactive Workout Tracker**: Mark off individual sets (S1, S2, S3...) in real time with automatic rest timer prompts.
- **📅 Complete 7-Day Split**:
  - **Day 1**: Push A (Chest + Shoulders + Triceps)
  - **Day 2**: Pull A (Back + Biceps + Rear Delts + Grip)
  - **Day 3**: Legs + Core A (Quads + Hamstrings + Glutes + Front Abs)
  - **Day 4**: Push B (Chest + Shoulder Hypertrophy + Triceps)
  - **Day 5**: Pull B (Back + Biceps + Rear Delts + Forearms)
  - **Day 6**: Legs + Core B (Unilateral Legs + Glutes + Obliques + Deep Core + Neck)
  - **Day 7**: Rest & Active Recovery Day
- **🌙 Daily Night Routine**: 9-item mobility and decompression routine with the Golden Rule card and recovery guidelines.
- **📈 Progression Guide**: 7 progressive overload methods for fixed 6 kg dumbbells + 5-week Goblet Squat progression breakdown.
- **📖 40 Exercise Execution Guides**: Detailed cards with high-resolution visual demonstrations, primary/secondary targeted muscles, step-by-step form guides, and mind-muscle connection cues.
- **📚 17-Term Glossary**: Searchable biomechanics and strength training definitions.
- **🌐 100% Hostinger Ready**: Next.js static export (`output: 'export'`) generating pure HTML, CSS, JS, and images in the `out/` folder with an included `.htaccess` file for Hostinger LiteSpeed/Apache servers.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or open Chrome DevTools in Mobile Device Mode: `Ctrl+Shift+M` or `Cmd+Shift+M`).

---

## 🏗️ Production Build & Static Export

To generate the standalone static build for Hostinger:

```bash
npm run build
```

This compiles your application and creates an **`out/`** directory containing:
- `index.html` and static pages
- `_next/` (optimized CSS and JavaScript bundles)
- `exercise images/` (all 39+ high-res demonstration images)
- `.htaccess` (pre-configured compression, caching, and clean routing rules)

---

## 🌐 How to Deploy to Hostinger (Step-by-Step)

### Method 1: Hostinger File Manager (Recommended - 2 Minutes)

1. Run the build command in your terminal:
   ```bash
   npm run build
   ```
2. Open the newly generated **`out`** folder.
3. Select all files and folders inside `out/` (including `index.html`, `_next`, `exercise images`, and `.htaccess`) and compress them into a `.zip` file (e.g., `build.zip`).
4. Log in to your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
5. Navigate to **Websites** &rarr; **Manage** &rarr; **File Manager** (under Files).
6. Go into the **`public_html`** directory of your domain/subdomain.
   > *Note: If there is a default `default.php` or placeholder file, you can delete or rename it.*
7. Click **Upload** in the top right corner and upload your `build.zip`.
8. Right-click `build.zip` and select **Extract** &rarr; choose `public_html` as destination.
9. Verify that `index.html`, `.htaccess`, and `_next` are located directly in `public_html`.
10. Open your website domain in your browser — your workout routine app is live! 🎉

---

### Method 2: Hostinger Git Auto-Deployment

1. Push this repository to GitHub or GitLab.
2. In Hostinger hPanel, go to **Advanced** &rarr; **Git**.
3. Create a new repository link pointing to your repository.
4. If deploying with static files, set the deployment branch to `main` and specify the output folder or use Hostinger Node.js if using Cloud/VPS hosting.

---

### Method 3: FTP / FileZilla

1. Connect to your Hostinger FTP account using FileZilla or WinSCP.
2. Navigate to `/public_html/`.
3. Upload all contents from the local `out/` folder into `/public_html/`.

---

## ⚙️ Hostinger `.htaccess` Features Included

The included `public/.htaccess` automatically configures:
- **Gzip / Deflate Compression**: Minimizes file size for fast loading on mobile networks.
- **Browser Caching**: 1-year cache headers for exercise images, fonts, CSS, and JS.
- **Clean Routing**: Fallbacks and trailing slash handling for smooth single-page navigation.
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection.

---

## 📁 Project Structure

```
workout-routine-app/
├── public/
│   ├── .htaccess                   # Hostinger LiteSpeed / Apache web server rules
│   └── exercise images/            # 39+ high-resolution exercise demonstration images
├── src/
│   ├── app/
│   │   ├── globals.css             # Tailwind base & custom animations
│   │   ├── layout.tsx              # SEO metadata & responsive viewport settings
│   │   └── page.tsx                # Main SPA orchestrator
│   ├── components/
│   │   ├── Header.tsx              # Mobile & desktop sticky navigation
│   │   ├── BottomNav.tsx           # Mobile-first one-thumb navigation bar
│   │   ├── RestTimerModal.tsx      # Interactive audio rest countdown timer
│   │   ├── DayWorkoutView.tsx      # Day 1-7 workout viewer & interactive set checklist
│   │   ├── WeeklyScheduleView.tsx  # 7-day program split overview
│   │   ├── NightRoutineView.tsx    # Night mobility & recovery checklist
│   │   ├── ProgressionView.tsx     # 6 kg progressive overload rules & squat guide
│   │   ├── GlossaryView.tsx        # Searchable workout terminology glossary
│   │   ├── ExerciseLibraryView.tsx # All 40 exercise cards with cues and visuals
│   │   └── Footer.tsx              # Hostinger ready footer
│   └── data/
│       └── workoutData.ts          # Complete typed workout database
├── next.config.mjs                 # Next.js static export configuration (output: 'export')
├── tailwind.config.js              # Tailwind theme, typography & responsive breakpoints
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies & scripts
```
