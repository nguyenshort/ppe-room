import {inject} from "vue";
import {AGORA_CONSTANT, ILocalRTC} from "../../plugins/rtc";

export const useRTC = () => {
    return inject<ILocalRTC>(AGORA_CONSTANT)!
}
