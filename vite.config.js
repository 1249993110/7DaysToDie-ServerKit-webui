import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueDevTools from 'vite-plugin-vue-devtools';

process.env.BROWSER = 'chrome';

const pathSrc = path.resolve(__dirname, './src');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue(),
            vueDevTools(),
            AutoImport({
                // targets to transform
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],

                // global imports to register
                imports: [
                    // presets
                    'vue',
                    'vue-router',
                    'pinia',
                    '@vueuse/core',
                    'vue-i18n',
                ],

                // Filepath to generate corresponding .d.ts file.
                // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
                // Set `false` to disable.
                dts: true,

                // Auto import inside Vue template
                // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
                vueTemplate: false,
                dirs: ['./src/utils/*'],
                resolvers: [ElementPlusResolver()], // 自动导入element API
            }),
            Components({
                resolvers: [
                    // Auto register Element Plus components
                    // 自动导入 Element Plus 组件与样式
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                    // Auto register icon components
                    // 自动注册图标组件
                    IconsResolver({
                        prefix: 'icon', // 自动引入的Icon组件统一前缀, 默认为 i, 设置false为不需要前缀
                        // {prefix}-{collection}-{icon} 使用组件解析器时, 您必须遵循名称转换才能正确推断图标
                        // enabledCollections: ['mdi', 'ep', 'ant-design', 'uiw', 'arcticons'], // 这是可选的, 默认启用 Iconify 支持的所有集合['mdi']
                        // alias: {
                        //     park: 'icon-park',
                        // }
                    }),
                ],
                dts: true,
                globs: ['./src/components/*.vue', './src/components/*/index.vue'],
            }),
            Icons({
                autoInstall: true,
                compiler: 'vue3',
            }),
        ],
        base: env.VITE_APP_BASE_URL,
        server: {
            host: 'localhost',
            port: 9527,
            open: true,
            proxy: {
                '/api': {
                    target: `http://${env.VITE_APP_API_DOMAIN}:8888`,
                    changeOrigin: true,
                },
            },
        },
        build: {
            // sourcemap: true,
        },
        resolve: {
            alias: {
                '~/': `${pathSrc}/`,
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // define global scss variable
                    additionalData: `@use '~/assets/styles/var.scss' as *;`,
                },
            },
        },
    };
});
