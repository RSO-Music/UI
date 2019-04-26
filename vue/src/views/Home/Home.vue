<template>
    <v-container fluid class="wrapper">
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-container>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";
    import NavBar from "../../components/Generic/NavBar";

    export default {
        name: 'home',
        components: {
            ButtonBase,
            NavBar
        }
    }
</script>

<style scoped>

</style>
