import { App, reactive } from 'vue'

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
import { getDatabase } from "firebase/database"

export const FIREBASE_APP_CONSTANT = Symbol.for('firebase')
export const FIREBASE_MESSAGING_CONSTANT = Symbol.for('firebase_messaging')
export const FIRE_RTDB_CONSTANT = Symbol.for('firebase-RTDB')


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDftbjRHhA8Pzl1s1iZIvli0KYDVVgLMfk",
    authDomain: "ppe-room.firebaseapp.com",
    projectId: "ppe-room",
    storageBucket: "ppe-room.appspot.com",
    messagingSenderId: "320164547811",
    appId: "1:320164547811:web:b0a94994ca98777a5089d6"
};


const firebaseApp = initializeApp(firebaseConfig)

const plugin = {
    install(app: App) {
        app.provide(FIREBASE_APP_CONSTANT, reactive(firebaseApp))
        app.provide(FIREBASE_MESSAGING_CONSTANT, reactive(getMessaging(firebaseApp)))
        app.provide(FIRE_RTDB_CONSTANT, reactive(getDatabase(firebaseApp)))
    }
}

export default plugin

