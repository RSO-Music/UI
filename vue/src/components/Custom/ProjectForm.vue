<template>
    <div class="formContainer">
        <v-form
                class="formWrapper"
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <h1>{{formName}}</h1>
            <v-text-field
                    color="#3093A0"
                    prepend-icon="rate_review"
                    label="Ime projekta"
                    :rules="[v => !!v || 'Project Name required']"
                    v-model="projectName"
                    required
            ></v-text-field>
            <h4>Projektni sodelavci</h4>
            <div id="formTop">
                <v-card flat v-for="assignedUser in assignedUsersToProject" :key="assignedUser._id">
                    <div id="assignedUsers">
                        <div id="usersUser">
                            <v-card-title primary-title>
                                <div>{{assignedUser.user.username}}</div>
                            </v-card-title>
                        </div>
                        <div id="usersRole">
                            <v-select
                                    color="#3093A0"
                                    prepend-icon="label"
                                    v-model="assignedUser.role"
                                    :items="possibleRoles"
                                    :rules="[v => !!v || 'Role selection is required']"
                                    label="Uporabniška vloga"
                                    hide-details
                                    required
                                    flat
                            ></v-select>
                        </div>
                        <div id="usersDelete">
                            <ButtonOutline msg="X" @clicked="removeUserFromProject(assignedUser.user._id)"></ButtonOutline>
                        </div>
                    </div>
                </v-card>
            </div>
            <div id="formBottom">
                <h4>Dodaj uporabnika</h4>
                <div id="userSearch">
                    <v-autocomplete
                            color="#3093A0"
                            prepend-icon="supervised_user_circle"
                            v-model=selectedUser
                            :items="users"
                            :filter="customFilter"
                            item-text="username"
                            item-value="_id"
                            label="Izberite uporabnika"
                            @keyup.enter.native="addUserToProject"
                    ></v-autocomplete>
                    <ButtonOutline msg="+" @clicked="addUserToProject"></ButtonOutline>
                </div>
            </div>
            <ButtonBase msg="Shrani" :isDisabled="!valid" @clicked="addNewProject"></ButtonBase>
        </v-form>
    </div>
</template>

<script>
    import ButtonOutline from "../Generic/ButtonOutline";
    import ButtonBase from "../Generic/ButtonBase";

    export default {
        name: "ProjectForm",
        components: {ButtonBase, ButtonOutline},
        props: {
            formName: String,
            isNewProject: Boolean,
            insertedUsers: Array,
            insertedAssignedUsersToProject: Array,
            projectId: String,
            insertedProjectName: String
        },
        created(){
            this.users = this.insertedUsers;
            this.originalUsers = JSON.parse(JSON.stringify(this.users));
            this.assignedUsersToProject = this.insertedAssignedUsersToProject;
            this.projectName = this.insertedProjectName;
            if (this.users) {
                this.assignedUsersToProject.forEach((assignedUser) => {
                    this.users.splice(this.users.findIndex(user => user._id === assignedUser.user._id) , 1);
                })
            }

        },
        watch: {
            insertedAssignedUsersToProject: function (newVal, oldVal) {
                this.assignedUsersToProject = newVal;
            },
            insertedUsers: function(newVal, oldVal) {
                if (oldVal !== newVal) {
                    this.users = newVal;
                    if (this.users) {
                        this.assignedUsersToProject.forEach((assignedUser) => {
                            this.users.splice(this.users.findIndex(user => user._id === assignedUser.user._id) , 1);
                        })
                    }
                }
            },
            isNewProject: function (newVal, oldVal) {
                if (newVal) { // if we are edding project
                    this.originalUsers = JSON.parse(JSON.stringify(this.users));
                }
            },

            insertedProjectName: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.projectName = newVal;
                }
            }
        },

        data () {
            return {
                valid: true,
                projectName: '',
                selectedUser: null,
                assignedUsersToProject: [],
                users: [],
                originalUsers: [],
                possibleRoles: ['Product Owner', 'Scrum Master', 'Developer'],
            }
        },

        methods: {
            customFilter (item, queryText, itemText) {
                const textOne = item.username.toLowerCase();
                const searchText = queryText.toLowerCase();

                return textOne.indexOf(searchText) > -1
            },
            addUserToProject() {
                if (!this.selectedUser) {
                    return;
                }
                this.assignedUsersToProject.push(
                    {
                        user: this.users.find(user => user._id === this.selectedUser),
                        role: 'Developer' // assigne default user project role
                    }

                );
                this.users.splice(this.users.findIndex(user => user._id === this.selectedUser) , 1);
                this.selectedUser = null;
            },
            removeUserFromProject(userId) {
                this.users.push(
                    this.assignedUsersToProject.find(user => user.user._id === userId).user
                );
                this.assignedUsersToProject.splice(this.assignedUsersToProject.findIndex(user => user.user._id === userId) , 1);
            },
            addNewProject() {
                if (this.$refs.form.validate()) {
                    let usersAssigned = [];
                    this.assignedUsersToProject.forEach(function(userAssigned1){
                        usersAssigned.push(
                            {
                                user: userAssigned1.user,
                                role: userAssigned1.role
                            }
                        );
                    });
                    if (this.isNewProject) {
                        this.$emit('adminProjectAdd', {
                            name: this.projectName,
                            users:usersAssigned
                        });

                        this.resetForm();
                        this.users = this.originalUsers;
                        this.assignedUsersToProject = [];
                    } else {
                        this.$emit('projectEdit', {
                            _id: this.projectId,
                            name: this.projectName,
                            users:usersAssigned
                        });
                        //shoud not reset form...
                    }
                } else {
                    this.valid = false;
                }
            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            }

        }
    }
</script>

<style scoped>

    #formTop {
        margin-bottom: 10px;
        border: 1.5px solid #969DAA;
        border-radius: 4px;
        padding: 2px;
        height: 230px;
        overflow: scroll;
        background-color: #F6F6F7;
    }

    #assignedUsers {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 5px 10px;
    }

    #usersUser {
        flex-basis: 30%;
        padding: 0;
        margin: 0;
    }

    #usersUser > * {
        padding: 0 0 5px 0;
        font-size: 15px;
        font-weight: bold;
    }

    #usersRole {
        flex-basis: 55%;
    }

    #assignedUsers > button {
        margin-bottom: 5px;
    }

    #formBottom {
        padding: 20px 0;
    }

    #userSearch {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    }

    #userSearch > button {
        align-self: center;
        margin-bottom: 5px;
        margin-left: 10px;
    }
</style>