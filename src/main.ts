import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import agora from "./plugins/agora";
import firebase from "./plugins/firebase";

const app = createApp(App)
app.use(firebase)
app.use(agora)
app.mount('#app')

window.$vue = app
