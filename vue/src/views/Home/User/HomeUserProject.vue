<template>
    <div>
        <v-tabs :key="active"
                v-model="active"
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

            <v-tab-item id
                        v-if="userProjectRole.includes('scrum_master') || userProjectRole.includes('product_owner') || userProjectRole.includes('developer')"
                        :key="1">
                <ProjectInfoPanel :selectedProject="selectedProject" :currentSprint="currentSprint"
                                  :userProjectRole="userProjectRole"></ProjectInfoPanel>
                <HomeUserProductBacklog></HomeUserProductBacklog>
            </v-tab-item>
            <v-tab-item id v-if="userProjectRole.includes('scrum_master')" :key="2">
                <ProjectInfoPanel :selectedProject="selectedProject" :currentSprint="currentSprint"
                                  :userProjectRole="userProjectRole"></ProjectInfoPanel>
                <HomeUserProjectEdit :isSuccess="isSuccess" :msg="msg" @projectEditUpdate="projectEditUpdate"
                                     :selectedProject="selectedProject"/>
            </v-tab-item>
            <v-tab-item id v-if="userProjectRole.includes('scrum_master')" :key="4">
                <ProjectInfoPanel :selectedProject="selectedProject" :currentSprint="currentSprint"
                                  :userProjectRole="userProjectRole"></ProjectInfoPanel>
                <HomeUserSprint/>
            </v-tab-item>

        </v-tabs>
    </div>
</template>

<script>
    import HomeUserSprint from "./Project/HomeUserSprint";
    import ProjectForm from "../../../components/Custom/ProjectForm";
    import HomeUserProjectEdit from "./Project/HomeUserProjectEdit";
    import HomeUserProductBacklog from "./Project/HomeUserBacklog";
    import { APICalls } from "../../../utils/apiCalls";
    import ProjectInfoPanel from "../../../components/Custom/ProjectInfoPanel";

    export default {
        name: 'homeUserProject',
        components: {
            ProjectInfoPanel,
            HomeUserProductBacklog,
            HomeUserProjectEdit,
            ProjectForm,
            HomeUserSprint
        },
        created() {
            this.getSelectedProject();
            this.getCurrentSprint();
        },
        watch: {
            active(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (this.userProjectRole.includes('scrum_master')) {
                        if (this.active === 0) {
                            this.$router.push({
                                name: 'homeUserProductBackLog',
                                params: { projectId: this.$route.params.projectId }
                            });
                        } else if (this.active === 1) {
                            this.$router.push({
                                name: 'homeUserProjectEdit',
                                params: { projectId: this.$route.params.projectId }
                            });
                        } else if (this.active === 2) {
                            this.$router.push({
                                name: 'homeUserSprintManagemnet',
                                params: { projectId: this.$route.params.projectId }
                            });
                        }
                    } else if (this.userProjectRole.includes('product_owner')) {
                        if (this.active === 0) {
                            this.$router.push({
                                name: 'homeUserProductBackLog',
                                params: { projectId: this.$route.params.projectId }
                            });
                        }
                    } else if (this.userProjectRole.includes('developer')) {
                        this.$router.push({
                            name: 'homeUserProductBackLog',
                            params: { projectId: this.$route.params.projectId }
                        });
                    }
                }
            }
        },
        data: () => ({
            active: 0,
            selectedProject: {},
            userProjectRole: '',
            isSuccess: 0,
            msg: '',
            currentSprint: {},
            endDate: '',
            startDate: ''
        }),
        methods: {
            getSelectedProject() {
                APICalls.getProjectId(this.$route.params.projectId).then(
                    (rs) => {
                        this.selectedProject = rs.data;
                        this.userProjectRole = this.selectedProject.users.find(x => x.user._id === this.$store.getters.currentUser._id).role;

                        this.$store.commit('editProject', rs.data);
                    },
                    (error) => {
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
                    (rs) => {
                        this.selectedProject = editProjectObj;

                        this.$store.commit('editProject', editProjectObj);

                        if (!this.selectedProject.users.find(x => x.user._id === this.$store.getters.currentUser._id)) {
                            return this.$router.push({ name: 'userMain' });
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
            getCurrentSprint() {
                APICalls.getActiveSprint(this.$route.params.projectId).then(
                    (rs) => {
                        this.currentSprint = rs.data;
                    },
                    (error) => {
                        this.currentSprint = null;
                    }
                );
            },
            closeAlert() {
                this.isSuccess = 0;
            },
        }
    }
</script>

<style scoped>
</style>