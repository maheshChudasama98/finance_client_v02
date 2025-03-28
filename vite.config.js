import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1'),
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: {
      port: 3030,
    },
    preview: {
      port: 3000,
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __BUILD_TIME__: JSON.stringify(packageJson.buildTime),
      __DEVELOPER_MODE__: JSON.stringify(env.VITE_DEVELOPER_MODE),
      __PROJECT_NAME__: JSON.stringify(env.VITE_PROJECT_NAME),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      __ADMIN_GMAIL__: JSON.stringify(env.VITE_ADMIN_GMAIL),
      __WEATHER_API_KEY__: JSON.stringify(env.VITE_WEATHER_API_KEY),
      __OPEN_WEATHER_API__: JSON.stringify(env.VITE_OPEN_WEATHER_API),
      __GOOGLE_MAPS_API_KEY__: JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      __ENV_MODE__: JSON.stringify(mode),
    },
  };
});