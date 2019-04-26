<template>
    <v-container fluid class="wrapper">
        <v-content>
            <v-tabs
                    v-model="active"
                    dark
                    slider-color="#A2E0E0"
                    fixed-tabs
                    color="#1A2432"
            >
                <v-tab :key="1" ripple>
                    Projekti
                </v-tab>
                <v-tab :key="2" ripple>
                    Uporabniki
                </v-tab>

                <v-tab-item :key="1">
                    <HomeAdminProjectManagement/>
                </v-tab-item>

                <v-tab-item :key="2">
                    <HomeAdminUserManagement/>
                </v-tab-item>
            </v-tabs>
        </v-content>
    </v-container>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";
    import HomeAdminProjectManagement from "../Home/Admin/HomeAdminProjectManagement";
    import HomeAdminUserManagement from "../Home/Admin/HomeAdminUserManagement";

    export default {
        name: 'AdminDashboard',
        
        components: {
            HomeAdminUserManagement,
            HomeAdminProjectManagement,
            ButtonBase
        },
        
        data() {
            return {
                active: 0
            }
        }
    }
</script>

<style>
    .list-wrapper {
        display: flex;
    }

    .list {
        flex-basis: 30%;
        background-color: white;
        border-radius: 4px;
        padding: 20px 30px;
    }

    .form-container {
        width: 100%;
        height: fit-content;
    }
</style>
