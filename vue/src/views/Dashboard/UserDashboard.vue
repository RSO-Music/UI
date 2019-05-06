<template>
    <v-container fluid>
        <v-content>
            <h1>Pozdravljeni v sistemu Scrummy!</h1>

            <v-card class="ma-2 pa-3 slide-up">
                <v-layout>
                    <v-flex shrink mr-4>
                        <v-layout align-center>
                            <v-icon class="user-avatar grey--text">account_circle</v-icon>
                        </v-layout>
                    </v-flex>
                    
                    <v-flex shrink>
                        <v-layout column>
                            <h1>{{getCurrentUser.firstName}} {{getCurrentUser.lastName}}</h1>

                            <p class="mb-2"><span class="grey--text">Uporabniško ime:</span> {{getCurrentUser.username}}</p>
                            <p class="mb-2"><span class="grey--text">E-mail:</span> {{getCurrentUser.email}}</p>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card>

            <v-layout mt-4>
                <h2 class="section-title">Vaši projekti</h2>
            </v-layout>
            
            <v-layout row class="slide-up">
                <v-flex xs3 v-for="project in projectsForUser" :key="project._id">
                    <v-card class="dashboard-project-card ma-2">
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
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: 'UserDashboard',
        components: {
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
                    (res) => {
                        vm.projectsForUser = res.data;
                    },
                    (error) => {
                        console.log(error);

                        vm.$toasted.error('Pri pridobivanju projektov je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center"
                        });
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
    .user-avatar {
        font-size: 120px;
    }
</style>
