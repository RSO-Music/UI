<template>
    <v-layout column>
        <transition name="fade" mode="out-in">
            <template v-if="selectedProject">
                <v-tabs
                        dark
                        slider-color="#A2E0E0"
                        fixed-tabs
                        color="#1A2432"
                >
                    <v-tab id
                           v-if="userProjectRole.includes('scrum_master') || userProjectRole.includes('product_owner') || userProjectRole.includes('developer')"
                           :key="1" ripple>
                        Pregled
                    </v-tab>
                    <v-tab id v-if="userProjectRole.includes('scrum_master')" :key="2" ripple>
                        Uredi projekt
                    </v-tab>
                    <v-tab id v-if="userProjectRole.includes('scrum_master')" :key="4" ripple>
                        Sprinti
                    </v-tab>
    
                    <v-tab id v-if="userProjectRole.includes('product_owner')" :key="5" ripple>
                        <v-badge v-model="hasUnfinishedSprints" right color="transparent">
                            <template v-slot:badge>
                                <v-icon color="orange" dark small>notifications</v-icon>
                            </template>
                            <span>Zaključi Sprinte</span>
                        </v-badge>
                    </v-tab>
    
                    <v-tab-item id
                                v-if="userProjectRole.includes('scrum_master') || userProjectRole.includes('product_owner') || userProjectRole.includes('developer')"
                                :key="1">
                        <HomeUserProductBacklog :project="selectedProject"></HomeUserProductBacklog>
                    </v-tab-item>
    
                    <v-tab-item id v-if="userProjectRole.includes('scrum_master')" :key="2">
                        <HomeUserProjectEdit @projectEditUpdate="projectEditUpdate"
                                             :selectedProject="selectedProject"/>
                    </v-tab-item>
    
                    <v-tab-item id v-if="userProjectRole.includes('scrum_master')" :key="4">
                        <HomeUserSprint @sprintsUpdated="onSprintsUpdated"/>
                    </v-tab-item>
    
                    <v-tab-item id v-if="userProjectRole.includes('product_owner')" :key="5">
                        <FinishSprints 
                                @fetchedUnfinishedSprints="fetchedUnfinishedSprints"
                        />
                    </v-tab-item>
                </v-tabs>
            </template>
            
            <v-layout v-else class="project-loading-wrapper" column justify-center align-center>
                <v-progress-circular
                        :size="100"
                        color="primary"
                        indeterminate
                ></v-progress-circular>
                
                <h1 class="mt-4">Nalagam projekt ...</h1>
            </v-layout>
        </transition>
    </v-layout>
</template>

<script>
    import HomeUserSprint from "./Project/HomeUserSprint";
    import ProjectForm from "../../../components/Custom/ProjectForm";
    import HomeUserProjectEdit from "./Project/HomeUserProjectEdit";
    import HomeUserProductBacklog from "./Project/HomeUserBacklog";
    import { APICalls } from "../../../utils/apiCalls";
    import FinishSprints from "./Project/FinishSprints";

    export default {
        name: 'homeUserProject',
        components: {
            FinishSprints,
            HomeUserProductBacklog,
            HomeUserProjectEdit,
            ProjectForm,
            HomeUserSprint
        },
        created() {
            this.getSelectedProject();

            this.getCurrentSprint();
        },
        mounted() {
            this.setGetCurrentSprintTimeout();
        },
        destroyed() {
            this.setTimeout = false;

            this.$store.commit('editProject', null);
            this.$store.commit('editCurrentSprint', null);
        },
        data: () => ({
            selectedProject: null,
            userProjectRole: '',
            currentSprint: null,
            setTimeout: true,
            hasUnfinishedSprints: false
        }),
        methods: {
            setGetCurrentSprintTimeout() {
                if (this.setTimeout) {
                    setTimeout(() => {
                        this.getCurrentSprint();

                        this.setGetCurrentSprintTimeout();
                    }, 30000);
                }
            },

            getSelectedProject() {
                APICalls.getProjectId(this.$route.params.projectId).then(
                    (res) => {
                        this.selectedProject = res.data;
                        this.userProjectRole = this.selectedProject.users.find(x => x.user._id === this.$store.getters.currentUser._id).role;

                        this.$store.commit('editProject', res.data);
                    },
                    (error) => {
                        console.log(error);

                        this.$toasted.error('Pri pridobivanju projekta je prišlo do napake', {
                            duration: 3000,
                            position: 'bottom-center'
                        });
                    }
                );
            },

            projectEditUpdate(editProjectObj) {
                const vm = this;

                let objForApi = JSON.parse(JSON.stringify(editProjectObj));
                let usersAssigned = [];
                objForApi.users.forEach(function (userAssigned1) {
                    usersAssigned.push(
                        {
                            user: userAssigned1.user._id,
                            role: userAssigned1.role
                        }
                    );
                });

                objForApi.users = usersAssigned;
                const projectId = objForApi._id;
                delete objForApi['_id'];

                APICalls.updateProject(objForApi, projectId).then(
                    (res) => {
                        this.selectedProject = editProjectObj;

                        this.$store.commit('editProject', editProjectObj);

                        if (!this.selectedProject.users.find(x => x.user._id === this.$store.getters.currentUser._id)) {
                            return this.$router.push({ name: 'dashboard' });
                        } else {
                            this.$forceUpdate();
                            this.userProjectRole = this.selectedProject.users.find(x => x.user._id === this.$store.getters.currentUser._id).role;
                        }

                        vm.$toasted.success('Projekt je bil uspešno posodobljen', {
                            duration: 3000,
                            position: 'bottom-center'
                        });
                    },
                    (error) => {
                        console.log(error);

                        vm.$toasted.error('Pri urejanju projekta je prišlo do napake', {
                            duration: 3000,
                            position: 'bottom-center'
                        });
                    }
                );
            },

            onSprintsUpdated() {
                this.getCurrentSprint();
            },

            fetchedUnfinishedSprints(hasUnfinishedSprints) {
                this.hasUnfinishedSprints = hasUnfinishedSprints;
            },

            getCurrentSprint() {
                APICalls.getActiveSprint(this.$route.params.projectId)
                    .then(
                        (res) => {
                            this.currentSprint = res.data;
                        },
                        (error) => {
                            this.currentSprint = null;
                        }
                    )
                    .finally(() => {
                        this.$store.commit('editCurrentSprint', this.currentSprint);
                    })
            }
        }
    }
</script>

<style scoped>
    .project-loading-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>