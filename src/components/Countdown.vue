<template>
    <div>
        <h1>{{ state.formattedTime }}</h1>
    </div>
</template>

<script>
    import { reactive, computed, onMounted, watch } from 'vue'
    import { Duration } from 'luxon';

    export default {
        name: 'Countdown',
        props: {
            milliseconds: Number,
        },
        setup(props, { emit }) {
            const step = 1000; // 1 second

            const state = reactive({
                milliseconds: props.milliseconds,
                formattedTime: computed(() =>  {
                    const duration = Duration.fromMillis(state.milliseconds).shiftTo('minutes', 'seconds');
                    return duration.minutes + ":" + duration.seconds;
                })
            });

            onMounted(() => {
                start();
            });

            watch(() => props.milliseconds, (after) => {
                state.milliseconds = after;
                restart();
            });

            const restart = () => {
                stop();
                start();
            };

            const start = () => {
                state.interval = window.setInterval(() => {
                    state.milliseconds -= step;
                    if (state.milliseconds <= 0) {
                        complete();
                    }
                }, step);
            };

            const stop = () => {
                clearInterval(state.interval);
            };

            const complete = () => {
                stop();
                emit('completed');
            };

            return { state }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
