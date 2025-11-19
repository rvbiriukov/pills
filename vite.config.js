import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: If deploying to https://<USERNAME>.github.io/<REPO_NAME>/
  // Set base to '/<REPO_NAME>/' (e.g., base: '/pills/')
  // base: '/pills/', 
})
