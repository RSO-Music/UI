<template>
    <div class="contentWrapper">
        <div class="formContainer">
            <MyAlert class="smaller" :msg="msg" :isSuccess="isSuccess" @closeAlert="closeAlert"/>
            <ProjectForm
                    :projectId="projectId"
                    :insertedProjectName="projectName"
                    :insertedAssignedUsersToProject="insertedAssignedUsersToProject"
                    :insertedUsers="formUsers" :isNewProject="isNewProject"
                    :formName="formName"
                    @projectEdit="projectEditUpdate"
            />
        </div>
    </div>
</template>

<script>
    import HomeUserSprint from "./HomeUserSprint";
    import MyAlert from "../../../../components/Generic/AlertBox";
    import ProjectForm from "../../../../components/Custom/ProjectForm";
    import {APICalls} from "../../../../utils/apiCalls";

    export default {
        name: 'homeUserProjectEdit',
        components: {
            ProjectForm,
            MyAlert,
            HomeUserSprint,
        },
        created() {
            this.getAllUsers();
        },
        props: {
            selectedProject: Object,
            isSuccess: Number,
            msg: String
        },
        data: () => ({
            users: [],
            formUsers: [],
            isNewProject: false,
            insertedAssignedUsersToProject: [],
            formName: '',
            projectName: '',
            projectId: "",
        }),
        methods: {
            getSelectedProject() {
                this.isNewProject = false;
                this.insertedAssignedUsersToProject = JSON.parse(JSON.stringify(this.selectedProject.users));
                this.formUsers = JSON.parse(JSON.stringify(this.users));
                this.formName = 'Uredi projekt';
                this.projectName = this.selectedProject.name;
                this.projectId = this.selectedProject._id;
            },

            closeAlert() {
            },

            projectEditUpdate(editProjectObj) {
                this.$emit('projectEditUpdate', editProjectObj);
            },

            getAllUsers() {
                APICalls.getUsersListNoAdmin().then(
                    (rs) => {
                        this.users = rs.data;
                        this.formUsers = this.users;
                        this.getSelectedProject()
                    },
                    (error) => {
                    }
                );
            },

        }
    }
</script>