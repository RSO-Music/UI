<template>
    <v-btn
            class="main-button"
            :disabled="isDisabled"
            @click="buttonClicked"
            outline
            color="#3093A0"
            depressed
    >
        {{msg}}
    </v-btn>
</template>

<script>
    export default {
        name: "ButtonOutline",
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
        margin: 0;
        padding: 0 10px;
        min-width: 10px;
    }
</style>