// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/unplugin-vue-components/dist/vite.js";
import Icons from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/unplugin-icons/dist/resolver.js";
import { ElementPlusResolver } from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/unplugin-vue-components/dist/resolvers.js";
import vueDevTools from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import VueI18nPlugin from "file:///D:/Projects/LuoShuiTianYi/7DaysToDie-ServerKit-webui/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_dirname = "D:\\Projects\\LuoShuiTianYi\\7DaysToDie-ServerKit-webui";
process.env.BROWSER = "chrome";
var pathSrc = path.resolve(__vite_injected_original_dirname, "./src");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/,
          // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/,
          // .vue
          /\.md$/
          // .md
        ],
        // global imports to register
        imports: [
          // presets
          "vue",
          "vue-router",
          "pinia",
          "@vueuse/core",
          "vue-i18n",
          { "~/plugins/dayjs": [["default", "dayjs"]] }
        ],
        // Filepath to generate corresponding .d.ts file.
        // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
        // Set `false` to disable.
        dts: true,
        // Auto import inside Vue template
        // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
        vueTemplate: false,
        dirs: ["./src/utils/*", "./src/store/*"],
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass"
          })
        ]
        // Auto import element API
      }),
      Components({
        resolvers: [
          // Auto register Element Plus components
          ElementPlusResolver({
            importStyle: "sass"
          }),
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            prefix: "icon"
            // 自动引入的Icon组件统一前缀, 默认为 i, 设置false为不需要前缀
            // {prefix}-{collection}-{icon} 使用组件解析器时, 您必须遵循名称转换才能正确推断图标
            // enabledCollections: ['mdi', 'ep', 'ant-design', 'uiw', 'arcticons'], // 这是可选的, 默认启用 Iconify 支持的所有集合['mdi']
            // alias: {
            //     park: 'icon-park',
            // }
          })
        ],
        dts: true,
        globs: ["./src/components/*.vue", "./src/components/*/index.vue"]
      }),
      Icons({
        // https://icones.js.org/
        autoInstall: true,
        compiler: "vue3"
      }),
      VueI18nPlugin({
        include: [path.resolve(__vite_injected_original_dirname, "./src/locales/**")]
      })
    ],
    base: env.VITE_APP_BASE_URL,
    server: {
      host: "localhost",
      port: env.VITE_PORT,
      open: env.VITE_OPEN,
      proxy: {
        "/api": {
          target: `http://${env.VITE_APP_API_DOMAIN}:${env.VITE_APP_API_PORT}`,
          changeOrigin: true
        }
      }
    },
    build: {
      // sourcemap: true,
    },
    resolve: {
      alias: {
        "~/": `${pathSrc}/`
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // define global scss variable
          additionalData: `@use '~/assets/styles/var.scss' as *;`
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxMdW9TaHVpVGlhbllpXFxcXDdEYXlzVG9EaWUtU2VydmVyS2l0LXdlYnVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxMdW9TaHVpVGlhbllpXFxcXDdEYXlzVG9EaWUtU2VydmVyS2l0LXdlYnVpXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9MdW9TaHVpVGlhbllpLzdEYXlzVG9EaWUtU2VydmVyS2l0LXdlYnVpL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSc7XG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcic7XG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnO1xuaW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSc7XG5cbnByb2Nlc3MuZW52LkJST1dTRVIgPSAnY2hyb21lJztcblxuY29uc3QgcGF0aFNyYyA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAgIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgdnVlKCksXG4gICAgICAgICAgICB2dWVEZXZUb29scygpLFxuICAgICAgICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgICAgICAgICAgLy8gdGFyZ2V0cyB0byB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgICAgIC9cXC5bdGpdc3g/JC8sIC8vIC50cywgLnRzeCwgLmpzLCAuanN4XG4gICAgICAgICAgICAgICAgICAgIC9cXC52dWUkLyxcbiAgICAgICAgICAgICAgICAgICAgL1xcLnZ1ZVxcP3Z1ZS8sIC8vIC52dWVcbiAgICAgICAgICAgICAgICAgICAgL1xcLm1kJC8sIC8vIC5tZFxuICAgICAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgICAgICAvLyBnbG9iYWwgaW1wb3J0cyB0byByZWdpc3RlclxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJlc2V0c1xuICAgICAgICAgICAgICAgICAgICAndnVlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAgICAgICAgICAgICAncGluaWEnLFxuICAgICAgICAgICAgICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgICAgICAgICAgICAgeyAnfi9wbHVnaW5zL2RheWpzJzogW1snZGVmYXVsdCcsICdkYXlqcyddXSB9LFxuICAgICAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgICAgICAvLyBGaWxlcGF0aCB0byBnZW5lcmF0ZSBjb3JyZXNwb25kaW5nIC5kLnRzIGZpbGUuXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdHMgdG8gJy4vYXV0by1pbXBvcnRzLmQudHMnIHdoZW4gYHR5cGVzY3JpcHRgIGlzIGluc3RhbGxlZCBsb2NhbGx5LlxuICAgICAgICAgICAgICAgIC8vIFNldCBgZmFsc2VgIHRvIGRpc2FibGUuXG4gICAgICAgICAgICAgICAgZHRzOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgLy8gQXV0byBpbXBvcnQgaW5zaWRlIFZ1ZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW5qcy91bmltcG9ydC9wdWxsLzE1IGFuZCBodHRwczovL2dpdGh1Yi5jb20vdW5qcy91bmltcG9ydC9wdWxsLzcyXG4gICAgICAgICAgICAgICAgdnVlVGVtcGxhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRpcnM6IFsnLi9zcmMvdXRpbHMvKicsICcuL3NyYy9zdG9yZS8qJ10sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgXSwgLy8gQXV0byBpbXBvcnQgZWxlbWVudCBBUElcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgIC8vIEF1dG8gcmVnaXN0ZXIgRWxlbWVudCBQbHVzIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgICAgICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnaWNvbicsIC8vIFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVx1NzY4NEljb25cdTdFQzRcdTRFRjZcdTdFREZcdTRFMDBcdTUyNERcdTdGMDAsIFx1OUVEOFx1OEJBNFx1NEUzQSBpLCBcdThCQkVcdTdGNkVmYWxzZVx1NEUzQVx1NEUwRFx1OTcwMFx1ODk4MVx1NTI0RFx1N0YwMFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8ge3ByZWZpeH0te2NvbGxlY3Rpb259LXtpY29ufSBcdTRGN0ZcdTc1MjhcdTdFQzRcdTRFRjZcdTg5RTNcdTY3OTBcdTU2NjhcdTY1RjYsIFx1NjBBOFx1NUZDNVx1OTg3Qlx1OTA3NVx1NUZBQVx1NTQwRFx1NzlGMFx1OEY2Q1x1NjM2Mlx1NjI0RFx1ODBGRFx1NkI2M1x1Nzg2RVx1NjNBOFx1NjVBRFx1NTZGRVx1NjgwN1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5hYmxlZENvbGxlY3Rpb25zOiBbJ21kaScsICdlcCcsICdhbnQtZGVzaWduJywgJ3VpdycsICdhcmN0aWNvbnMnXSwgLy8gXHU4RkQ5XHU2NjJGXHU1M0VGXHU5MDA5XHU3Njg0LCBcdTlFRDhcdThCQTRcdTU0MkZcdTc1MjggSWNvbmlmeSBcdTY1MkZcdTYzMDFcdTc2ODRcdTYyNDBcdTY3MDlcdTk2QzZcdTU0MDhbJ21kaSddXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGlhczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHBhcms6ICdpY29uLXBhcmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGR0czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnbG9iczogWycuL3NyYy9jb21wb25lbnRzLyoudnVlJywgJy4vc3JjL2NvbXBvbmVudHMvKi9pbmRleC52dWUnXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgSWNvbnMoe1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vaWNvbmVzLmpzLm9yZy9cbiAgICAgICAgICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21waWxlcjogJ3Z1ZTMnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBWdWVJMThuUGx1Z2luKHtcbiAgICAgICAgICAgICAgICBpbmNsdWRlOiBbcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xvY2FsZXMvKionKV0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgYmFzZTogZW52LlZJVEVfQVBQX0JBU0VfVVJMLFxuICAgICAgICBzZXJ2ZXI6IHtcbiAgICAgICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICAgICAgcG9ydDogZW52LlZJVEVfUE9SVCxcbiAgICAgICAgICAgIG9wZW46IGVudi5WSVRFX09QRU4sXG4gICAgICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgICAgICcvYXBpJzoge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGBodHRwOi8vJHtlbnYuVklURV9BUFBfQVBJX0RPTUFJTn06JHtlbnYuVklURV9BUFBfQVBJX1BPUlR9YCxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgLy8gc291cmNlbWFwOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgICAgICd+Lyc6IGAke3BhdGhTcmN9L2AsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlZmluZSBnbG9iYWwgc2NzcyB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgJ34vYXNzZXRzL3N0eWxlcy92YXIuc2NzcycgYXMgKjtgLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxjQUFjLGVBQWU7QUFDNVgsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxtQkFBbUI7QUFUMUIsSUFBTSxtQ0FBbUM7QUFXekMsUUFBUSxJQUFJLFVBQVU7QUFFdEIsSUFBTSxVQUFVLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBRy9DLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3RDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFDdkMsU0FBTztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ0wsSUFBSTtBQUFBLE1BQ0osWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBO0FBQUEsUUFFUCxTQUFTO0FBQUEsVUFDTDtBQUFBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQTtBQUFBLFVBQ0E7QUFBQTtBQUFBLFFBQ0o7QUFBQTtBQUFBLFFBR0EsU0FBUztBQUFBO0FBQUEsVUFFTDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLE9BQU8sQ0FBQyxFQUFFO0FBQUEsUUFDaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLEtBQUs7QUFBQTtBQUFBO0FBQUEsUUFJTCxhQUFhO0FBQUEsUUFDYixNQUFNLENBQUMsaUJBQWlCLGVBQWU7QUFBQSxRQUN2QyxXQUFXO0FBQUEsVUFDUCxvQkFBb0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDakIsQ0FBQztBQUFBLFFBQ0w7QUFBQTtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1AsV0FBVztBQUFBO0FBQUEsVUFFUCxvQkFBb0I7QUFBQSxZQUNoQixhQUFhO0FBQUEsVUFDakIsQ0FBQztBQUFBO0FBQUE7QUFBQSxVQUdELGNBQWM7QUFBQSxZQUNWLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQU1aLENBQUM7QUFBQSxRQUNMO0FBQUEsUUFDQSxLQUFLO0FBQUEsUUFDTCxPQUFPLENBQUMsMEJBQTBCLDhCQUE4QjtBQUFBLE1BQ3BFLENBQUM7QUFBQSxNQUNELE1BQU07QUFBQTtBQUFBLFFBRUYsYUFBYTtBQUFBLFFBQ2IsVUFBVTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsY0FBYztBQUFBLFFBQ1YsU0FBUyxDQUFDLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0IsQ0FBQztBQUFBLE1BQ3pELENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxNQUFNLElBQUk7QUFBQSxJQUNWLFFBQVE7QUFBQSxNQUNKLE1BQU07QUFBQSxNQUNOLE1BQU0sSUFBSTtBQUFBLE1BQ1YsTUFBTSxJQUFJO0FBQUEsTUFDVixPQUFPO0FBQUEsUUFDSCxRQUFRO0FBQUEsVUFDSixRQUFRLFVBQVUsSUFBSSxtQkFBbUIsSUFBSSxJQUFJLGlCQUFpQjtBQUFBLFVBQ2xFLGNBQWM7QUFBQSxRQUNsQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVQO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDSCxNQUFNLEdBQUcsT0FBTztBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0QscUJBQXFCO0FBQUEsUUFDakIsTUFBTTtBQUFBO0FBQUEsVUFFRixnQkFBZ0I7QUFBQSxRQUNwQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
