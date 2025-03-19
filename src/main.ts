import { Language } from "./../node_modules/element-plus/es/locale/index.d";
import { Locals } from "./../node_modules/@types/express-serve-static-core/index.d";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import "@arco-design/web-vue/dist/arco.css";
import "./plugins/axios";
import "@/access/index";
import "bytemd/dist/index.css";

const app = createApp(App);
app.use(ArcoVue).use(ArcoVueIcon).use(store).use(router).mount("#app");
