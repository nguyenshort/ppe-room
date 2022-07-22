import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import firebase from "./plugins/firebase";

const app = createApp(App)
app.use(firebase)
app.mount('#app')

window.$vue = app
