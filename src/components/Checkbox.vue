<template>
    <div class="input">
        <input :name="name" type="checkbox" :checked="value === true ? 'checked' : false ">
        <label :for="name">{{ name }}</label>
    </div>
</template>

<script>
    export default {
        name: 'Countdown',
        props: {
            value: Boolean,
            name: String,
        },
        setup(props,{emit}) {
            return { emit }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .input {
        display: flex;
    }

    input[type=checkbox] {
        margin-left: 0;
    }
</style>
