<template>
    <div class="formContainer">
        <v-form
                class="formWrapper"
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <h1>ADD NEW TASK</h1>
            <v-textarea
                    color="#3093A0"
                    prepend-icon="assignment"
                    label="Task description"
                    v-model="taskDescription"
                    :rules="[v => !!v || 'Task description is required']"
                    required
            ></v-textarea>

            <v-text-field
                    id="taskSpeed"
                    color="#3093A0"
                    prepend-icon="timer"
                    label="Expected hours"
                    v-model="taskTime"
                    :rules="[ v => sprintValidation(v) || 'Expected hours are required']"
                    type="number"
                    required
            ></v-text-field>

            <!--<div id="formTop">-->
                <!--<v-card flat v-for="assignedUser of assignedUsersToProject">-->
                    <!--<div id="assignedUsers">-->
                        <!--<div id="usersUser">-->
                            <!--<v-card-title primary-title>-->
                                <!--<div>{{assignedUser.user.username}}</div>-->
                            <!--</v-card-title>-->
                        <!--</div>-->
                        <!--<div id="usersRole">-->
                            <!--<v-select-->
                                    <!--color="#3093A0"-->
                                    <!--prepend-icon="label"-->
                                    <!--v-model="assignedUser.role"-->
                                    <!--:items="possibleRoles"-->
                                    <!--:rules="[v => !!v || 'Role selection is required']"-->
                                    <!--label="Role"-->
                                    <!--hide-details-->
                                    <!--required-->
                                    <!--flat-->
                            <!--&gt;</v-select>-->
                        <!--</div>-->
                        <!--<div id="usersDelete">-->
                            <!--<ButtonOutline msg="X" @clicked="removeUserFromTask(assignedUser.user._id)"></ButtonOutline>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</v-card>-->
            <!--</div>-->
            <!--<div id="formBottom">-->
                <!--<h4>Add new user</h4>-->
                <!--<div id="userSearch">-->
                    <!--<v-autocomplete-->
                            <!--color="#3093A0"-->
                            <!--prepend-icon="supervised_user_circle"-->
                            <!--v-model=selectedUser-->
                            <!--:items="users"-->
                            <!--:filter="customFilter"-->
                            <!--item-text="username"-->
                            <!--item-value="_id"-->
                            <!--label="User"-->
                            <!--@keyup.enter.native="addUserToTask"-->
                    <!--&gt;</v-autocomplete>-->
                    <!--<ButtonOutline msg="Add user" @clicked="addUserToTask"></ButtonOutline>-->
                <!--</div>-->
            <!--</div>-->
            <ButtonBase :disabled="!valid" msg="Add new task" @clicked="addTask"></ButtonBase>
        </v-form>
    </div>
</template>

<script>
    import ButtonOutline from "../Generic/ButtonOutline";
    import ButtonBase from "../Generic/ButtonBase";
    export default {
        name: "UserTaskForm",
        components: {ButtonBase,ButtonOutline},
        props: {
            formName: String,
            // isNewProject: Boolean,
            insertedUsers: Array,
            insertedAssignedUsersToProject: Array
            // projectId: String,
            // insertedProjectName: String
        },
        // created(){
        //     this.users = this.insertedUsers;
        //     this.originalUsers = JSON.parse(JSON.stringify(this.users));
        //     this.assignedUsersToProject = this.insertedAssignedUsersToProject;
        //     if (this.users) {
        //         this.assignedUsersToProject.forEach((assignedUser) => {
        //             this.users.splice(this.users.findIndex(user => user._id === assignedUser.user._id) , 1);
        //         })
        //     }
        //
        // },
        data: () => ({
            valid: true,
            storyName: '',
            taskDescription: '',
            taskTime: null,
            selectedUser: null,
            assignedUsersToProject: [],
            users: [],
            originalUsers: []
        }),
        methods: {

            addTask () {
                if (this.$refs.form.validate()) {
                    this.$emit('addUserTask', {
                        description: this.taskDescription,
                        time: this.taskTime,
                        done: false
                    });
                    this.resetForm();
                } else {
                    this.valid = false;
                }
             },

            sprintValidation(val) {
                if (!val)
                    return false;
                return !(val < 1 || val > 100 || val.length < 1);
            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            },
            // addUserToTask() {
            //     if (!this.selectedUser) {
            //         return;
            //     }
            //     this.assignedUsersToProject.push(
            //         {
            //             user: this.users.find(user => user._id === this.selectedUser),
            //             role: 'Developer' // assigne default user project role
            //         }
            //
            //     );
            //     this.users.splice(this.users.findIndex(user => user._id === this.selectedUser) , 1);
            //     this.selectedUser = null;
            // },
            // removeUserFromProject(userId) {
            //     this.users.push(
            //         this.assignedUsersToProject.find(user => user.user._id === userId).user
            //     );
            //     this.assignedUsersToProject.splice(this.assignedUsersToProject.findIndex(user => user.user._id === userId) , 1);
            // }
        }
    }
</script>

<style scoped>
    #storyWrapper {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    }

    #storyDropdowns {
        flex-basis: 40%;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #storyDropdowns:last-child {
        align-self: flex-end;
    }

    #storyDesc {
        padding: 10px;
    }
</style>