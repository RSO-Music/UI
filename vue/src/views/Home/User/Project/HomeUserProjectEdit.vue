<template>
    <v-layout align-center class="contentWrapper">
        <v-flex class="content-container">
            <ProjectForm
                    :projectId="projectId"
                    :insertedProjectName="projectName"
                    :insertedAssignedUsersToProject="insertedAssignedUsersToProject"
                    :insertedUsers="formUsers"
                    :isNew="isNew"
                    @projectEdit="projectEditUpdate"
            />
        </v-flex>
    </v-layout>
</template>

<script>
    import HomeUserSprint from "./HomeUserSprint";
    import ProjectForm from "../../../../components/Custom/ProjectForm";
    import { APICalls } from "../../../../utils/apiCalls";

    export default {
        name: 'homeUserProjectEdit',
        components: {
            ProjectForm,
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
            isNew: false,
            insertedAssignedUsersToProject: [],
            projectName: '',
            projectId: "",
        }),
        methods: {
            getSelectedProject() {
                this.isNew = false;
                this.insertedAssignedUsersToProject = JSON.parse(JSON.stringify(this.selectedProject.users));
                this.formUsers = JSON.parse(JSON.stringify(this.users));
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