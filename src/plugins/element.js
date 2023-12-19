import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

export default (app) => {
    app.use(ElementPlus, { locale: zhCn });
};
