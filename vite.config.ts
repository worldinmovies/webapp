import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
    css: {
        preprocessorOptions: {
          sass: {
            api: 'modern-compiler'
          }
        }
      },    
    base: '',
    plugins: [react(), viteTsconfigPaths(), sentryVitePlugin({
        org: "david-eriksson",
        project: "worldinmovies-frontend",
        authToken: process.env.SENTRY_AUTH_TOKEN,
    })],
    build: {
        target: browserslistToEsbuild([
            '>0.2%',
            'not dead',
            'not op_mini all'
        ]),

        sourcemap: true
    },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000, 
    },
})