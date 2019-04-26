<template>
    <v-btn
            :class="`main-button ${classes}`"
            :disabled="isDisabled"
            @click="buttonClicked"
            color="#3093A0"
            depressed
            dark
            :type="type"
    >
        {{msg}}
    </v-btn>
</template>

<script>
    export default {
        name: "ButtonBase",
        props: {
            msg: String,
            isDisabled: Boolean,
            type: String,
            classes: String
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
        padding: 0 20px;
        font-weight: bold;
        width: fit-content;
        min-width: 15px;
        float: right;
        margin: 0;
    }
</style>