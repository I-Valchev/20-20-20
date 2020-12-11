<template>
  <div class="container">
    <p>Take regular 20-second breaks, every 20 minutes.</p>
    <Countdown :key="state.key" :milliseconds=state.milliseconds @completed="this.handleCompleted" @counted="this.handleCounted"  />

    <div>
      <button @click="this.handleStop">{{ state.state === State.STOPPED ? 'Restart' : 'Stop' }}</button>
      <button @click="this.handleSilence" class="secondary">Silence for 1 hour</button>
      <div style="margin-left: 1rem;">
        <Checkbox
                :value=state.settings.isSet(state.settings.SOUND)
                name="Sound notifications"
                @change=state.settings.flip(state.settings.SOUND)
        ></Checkbox>

        <Checkbox
                :value=state.settings.isSet(state.settings.NOTIFICATION)
                name="Pop-up notifications"
                @change=state.settings.flip(state.settings.NOTIFICATION)
        ></Checkbox>
      </div>
    </div>

  </div>

  <div id="content">
    <div>
      <h2>Why?</h2>
      <p>Humans normally blink about 15 times in one minute. However, studies show that we only blink about 5 to 7
        times in a minute while using computers and other digital screen devices.
        Blinking is the eye’s way of getting the moisture it needs on its surface.
      </p>

      <p>
        Take regular breaks using the “20-20-20” rule: every 20 minutes, shift your eyes to look at an
        object at least 20 feet (≈ 6 metres) away, for at least 20 seconds.
        This rule is recommended by the American Academy of Ophthalmology, the UK National Health Service,
        the Canadian Association of Optometrists and many other health institutions.
      </p>
    </div>

    <div>
      <h2>How it works?</h2>
      <p>
        This app reminds you to take regular 20-second breaks, every 20 minutes. To do so, it sends you
        notifications every time you need to take a pause, and a reminder to get back to work once
        the 20 seconds elapse.
      </p>

      <p>
        To do so, you need to allow the app to send you notifications. You can check your notifications settings
        for <a href="https://support.google.com/chrome/answer/3220216" target="_blank">Google Chrome here</a>,
        or for
        <a href="https://support.mozilla.org/en-US/kb/push-notifications-firefox" target="_blank">Mozilla Firefox here</a>.
      </p>

    </div>
  </div>
  <p>Built by <a href="https://ivovalchev.com">Ivo Valchev</a>, under <a href="https://github.com/I-Valchev/20-20-20">
    Open Source</a> MIT license.
  </p>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import Countdown from './components/Countdown'
import Checkbox from './components/Checkbox'
import Notifier from './helpers/Notifier';
import State from './helpers/State';
import Settings from './helpers/Settings';
import { Duration } from 'luxon';

export default {
  name: 'App',
  components: {
    Countdown,
    Checkbox,
  },
  setup() {
    Settings.set(Settings.NOTIFICATION);

    const state = reactive({
      state: State.COUNTING,
      settings: Settings,
      key: '',
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

      Notifier.notify(state.state, state.settings);
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
      resetCounter();
    };

    const handleCounted = (formattedTime) => {
      updateTitle(formattedTime)
    };

    const updateTitle = (formattedTime) => {
      document.title = formattedTime + " | " + document.title.split(' | ')[1];
    };

    const resetCounter = () => {
      // This way we can reset the counter.
      // Used for clicking Silence for 1 hour.
      state.key = Math.random();
    };

    return {state, handleCompleted, handleStop, handleSilence, handleCounted, State};
  }
}
</script>

<link href="https://fonts.googleapis.com/css?family=Lato:100,300|PT+Sans:400,700" rel="stylesheet">
<style>

:root {
  --main-color: white;
  --accent-color: #333;

}

@media (prefers-color-scheme: dark){
  :root {
    --main-color: #333;
    --accent-color: white;
  }
}

body {
  font-family: "PT Sans", serif;
  color: var(--accent-color);
  background-color: var(--main-color);
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
  min-height: 80vh;
  justify-content: center;
}

button {
  background-color: var(--accent-color);
  color: var(--main-color);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  margin: 1em;
  min-width: 10em;
  text-transform: uppercase;
  border: 2px solid var(--accent-color);
}

button.secondary {
  background-color: var(--main-color);
  color: var(--accent-color);
}

button:hover {
  background-color: var(--accent-color);
  transition: all 0.2s ease-in-out;
}

button.secondary:hover {
  color: var(--main-color);
}

@media screen and (min-width: 768px) {
  body {
    margin: 1rem 10rem;
  }
}

#content {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px , 1fr));
}
</style>
