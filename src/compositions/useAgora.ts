import {inject} from "vue";
import {AGORA_CONSTANT} from "../plugins/agora";
import {IAgoraRTCClient} from "agora-rtc-sdk-ng";

export const useAgora = (): IAgoraRTCClient => {
    return inject(AGORA_CONSTANT)!
}
