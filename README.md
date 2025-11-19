# Digital Pillbox 💊

A premium, localized medication schedule app built with React, Tailwind CSS, and Vite.

## Features
- **Beautiful UI**: Glassmorphism, soft shadows, and smooth animations.
- **Localization**: Supports EN, DE, ES, PT, RU.
- **Persistence**: Automatically saves your schedule to your device.
- **Export**: Generates `.ics` calendar files for Google/Apple Calendar.

## 🚀 How to Deploy to GitHub Pages

I have already set up the project for you. Follow these steps to put it online:

### 1. Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `pills`).
3. Make it **Public**.
4. **Do not** initialize with README, .gitignore, or License (we already have them).
5. Click **Create repository**.

### 2. Push Your Code
Run these commands in your terminal (replace `<YOUR_USERNAME>` and `<REPO_NAME>`):

```bash
# Link your local files to the new GitHub repo
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# Rename branch to main (standard practice)
git branch -M main

# Push your code
git push -u origin main
```

### 3. Configure GitHub Pages
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. The deployment will start automatically! Wait a minute or two.
4. Refresh the page to see your live URL.

### ⚠️ Important: Fixing the "Blank Page" Issue
If your live site shows a blank white page, you need to update the `base` path:

1. Open `vite.config.js` in this folder.
2. Uncomment and update the `base` line to match your repository name:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/pills/', // <--- If your repo is named 'pills'
   })
   ```
3. Commit and push the change:
   ```bash
   git add vite.config.js
   git commit -m "Update base path for GitHub Pages"
   git push
   ```

## Development
To run locally:
```bash
npm install
npm run dev
```
