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
            buttonClicked: function () {
                this.$emit("clicked");
            }
        }
    }
</script>

<style scoped>
    .main-button {
        margin: 0;
        padding: 0 10px;
        border-width: 2px;
        font-weight: bold;
        width: fit-content;
        min-width: 10px;
    }
</style>