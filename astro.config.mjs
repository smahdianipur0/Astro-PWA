import { defineConfig } from 'astro/config';

import alpinejs from "@astrojs/alpinejs";

import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(),

    AstroPWA({
      devOptions: {
        enabled: true }

    })


    ]
});