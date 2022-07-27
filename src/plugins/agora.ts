import type { App } from 'vue'

export const AGORA_CONSTANT = Symbol.for('agora')

const plugin = {
    install(app: App) {

        const client = window.AgoraRTC.createClient({
            codec: 'h264',
            mode: 'rtc'
        })
        app.provide(AGORA_CONSTANT, client)
    }
}

export default plugin
