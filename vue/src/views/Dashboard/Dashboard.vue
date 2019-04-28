<template>
    <div>
        <AdminDashboard v-if="$store.getters.currentUser.isAdmin"/>

        <UserDashboard v-else/>
    </div>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";
    import AdminDashboard from "./AdminDashboard";
    import UserDashboard from "./UserDashboard";

    export default {
        name: 'Dashboard',
        components: {
            UserDashboard,
            AdminDashboard,
            ButtonBase
        }
    }
</script>

<style>
    .wrapper {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>
