<template>
    <div>
        <v-tabs
                v-model="active"
                dark
                slider-color="#A2E0E0"
                fixed-tabs
                color="#1A2432"
        >
            <v-tab :key="1" ripple >
                Projekti
            </v-tab>
            <v-tab :key="2" ripple >
                Uporabniki
            </v-tab>

            <v-tab-item :key="1">
                <router-view></router-view>
            </v-tab-item>

            <v-tab-item :key="2">
                <router-view ></router-view>
            </v-tab-item>
        </v-tabs>
    </div>

</template>

<script>
    import ProjectForm from "../../../components/Custom/ProjectForm";
    import HomeAdminUserManagement from "./HomeAdminUserManagement";
    import HomeAdminProjectManagement from "./HomeAdminProjectManagement";

    export default {
        name: 'homeAdmin',
        components: {
            HomeAdminProjectManagement,
            HomeAdminUserManagement,
            ProjectForm
        },
        created() {
        },
        watch: {
            active(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal === 0) {
                        this.$router.push({
                            name: 'homeAdminProjectManagement',
                            params: {userId: this.$route.params.userId}
                        });
                    } else if (newVal === 1) {
                        this.$router.push({
                            name: 'homeAdminUserManagement',
                            params: {userId: this.$route.params.userId}
                        });
                    }
                }
            }
        },
        data() {
            return {
                active: null
            }
        },
        methods: {}
    }
</script>

<style scoped>
</style>