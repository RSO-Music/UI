<template>
    <div class="contentWrapper list-wrapper">
        <v-layout>
            <v-flex xs4 list>
                <h1 class="text-uppercase text-xs-center">Seznam projektov</h1>

                <ButtonBase classes="full-width" msg="Ustvari nov projekt" @clicked="addNewProjectForm"></ButtonBase>

                <ProjectCard :is-admin="true" @editProject="editProject" :insertedProjectList="projectsList"/>
            </v-flex>

            <v-flex xs8 ml-4>
                <ProjectForm :projectId="projectId"
                             :insertedProjectName="projectName"
                             :insertedAssignedUsersToProject="insertedAssignedUsersToProject"
                             :insertedUsers="formUsers"
                             :isNew="isNew"
                             @adminProjectAdd="addNewProject"
                             @projectEdit="projectEditUpdate"
                />
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import ProjectForm from "../../../components/Custom/ProjectForm";
    import ProjectCard from "../../../components/Generic/ProjectCard";
    import { APICalls } from "../../../utils/apiCalls";
    import ButtonBase from "../../../components/Generic/ButtonBase";

    import EventBus from '../../../utils/eventBus';

    export default {
        name: 'homeAdminProjectManagement',
        components: {
            ButtonBase,
            ProjectCard,
            ProjectForm
        },
        created() {
            this.getAllUsers();
            this.getAllProjects();
        },
        mounted() {
            const vm = this;
            
            EventBus.$on('reloadUsersList', function () {
                vm.getAllUsers();
            });    
        },
        data() {
            return {
                users: [],
                formUsers: [],
                projectsList: [],
                isNew: true,
                insertedAssignedUsersToProject: [],
                projectName: '',
                projectId: '',
            }
        },
        methods: {
            addNewProject(objProjectAdd) {
                let vm = this;

                let objForAPI = JSON.parse(JSON.stringify(objProjectAdd));
                //prepare data for API call
                let usersAssigned = [];

                objForAPI.users.forEach(function (userAssigned1) {
                    usersAssigned.push(
                        {
                            user: userAssigned1.user._id,
                            role: userAssigned1.role
                        }
                    );
                });

                objForAPI.users = usersAssigned;

                APICalls.createProject(objForAPI).then(
                    (rs) => {
                        objProjectAdd['_id'] = rs.data._id;
                        this.projectsList.push(objProjectAdd);
                        this.insertedAssignedUsersToProject = [];
                        this.isNew = true;
                        this.projectName = '';
                        this.projectId = '';
                        this.formUsers = JSON.parse(JSON.stringify(this.users));
                        vm.$toasted.success('Projekt je bil uspešno ustvarjen', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    },
                    (error) => {
                        vm.$toasted.error('Pri ustvarjanju projekta je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    }
                );

            },

            getAllUsers() {
                APICalls.getUsersListNoAdmin().then(
                    (rs) => {
                        this.users = rs.data;
                        this.formUsers = JSON.parse(JSON.stringify(this.users));
                    },
                    (error) => {
                    }
                );


            },
            getAllProjects() {
                APICalls.getProjectsList().then(
                    (rs) => {
                        this.projectsList = rs.data;
                    },
                    (error) => {
                    }
                );

            },
            editProject(editProjectObj) {
                this.isNew = false;
                this.insertedAssignedUsersToProject = JSON.parse(JSON.stringify(editProjectObj.users));
                this.formUsers = JSON.parse(JSON.stringify(this.users));
                this.projectName = editProjectObj.name;
                this.projectId = editProjectObj._id;

            },
            projectEditUpdate(editProjectObj) {
                let vm = this;

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
                        const index = this.projectsList.findIndex(x => x._id === editProjectObj._id);

                        this.projectsList.slice(this.projectsList.findIndex(x => x._id === editProjectObj._id), 1);

                        this.projectsList = this.projectsList.filter(function (obj) {
                            return obj._id !== editProjectObj._id;
                        });

                        this.projectsList.splice(index, 0, editProjectObj);

                        vm.$toasted.success('Projekt je bil uspešno posodobljen', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    },
                    (error) => {
                        vm.$toasted.error('Pri posodabljanju projekta je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    }
                );

            },
            addNewProjectForm() {
                //reset all the variables
                this.insertedAssignedUsersToProject = [];
                this.isNew = true;
                this.projectName = '';
                this.projectId = '';
                this.formUsers = JSON.parse(JSON.stringify(this.users));
            }

        }
    }
</script>

<style scoped>

</style>