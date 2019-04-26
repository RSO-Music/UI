<template>
    <v-btn
            class="main-button"
            :disabled="isDisabled"
            @click="buttonClicked"
            color="#3093A0"
            depressed
            dark
    >
        {{msg}}
    </v-btn>
</template>

<script>
    export default {
        name: "ButtonBase",
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
        padding: 0 20px;
        font-weight: bold;
        width: fit-content;
        min-width: 15px;
        float: right;
        margin: 0;
    }
</style>