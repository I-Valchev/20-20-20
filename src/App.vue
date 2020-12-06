<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <Countdown v-if="state.state !== State.STOPPED" :milliseconds=state.milliseconds @completed="this.handleCompleted"  />
  <button @click="this.handleStop">Stop</button>
</template>

<script>
import { reactive, computed } from 'vue'
import Countdown from './components/Countdown'
import Notifier from './helpers/Notifier';
import State from './helpers/State';
import { Duration } from 'luxon';

export default {
  name: 'App',
  components: {
    Countdown,
  },
  setup() {

    const state = reactive({
      state: State.COUNTING,
      milliseconds: computed(() => {
        if(state.state === State.COUNTING) {
          return Duration.fromObject({minutes: 20}).shiftTo('milliseconds').milliseconds;
        } else if (state.state === State.RESTING) {
          return Duration.fromObject({seconds:  15}).shiftTo('milliseconds').milliseconds;
        }
      })
    });

    const handleCompleted = () => {
      if (state.state === State.STOPPED) {
        return;
      }

      if (state.state === State.COUNTING) {
        state.state = State.RESTING;
      } else {
        state.state = State.COUNTING;
      }

      Notifier.notify(state.state);
    };

    const handleStop = () => {
      state.state = State.STOPPED;
    };

    return {state, handleCompleted, handleStop, State};
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
