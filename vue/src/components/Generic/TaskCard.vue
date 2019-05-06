<template>
    <div v-if="task" class="story-task">
        <v-layout row>
            <v-flex xs3>
                <div id="cardName">
                    <p>{{task.description}}</p>
                </div>
            </v-flex>
            <v-flex xs1>
                <div id="cardDescription">
                    <p>{{task.time}} h</p>
                </div>
            </v-flex>
            <v-flex xs2>
                <div id="cardUserName">
                    <p v-if="taskAssignee">
                        <span v-if="task.accepted" class="green--text">{{taskAssignee}}</span>
                        <span v-else class="red--text" title="Razvijalec naloge še ni sprejel">{{taskAssignee}}</span>
                    </p>
                    <p v-else class="grey--text text-xs-center">/</p>
                </div>
            </v-flex>
            <v-flex xs3>
                <v-btn v-if="!viewOnly && isCurrentUserDeveloper" flat color="#1C69C1" v-on:click="assignToMe" :disabled="task.assignee != null || task.finished"
                       v-show="!isMyTask(task.assignee)">
                    Sprejmi nalogo
                </v-btn>

                <v-btn v-if="!viewOnly && isCurrentUserDeveloper" flat color="#fb8c00" v-on:click="unassign" :disabled="task.active || task.finished" v-show="isMyTask(task.assignee)">
                    Opusti nalogo
                </v-btn>
            </v-flex>
            <v-flex xs3>
                <v-layout v-if="!viewOnly" justify-end>
                    <v-btn flat icon color="#3093A0" v-on:click="editTask" :disabled="disabled">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn flat icon color="red" v-on:click="deleteTask" :disabled="disabled || task.finished || task.assignee !== $store.getters.currentUser._id">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-layout>
                <v-layout v-else justify-end>
                    <v-btn flat icon color="#3093A0" v-on:click="editTask">
                        <v-icon>info_outline</v-icon>
                    </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "TaskCard",
        props: {
            task: Object,
            disabled: Boolean,
            viewOnly: Boolean
        },
        data: () => ({
            array: []
        }),
        methods: {
            isMyTask(assignee) {
                return this.$store.getters.currentUser._id === assignee;
            },
            editTask() {
                this.$emit('editTask', this.task)
            },

            deleteTask() {
                this.$emit('deleteTask', this.task)
            },

            unassign() {
                console.log(
                    "storyId: " + this.task.storyId + " taskId: " + this.task._id
                );

                const task = { storyId: this.task.storyId, assignee: null };
                console.log(task);

                APICalls.unassignTask(this.task.storyId, this.task._id, task).then(
                    (res) => {
                        this.$emit('updateTask', res.data);
                    },
                    (error) => {
                        console.log("error: " + error);
                    }
                );
            },

            assignToMe() {
                console.log(
                    "storyId: " + this.task.storyId + " taskId: " + this.task._id
                );

                const task = { storyId: this.task.storyId, assignee: this.$store.getters.currentUser._id };
                console.log(task);

                APICalls.assignToMe(this.task.storyId, this.task._id, task).then(
                    (res) => {
                        this.$emit('updateTask', res.data);
                    },
                    (error) => {
                        console.log("error: " + error);
                    }
                );
            }
        },
        computed: {
            taskAssignee() {
                let vm = this;

                if (this.task.assignee) {
                    let editingProject = this.$store.getters.editingProject;

                    let assignedUser = editingProject.users.find(function (user) {
                        return user.user._id === vm.task.assignee;
                    });

                    if (assignedUser) return `${assignedUser.user.firstName} ${assignedUser.user.lastName}`;
                }
            },
            isCurrentUserDeveloper() {
                let vm = this;

                const editingProject = this.$store.getters.editingProject;

                const currentUser = this.$store.getters.currentUser;

                const foundCurrentUser = editingProject.users.find(function (user) {
                    return user.user._id === currentUser._id;
                });
                
                return foundCurrentUser.role.includes('developer');
            }
        }
    }
</script>

<style scoped>
    .story-task {
        background-color: white;
        border-radius: 2px;
        padding: 10px 10px 10px 20px;
        margin-bottom: 8px;
        border: 1px solid #A0A6B2;
        border-left: 8px solid #3093A0;
        overflow: hidden;
    }

    #storyTags {
        display: flex;
        padding: 5px 0;
    }

    .tagDesign {
        margin-right: 5px;
        padding: 3px 8px;
        border-radius: 10px;
    }

    #cardName {
        padding: 5px;
        margin-top: 10px;
    }

    #cardDescription {
        padding: 10px;
        margin-top: 5px;
    }

    #cardDescription p {
        color: #969DAA;
    }

    #cardUserName {
        padding: 5px;
        margin-top: 10px;
    }

</style>