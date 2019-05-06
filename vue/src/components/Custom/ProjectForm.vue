<template>
    <v-form
            class="form-wrapper"
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-layout column mb-4>
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

            <h2 class="section-title">Osebe</h2>

            <v-layout column class="users-wrapper">
                <v-layout column class="users-list">
                    <v-card class="user-card" flat v-for="assignedUser in assignedUsersToProject" :key="assignedUser._id">
                        <v-layout pa-2>
                            <v-flex xs5>
                                <v-layout ml-2 align-center fill-height>
                                    <p>{{`${assignedUser.user.firstName} ${assignedUser.user.lastName ?
                                        assignedUser.user.lastName : ''}`}}
                                    </p>
                                </v-layout>
                            </v-flex>

                            <v-flex xs6>
                                <v-select
                                        color="#3093A0"
                                        prepend-icon="label"
                                        v-model="assignedUser.role"
                                        :items="$userProjectRoles"
                                        :rules="[v => !!v || 'Izberite vlogo']"
                                        label="Uporabniške vloge"
                                        hide-details
                                        required
                                        flat
                                        multiple
                                ></v-select>
                            </v-flex>

                            <v-flex xs1 mr-2>
                                <v-layout align-center justify-end fill-height>
                                    <ButtonOutline icon="clear"
                                                   @clicked="removeUserFromProject(assignedUser.user._id)"></ButtonOutline>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-layout>

                <v-layout pa-2 mb-2>
                    <v-flex xs5 mr-4>
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
                    </v-flex>
                    <v-flex xs6>
                        <v-select
                                color="#3093A0"
                                prepend-icon="label"
                                v-model="selectedUser.role"
                                :items="$userProjectRoles"
                                label="Uporabniške vloge"
                                hide-details
                                multiple
                                flat
                        ></v-select>
                    </v-flex>

                    <v-flex xs1 mr-2>
                        <v-layout align-end justify-end fill-height>
                            <ButtonOutline icon="add" @clicked="addUserToProject"></ButtonOutline>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-layout>
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

            insertedUsers(newVal, oldVal) {
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
    .users-wrapper {
        border: 1px solid #eeeeee;
    }
    
    .user-card {
        border-bottom: 1px solid #eeeeee;
    }
    
    .users-list {
        overflow-y: scroll;
        height: 300px;
        border-bottom: 1px solid #eeeeee;
    }
</style>