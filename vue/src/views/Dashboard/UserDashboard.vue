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
                <h2 class="section-title">Trenutni aktivni Sprinti</h2>
            </v-layout>
            
            <v-layout v-if="loaded.activeSprintsForUser" row class="slide-up">
                <template v-if="activeSprintsForUser">
                    <v-flex xs3 v-for="{ project, sprint } in activeSprintsForUser" :key="sprint._id">
                        <v-card class="dashboard-project-card ma-2">
                            <v-card-title primary-title>
                                <div>
                                    <div class="headline">{{sprint.name}}</div>
                                </div>
                            </v-card-title>

                            <v-layout ml-3 column>
                                <small class="grey--text">Trajanje</small>
                                <h2 class="black--text ml-1">
                                    {{sprint.startDate | moment('DD. MM. YYYY')}} -
                                    {{sprint.endDate | moment('DD. MM. YYYY')}}
                                    ({{getRemainingDaysText(sprint)}})
                                </h2>

                                <small class="grey--text">Projekt</small>
                                <h2 class="black--text ml-1">{{project.name}}</h2>
                            </v-layout>

                            <v-card-actions>
                                <v-layout justify-end>
                                    <ButtonBase msg="Odpri projekt" @clicked="openProject(project)"></ButtonBase>
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </template>
                <v-flex v-else>
                    <h2 class="backlog-empty-text text-xs-center grey--text">Trenutno nimate aktivnih Sprintov</h2>
                </v-flex>
            </v-layout>
            <v-layout v-else justify-center>
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
            </v-layout>
            <v-layout mt-4>
                <h2 class="section-title">Vaši projekti</h2>
            </v-layout>
            
            <v-layout v-if="loaded.projectsForUser" row class="slide-up">
                <template v-if="activeSprintsForUser">
                    <v-flex xs3 v-for="project in projectsForUser" :key="project._id">
                        <v-card class="dashboard-project-card ma-2">
                            <v-card-title primary-title>
                                <div>
                                    <div class="headline">{{project.name}}</div>
                                </div>
                            </v-card-title>

                            <v-layout ml-3 column>
                                <small class="grey--text">Vaše vloge</small>
                                <v-flex mb-1>

                                    <p class="ml-1">{{getCurrentUserProjectRole(project)}}</p>
                                </v-flex>

                                <small class="grey--text">Osebe</small>
                                <v-flex>
                                    <v-chip disabled v-for="{ user, role } in project.users" :key="user._id">
                                        <v-avatar class="theme-color white--text">{{user.firstName[0].toUpperCase()}}</v-avatar>
                                        <span class="black--text">{{`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`}}</span>
                                    </v-chip>
                                </v-flex>
                            </v-layout>

                            <v-card-actions>
                                <v-layout justify-end>
                                    <ButtonBase msg="Odpri" @clicked="openProject(project)"></ButtonBase>
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </template>
                <v-flex v-else>
                    <h2 class="backlog-empty-text text-xs-center grey--text">Dodeljeni niste na noben projekt</h2>
                </v-flex>
            </v-layout>
            <v-layout v-else justify-center>
                <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
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
            projectsForUser: null,
            activeSprintsForUser: null,
            loaded: {
                projectsForUser: false,
                activeSprintsForUser: false
            }
        }),
        methods: {
            reloadData() {
                const vm = this;
                
                vm.loaded.projectsForUser = false;
                vm.loaded.activeSprintsForUser = false;

                vm.projectsForUser = null;
                vm.activeSprintsForUser = null;

                APICalls.getProjectsForUser(vm.$store.getters.currentUser._id)
                    .then((res) => {
                        vm.projectsForUser = res.data;
                    })
                    .catch((ex) => {
                        console.log(ex);

                        vm.$toasted.error('Pri pridobivanju projektov je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                    })
                    .finally(() => {
                        vm.loaded.projectsForUser = true;
                    });

                APICalls.getActiveSprintsForUser(vm.$store.getters.currentUser._id)
                    .then((res) => {
                        vm.activeSprintsForUser = res.data;
                    })
                    .catch((ex) => {
                        console.log(ex);

                        vm.$toasted.error('Pri pridobivanju Sprintov je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                    })
                    .finally(() => {
                        vm.loaded.activeSprintsForUser = true;
                    });
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
            },
            
            getCurrentUserProjectRole(project) {
                const vm = this;
                
                const currentUser = vm.$store.getters.currentUser;

                const foundCurrentUser = project.users.find(({ user, role }) => {
                    return user._id === currentUser._id;
                });
                
                return vm.getUserProjectRoles(foundCurrentUser.role);
            },
            
            getUserProjectRoles(userRoles) {
                const vm = this;

                return userRoles.map((currentUserRole) => {
                    return vm.$userProjectRoles.find((role) => role.value === currentUserRole).text;
                }).join(', ');
            },

            getRemainingDaysText(sprint) {
                const vm = this;

                const currentDate = vm.$moment();
                const sprintEndDate = vm.$moment(sprint.endDate);

                const dateDifference = sprintEndDate.diff(currentDate, 'days');

                switch (dateDifference) {
                    case 0:
                        return 'Sprint se konča danes';
                    case 1:
                        return 'še 1 dan';
                    default:
                        return `še ${dateDifference} dni`;
                }
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
