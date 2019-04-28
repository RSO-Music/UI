<template>
    <v-container fluid>
        <v-content>
            <h1>Pozdravljeni v sistemu Scrummy!</h1>

            <v-card class="ma-2 pa-3">
                <v-layout column >
                    <h1>{{getCurrentUser.firstName}} {{getCurrentUser.lastName}}</h1>

                    <p>{{getCurrentUser.username}}</p>
                </v-layout>
            </v-card>

            <v-layout mt-4>
                <h2 class="section-title">Vaši projekti</h2>
            </v-layout>
            
            <v-layout row>
                <v-flex xs3 v-for="project in projectsForUser" :key="project._id">
                    <v-card class="userProjectCard ma-2">
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">{{project.name}}</div>
                            </div>
                        </v-card-title>

                        <v-card-actions>
                            <v-layout justify-end>
                                <ButtonBase msg="Odpri" @clicked="openProject(project)"></ButtonBase>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
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
                        console.log(rs.data);
                        
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
        },
        
        computed: {
            getCurrentUser() {
                return this.$store.getters.currentUser;
            }
        }
    }
</script>

<style scoped>

</style>
