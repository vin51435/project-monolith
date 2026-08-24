# nexus-drift

A modular, mobile-responsive web application built with Next.js (App Router), TypeScript, and Tailwind CSS. Configured for static export and multi-platform deployment.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (Static HTML Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Installation

Install project dependencies:

```bash
npm install
```

### 2. Development

Run the development server locally (with LAN binding enabled):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 🏗️ Production Build

Generate optimized static assets:

```bash
npm run build
```

The compiled output will be generated in the **`out/`** directory, containing standalone HTML, CSS, JavaScript, and static assets.

---

## 🌐 Deployment

### Static Hosting (Hostinger / Apache / Nginx)

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Upload the contents of the generated **`out/`** folder directly to your web server root (e.g. `public_html/`).
3. The included `.htaccess` file provides pre-configured compression, caching, and clean URL rewrites.

### Vercel / Cloudflare Pages

1. Push this repository to GitHub/GitLab.
2. Link the repository to your provider.
3. Set the build command to `npm run build` and output directory to `out`.

---

## 📄 License

MIT
