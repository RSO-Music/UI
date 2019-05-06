<template>
    <v-app>
        <v-content v-if="!isLoggedIn || isNotAllowed">
            <login v-if="!isLoggedIn"></login>
            <not-allowed v-else-if="isNotAllowed"></not-allowed>
        </v-content>

        <v-content v-else>
            <NavBar/>

            <router-view/>
        </v-content>
    </v-app>
</template>

<script>
    import Login from './views/Login.vue';
    import NotAllowed from './views/NotAllowed.vue';
    import NavBar from './components/Generic/NavBar';

    export default {
        name: 'App',
        components: { Login, NotAllowed, NavBar },
        computed: {
            isLoggedIn() {
                return this.$store.getters.currentUser.loggedIn;
            },

            isNotAllowed() {
                return !this.$store.getters.isAllowedRoute;
            }
        }
    }
</script>

<style>
    @import './assets/css/main.scss';
    @import './assets/css/animations.scss';
</style>
