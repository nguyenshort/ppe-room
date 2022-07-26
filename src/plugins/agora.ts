import type { App } from 'vue'
import agora from 'agora-rtc-sdk-ng'

export const AGORA_CONSTANT = Symbol.for('agora')

const plugin = {
    install(app: App) {

        const client = agora.createClient({
            codec: 'h264',
            mode: 'rtc'
        })
        app.provide(AGORA_CONSTANT, client)
    }
}

export default plugin
