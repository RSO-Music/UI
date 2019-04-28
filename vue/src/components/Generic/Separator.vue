<template>
    <v-layout row class="v-subheader theme--light">
        <span class="text-uppercase">{{title}}</span>
    </v-layout>
</template>
<script>
    export default {
        name: 'Separator',
        props: {
            title: String
        }
    }
</script>
<style lang="scss" scoped>
    .v-subheader {
        color: #1A616B;
    }
</style>