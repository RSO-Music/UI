<template>
    <v-form
            class="form-wrapper"
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-layout column>
            <h1 class="text-uppercase text-xs-center" v-if="isNew">Ustvari projekt</h1>
            <h1 class="text-uppercase text-xs-center" v-else="isNew">Uredi projekt</h1>

            <v-text-field
                    color="#3093A0"
                    prepend-icon="rate_review"
                    label="Ime projekta"
                    :rules="[v => !!v || 'Ime projekta ne sme biti prazno']"
                    v-model="projectName"
                    required
            ></v-text-field>

            <h4>Projektni sodelavci</h4>

            <div id="formTop">
                <v-card flat v-for="assignedUser in assignedUsersToProject" :key="assignedUser._id">
                    <div id="assignedUsers">
                        <div id="usersUser">
                            <v-card-title primary-title>
                                <p>{{`${assignedUser.user.firstName} ${assignedUser.user.lastName ?
                                    assignedUser.user.lastName : ''}`}}
                                </p>
                            </v-card-title>
                        </div>
                        <div id="usersRole">
                            <v-select
                                    color="#3093A0"
                                    prepend-icon="label"
                                    v-model="assignedUser.role"
                                    :items="$userProjectRoles"
                                    :rules="[v => !!v || 'Izberite vlogo']"
                                    label="Uporabniška vloga"
                                    hide-details
                                    required
                                    flat
                                    multiple
                            ></v-select>
                        </div>
                        <div id="usersDelete">
                            <ButtonOutline msg="X"
                                           @clicked="removeUserFromProject(assignedUser.user._id)"></ButtonOutline>
                        </div>
                    </div>
                </v-card>
            </div>
            <div id="formBottom">
                <div id="userSearch">
                    <v-select
                            color="#3093A0"
                            prepend-icon="supervised_user_circle"
                            v-model="selectedUser._id"
                            :items="users"
                            :item-text="(user) => {
                                return `${user.firstName} ${user.lastName ? user.lastName : ''}`;
                            }"
                            no-data-text="Ni najdenih uporabnikov"
                            item-value="_id"
                            label="Izberite uporabnika"
                            hide-details
                            required
                            flat
                    ></v-select>

                    <v-select
                            color="#3093A0"
                            prepend-icon="label"
                            v-model="selectedUser.role"
                            :items="$userProjectRoles"
                            :rules="[v => !!v || 'Izberite vlogo']"
                            label="Uporabniška vloga"
                            hide-details
                            multiple
                            flat
                    ></v-select>

                    <ButtonOutline msg="+" @clicked="addUserToProject"></ButtonOutline>
                </div>
            </div>
        </v-layout>
        
        <v-layout justify-end>
            <ButtonBase msg="Shrani" @clicked="addNewProject"></ButtonBase>
        </v-layout>
    </v-form>
</template>

<script>
    import ButtonOutline from "../Generic/ButtonOutline";
    import ButtonBase from "../Generic/ButtonBase";

    export default {
        name: "ProjectForm",
        components: { ButtonBase, ButtonOutline },
        props: {
            isNew: Boolean,
            insertedUsers: Array,
            insertedAssignedUsersToProject: Array,
            projectId: String,
            insertedProjectName: String
        },
        created() {
            this.users = this.insertedUsers;
            this.originalUsers = JSON.parse(JSON.stringify(this.users));
            this.assignedUsersToProject = this.insertedAssignedUsersToProject;
            this.projectName = this.insertedProjectName;

            if (this.users) {
                this.assignedUsersToProject.forEach((assignedUser) => {
                    this.users.splice(this.users.findIndex(user => user._id === assignedUser.user._id), 1);
                })
            }
        },
        watch: {
            insertedAssignedUsersToProject(newVal, oldVal) {
                this.assignedUsersToProject = newVal;
            },

            insertedUsers: function (newVal, oldVal) {
                if (oldVal !== newVal) {
                    this.users = newVal;
                    if (this.users) {
                        this.assignedUsersToProject.forEach((assignedUser) => {
                            this.users.splice(this.users.findIndex(user => user._id === assignedUser.user._id), 1);
                        })
                    }
                }
            },

            isNew(newVal, oldVal) {
                if (newVal) { // if we are edding project
                    this.originalUsers = JSON.parse(JSON.stringify(this.users));
                }
            },

            insertedProjectName(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.projectName = newVal;
                }
            }
        },

        data() {
            return {
                valid: true,
                projectName: '',
                selectedUser: {},
                assignedUsersToProject: [],
                users: [],
                originalUsers: []
            }
        },

        methods: {
            addUserToProject() {
                if (!this.selectedUser._id) {
                    return;
                }

                if (!this.selectedUser.role) {
                    this.$toasted.error('Določite vlogo uporabnika v projektu', {
                        duration: 3000,
                        position: "bottom-center",
                    });

                    return;
                }

                this.assignedUsersToProject.push(
                    {
                        user: this.users.find(user => user._id === this.selectedUser._id),
                        role: this.selectedUser.role
                    }
                );

                this.users.splice(this.users.findIndex(user => user._id === this.selectedUser._id), 1);

                this.selectedUser = {};
            },

            removeUserFromProject(userId) {
                this.users.push(
                    this.assignedUsersToProject.find(user => user.user._id === userId).user
                );

                this.assignedUsersToProject.splice(this.assignedUsersToProject.findIndex(user => user.user._id === userId), 1);
            },

            addNewProject() {
                if (this.$refs.form.validate()) {
                    let usersAssigned = [];
                    this.assignedUsersToProject.forEach(function (userAssigned1) {
                        usersAssigned.push(
                            {
                                user: userAssigned1.user,
                                role: userAssigned1.role
                            }
                        );
                    });
                    if (this.isNew) {
                        this.$emit('adminProjectAdd', {
                            name: this.projectName,
                            users: usersAssigned
                        });

                        this.resetForm();
                        this.users = this.originalUsers;
                        this.assignedUsersToProject = [];
                    } else {
                        this.$emit('projectEdit', {
                            _id: this.projectId,
                            name: this.projectName,
                            users: usersAssigned
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
        border-radius: 2px;
        padding: 2px;
        height: 230px;
        overflow-y: scroll;
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