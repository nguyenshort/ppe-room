import {createApp} from 'vue'
import './index.css'
import App from './App.vue'
import firebase from "./plugins/firebase";

import { createPinia } from 'pinia'

import Vant from 'vant';
import 'vant/lib/index.css'
import agora from "./plugins/rtc";

const app = createApp(App)
app.use(agora)
app.use(createPinia())
app.use(firebase)
app.use(Vant)

app.mount('#app')

window.$vue = app
