import Push from "push.js";
import State from "./State";
import { Duration } from 'luxon';

export default {
    name: 'Notifier',
    notify(state) {
        if(state === State.RESTING) {
            Push.create('Time to look away!', {
                body: '',
            });
        } else if (state === State.COUNTING) {
            Push.create("Back to work!", {
                body: '',
                timeout: Duration.fromObject({seconds: 10}).shiftTo('milliseconds'),
            });
        }
    },

    init() {
        Push.Permission.request(()=>{},()=>{});
    }
}
