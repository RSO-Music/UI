<template>
    <v-btn
            :class="`main-button ${classes ? classes : ''} ${isDisabled ? 'main-button--disabled' : ''}`"
            :disabled="isDisabled ||isLoading"
            @click="buttonClicked"
            color="#3093A0"
            depressed
            :type="type"
            :loading="isLoading"
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
            classes: String,
            isLoading: Boolean
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
        min-width: 15px;
        margin: 0;
        float: right;
        color: #ffffff !important;
    }
    
    .main-button--disabled.theme--dark.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
        color: #ffffff !important;
        background-color: #B0B0B0 !important;
    }
</style>