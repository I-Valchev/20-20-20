import Push from "push.js";
import State from "./State";
import { Duration } from 'luxon';

export default {
    name: 'Notifier',
    notify(state, settings) {
        if (settings.isSet(settings.NOTIFICATION)) {
            this.sendNotification(state);
        }
        if(settings.isSet(settings.SOUND)) {
            this.playSound();
        }
    },
    sendNotification(state) {
        if(state === State.RESTING) {
            Push.create('Time to look away!', {
                body: '',
                silent: false,
            });
        } else if (state === State.COUNTING) {
            Push.create("Back to work!", {
                body: '',
                silent: false,
                timeout: Duration.fromObject({seconds: 10}).shiftTo('milliseconds'),
            });
        }
    },
    playSound(){
        let sound = document.getElementById('sound');

        if(! sound) {
            sound = document.createElement('audio');
            sound.src = "https://freesound.org/data/previews/320/320655_5260872-lq.mp3";
            sound.setAttribute('id', 'sound');
            sound.setAttribute("preload", "auto");
            sound.setAttribute("controls", "none");
            sound.style.display = "none";
            document.body.appendChild(sound);
        }

        sound.play();
    },

init() {
        Push.Permission.request(()=>{},()=>{});
    }
}
