<template>
    <v-container fluid class="wrapper">
        <v-content>
            <h1>Pozdravljeni</h1>

            <v-layout>
                <v-flex xs6>
                    <ProjectCard @goInsideProject="openProject" :insertedProjectList="projectsForUser"/>
                </v-flex>
                <v-flex xs6>

                </v-flex>
            </v-layout>
        </v-content>
    </v-container>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";
    import ProjectCard from "../../components/Generic/ProjectCard";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: 'UserDashboard',
        components: {
            ProjectCard,
            ButtonBase
        },
        created() {
            this.reloadData();
        },
        data: () => ({
            active: null,
            projectsForUser: []
        }),
        methods: {
            reloadData() {
                const vm = this;

                APICalls.getProjectBasedOnUserId(vm.$store.getters.currentUser._id).then(
                    (rs) => {
                        vm.projectsForUser = rs.data;
                    },
                    (error) => {
                        console.log('An error occured while fetching projects');
                    }
                );
            },

            openProject(project) {
                this.$router.push(
                    {
                        name: 'projectPage',
                        params: {
                            projectId: project._id
                        }
                    }
                );
            }
        }
    }
</script>

<style scoped>

</style>
