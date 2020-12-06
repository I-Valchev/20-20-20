<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
  <div class="container">
    <p>Take regular 20-second breaks, every 20 minutes.</p>
    <Countdown :milliseconds=state.milliseconds @completed="this.handleCompleted"  />

    <div>
      <button @click="this.handleStop">{{ state.state === State.STOPPED ? 'Restart' : 'Stop' }}</button>
      <button @click="this.handleSilence">Silence for 1 hour</button>
    </div>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
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
          return Duration.fromObject({seconds: 20}).shiftTo('milliseconds').milliseconds;
        } else if (state.state === State.STOPPED) {
          return 0;
        } else if (state.state === State.SILENCED) {
          return Duration.fromObject({hours: 1}).shiftTo('milliseconds').milliseconds;
        }
      })
    });

    onMounted(() => {
      Notifier.init();
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
      if (state.state !== State.STOPPED) {
        state.state = State.STOPPED;
      } else {
        state.state = State.COUNTING;
      }
    };

    const handleSilence = () => {
      state.state = State.SILENCED;
    };

    return {state, handleCompleted, handleStop, handleSilence, State};
  }
}
</script>

<link href="https://fonts.googleapis.com/css?family=Lato:100,300|PT+Sans:400,700" rel="stylesheet">
<style>

body {
  font-family: "PT Sans", serif;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Loto", sans-serif;
}

h1 {
  font-size: 4rem;
}

.container {
  align-items: center;
  display: flex;
  flex-direction: column;
}

button {
  background-color: #333; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  margin: 1em;
  min-width: 10em;
  text-transform: uppercase;
}

button:hover {
  background-color: #111;
  transition: all 0.2s ease-in-out;
}

</style>
