<template>
    <v-btn
            :class="`main-button ${classes ? classes : ''} ${isDisabled ? 'main-button--disabled' : ''}`"
            :disabled="isDisabled"
            @click="buttonClicked"
            outline
            color="#3093A0"
            depressed
    >
        <v-icon v-if="icon">
            {{icon}}
        </v-icon>
        <span v-else>
            {{msg}}
        </span>
    </v-btn>
</template>

<script>
    export default {
        name: "ButtonOutline",
        props: {
            msg: String,
            icon: String,
            isDisabled: Boolean,
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
        margin: 0;
        padding: 0 10px;
        min-width: 10px;
    }
</style>