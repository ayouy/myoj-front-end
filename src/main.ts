import { Language } from "./../node_modules/element-plus/es/locale/index.d";
import { Locals } from "./../node_modules/@types/express-serve-static-core/index.d";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import i18n from "./i18n/i18n";
import "./plugins/axios";
import "@/access/index";
import "bytemd/dist/index.css";

const app = createApp(App);
app.use(ArcoVue).use(store).use(router).use(i18n).mount("#app");
