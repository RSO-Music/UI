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
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');

    html, body {
        font-family: 'Open Sans', sans-serif;
    }

    #app {
        font-family: 'Open Sans', sans-serif;
    }

    p, h1, h2, h3, h4, h5 {
        margin: 0;
        padding: 0;
        font-weight: normal;
    }

    p {
        font-size: 14px;
        color: #161719;
    }

    h1 {
        font-size: 30px;
        color: #1A616B;
        padding-bottom: 40px;
        text-transform: uppercase;
    }

    h2 {
        font-size: 20px;
        color: #969DAA;
    }

    h3 {
        font-size: 14px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.5);
        padding-top: 20px;
        padding-bottom: 10px;
    }

    h4 {
        font-size: 12px;
        color: #969DAA;
        text-transform: capitalize;
    }

    h5 {
        font-size: 18px;
        color: #161719;
        text-transform: uppercase;
    }

    .contentWrapper {
        padding: 30px;
        height: 100%;
    }

    .inputField {
        padding-bottom: 5px;
    }

    .formContainer {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .form-wrapper {
        background-color: white;
        border-radius: 4px;
        border-top: 5px solid #A2E0E0;
        width: 95%;
        padding: 20px 30px;
    }

    .form-wrapper > h1 {
        text-align: center;
        text-transform: capitalize;
    }

    .smaller {
        width: 60%;
        margin: 0 auto;
    }
    
    .full-width {
        width: 100% !important;
    }
</style>
