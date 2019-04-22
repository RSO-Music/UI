<template>
    <div class="contentWrapper adminProjects">
        <div class="adminProjectList">
            <h1>Seznam projektov</h1>
            <ButtonBase id="adminAddProject" msg="Dodaj projekt" @clicked="addNewProjectForm"></ButtonBase>
            <ProjectCard :is-admin="true" @editProject="editProject" :insertedProjectList="projectsList"/>
        </div>
        <div class="adminFormContainer">
            <MyAlert class="smaller" :msg="msg" :isSuccess="isSuccess" @closeAlert="closeAlert"/>
            <ProjectForm :projectId="projectId"
                         :insertedProjectName="projectName"
                         :insertedAssignedUsersToProject="insertedAssignedUsersToProject"
                         :insertedUsers="formUsers" :isNewProject="isNewProject"
                         :formName="formName"
                         @adminProjectAdd="addNewProject"
                         @projectEdit="projectEditUpdate"
            />
        </div>
    </div>
</template>

<script>
    import ProjectForm from "../../../components/Custom/ProjectForm";
    import MyAlert from "../../../components/Generic/AlertBox";
    import ProjectCard from "../../../components/Generic/ProjectCard";
    import {APICalls} from "../../../utils/apiCalls";
    import ButtonBase from "../../../components/Generic/ButtonBase";

    export default {
        name: 'homeAdminProjectManagement',
        components: {
            ButtonBase,
            ProjectCard,
            MyAlert,
            ProjectForm
        },
        created: function () {
            this.getAllUsers();
            this.getAllProjects();
        },
        data() {
            return {
                isSuccess: 0, // 0 -> nothing has happened(neutral), 1 -> success addgin, 2-> error adding
                users: [],
                formUsers: [],
                projectsList: [],
                isNewProject: true,
                insertedAssignedUsersToProject: [],
                formName: 'DODAJ PROJEKT',
                projectName: '',
                projectId: '',
                msg: ''
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

                APICalls.addNewProject(objForAPI).then(
                    (rs) => {
                        objProjectAdd['_id'] = rs.data._id;
                        this.projectsList.push(objProjectAdd);
                        this.insertedAssignedUsersToProject = [];
                        this.isNewProject = true;
                        this.formName = 'DODAJ PROJEKT';
                        this.projectName = '';
                        this.projectId = '';
                        this.formUsers = JSON.parse(JSON.stringify(this.users));
                        this.isSuccess = 1;
                    },
                    (error) => {
                        this.isSuccess = 2;
                        this.msg = 'Projekt z vpisanim imenom že obstaja'
                    }
                );

            },
            closeAlert() {
                this.isSuccess = 0;
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
                this.isNewProject = false;
                this.insertedAssignedUsersToProject = JSON.parse(JSON.stringify(editProjectObj.users));
                this.formUsers = JSON.parse(JSON.stringify(this.users));
                this.formName = 'UREJANJE PROJEKTA';
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
                        this.isSuccess = 1;
                        this.msg = 'Projekt je bil uspešno posodobljen'
                    },
                    (error) => {
                        this.isSuccess = 2;
                        this.msg = 'Projekt z vpisanim imenom že obstaja'
                    }
                );

            },
            addNewProjectForm() {
                //reset all the variables
                this.insertedAssignedUsersToProject = [];
                this.isNewProject = true;
                this.formName = 'DODAJ PROJEKT';
                this.projectName = '';
                this.projectId = '';
                this.formUsers = JSON.parse(JSON.stringify(this.users));
            }

        }
    }
</script>

<style scoped>
    .adminProjects {
        display: flex;
    }

    .adminProjectList {
        flex-basis: 30%;
        background-color: white;
        border-radius: 4px;
        padding: 20px 30px;
    }

    .adminProjectList h1 {
        text-align: center;

    }

    .adminFormContainer {
        width: 100%;
        height: fit-content;
    }

    #adminAddProject {
        width: 100%;
    }
</style>