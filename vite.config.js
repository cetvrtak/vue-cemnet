import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins:
      [
        vue({
          template: {}
        }),
        Components({
          resolvers: [AntDesignVueResolver()]
        }),
        // splitVendorChunkPlugin()
      ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
      },
    },
  },
  build: {
    manifest: true,
    outDir: "../public/assets/dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/main.js`,
        // chunkFileNames: 'assets/vendor.js',
        assetFileNames: "assets/[name]-vue.[ext]",
        // manualChunks: {
        //   highcharts: ['highcharts-vue', 'highcharts'],
        //   devextreme: ['devextreme-vue'],
        //   gmaps: ['@googlemaps/js-api-loader', '@googlemaps/markerclusterer'],
        //   vue: ['ant-design-vue', 'vue']
        // }
      }
    }
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      "devextreme/ui": 'devextreme/esm/ui'
    }
  }
})
