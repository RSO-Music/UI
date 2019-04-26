<template>
    <v-btn class="main-button" color="primary" :disabled="isDisabled" @click="buttonClicked">{{msg}}</v-btn>
</template>

<script>
    export default {
        name: 'MyButton',
        props: {
            msg: String,
            isDisabled: Boolean

        },
        methods: {
            buttonClicked() {
                this.$emit("clicked");
            }
        }
    }
</script>

<style scoped>
    .main-button {
        margin-top: 20px;
        border-radius: 5px;
    }
</style>