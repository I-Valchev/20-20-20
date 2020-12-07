export default {
    SOUND: 1,
    NOTIFICATION: 2,
    active: [],
    set(setting) {
        if (! this.active.indexOf(setting) >= 0) {
            this.active.push(setting);
        }
    },
    unset(setting) {
        if (this.active.indexOf(setting) >= 0) {
            this.active.splice(this.active.indexOf(setting), 1);
        }
    },
    isSet(setting) {
        return this.active.indexOf(setting) >= 0;
    },
    flip(setting) {
        if (this.isSet(setting)) {
            this.unset(setting);
        } else {
            this.set(setting);
        }
    }
}
