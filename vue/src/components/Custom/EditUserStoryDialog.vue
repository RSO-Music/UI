<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout row justify-end>
        <v-dialog v-model="dialog" max-width="1200px">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                       v-if="customBtn"
                       class="custom-btn"
                       color="#3093A0"
                       depressed
                       dark
                >
                    DODAJ NOVO ZGODBO
                </v-btn>

                <v-btn flat icon color="#3093A0" v-on="on" v-else>
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                >
                    <div id="toolbar">
                        <div id="topBarLeft">
                            <v-layout justify-center>
                                <h2 class="pl-3 pb-0 white--text" v-if="story._id">UREDI ZGODBO</h2>
                                <h2 class="pl-3 pb-0 white--text" v-else>DODAJ NOVO ZGODBO</h2>
                            </v-layout>
                        </div>
                    </div>

                    <v-tabs
                            :key="activeTab"
                            v-model="activeTab"
                            dark
                            slider-color="#A2E0E0"
                            fixed-tabs
                            color="#1A2432"
                    >
                        <v-tab key="1">
                            Osnovni podatki

                        </v-tab>

                        <v-tab v-if="story.sprintId" key="2">
                            Naloge

                        </v-tab>
                        <v-tab-item key="1">
                            <v-container>
                                <v-layout row>
                                    <v-flex xs-8>
                                        <v-text-field
                                                color="#3093A0"
                                                prepend-icon="rate_review"
                                                label="Naslov zgodbe"
                                                :rules="[v => !!v || 'Naslov zgodbe ne sme biti prazen']"
                                                v-model="storyName"
                                                required
                                                :disabled="editExisting"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs-3 offset-xs1>
                                        <v-checkbox color="#3093A0"
                                                    @change=""
                                                    v-model="storyFinished"
                                                    label="Zgodba zaključena"
                                                    :disabled="!editExisting"
                                        ></v-checkbox>
                                    </v-flex>
                                </v-layout>
                                <div id="storyWrapper">
                                    <div id="storyDropdowns">
                                        <v-layout mb-3 row justify-space-between>
                                            <v-flex xs4>
                                                <v-select
                                                        color="#3093A0"
                                                        prepend-icon="label_important"
                                                        v-model="selectPriority"
                                                        :items="storyPriority"
                                                        :rules="[v => !!v || 'Prioriteta ne sme biti prazna']"
                                                        label="Prioriteta"
                                                        hide-details
                                                        required
                                                        :disabled="editExisting"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-select
                                                        color="#3093A0"
                                                        prepend-icon="loyalty"
                                                        v-model="selectBussinessValue"
                                                        :items="storyValue"
                                                        :rules="[v => !!v || 'Poslovna vrednost ne sme biti prazna']"
                                                        label="Poslovna vrednost"
                                                        hide-details
                                                        required
                                                        :disabled="editExisting"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-text-field
                                                        color="#3093A0"
                                                        prepend-icon="access_time"
                                                        type="number"
                                                        min="0"
                                                        label="Časovna ocena"
                                                        v-model="timeEstimation"
                                                        :disabled="editExisting"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                </div>
                                <v-layout row justify-space-between>
                                    <v-flex xs6 class="mr-4">
                                        <v-textarea
                                                color="#3093A0"
                                                id="storyDesc"
                                                label="Opis zgodbe"
                                                v-model="storyDescription"
                                                :rules="[v => !!v || 'Opis zgodbe ne sme biti prazen']"
                                                rows="5"
                                                :auto-grow="true"
                                                required
                                                :disabled="editExisting"
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-textarea
                                                color="#3093A0"
                                                label="Sprejemni testi"
                                                v-model="storyAcceptanceTests"
                                                :rules="[v => !!v || 'Sprejemni testi ne smejo biti prazni']"
                                                rows="5"
                                                :auto-grow="true"
                                                required
                                                :disabled="editExisting"
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs12>
                                        <ButtonBase :disabled="!valid" msg="Shrani" @clicked="updateStory"></ButtonBase>
                                        <ButtonBase msg="Prekliči" @clicked="closeDialog" class="cancel"></ButtonBase>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-tab-item>

                        <v-tab-item v-if="story.sprintId" key="2">
                            <v-container>
                                <v-flex x12>
                                    <v-textarea
                                            color="#3093A0"
                                            prepend-icon="assignment"
                                            rows="1"
                                            label="Opis naloge"
                                            v-model="editTask.description"
                                            :disabled="isNotScrumMaster"
                                    ></v-textarea>
                                </v-flex>

                                <v-layout align-center justify-space-between row mb-5>
                                    <v-flex xs3>
                                        <v-text-field
                                                id="taskSpeed"
                                                color="#3093A0"
                                                prepend-icon="timer"
                                                label="Časovna ocena"
                                                type="number"
                                                v-model="editTask.time"
                                                :disabled="isNotScrumMaster"
                                                min="1"
                                                flat
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-select
                                                color="#3093A0"
                                                prepend-icon="person"
                                                v-model="editTask.assignee"
                                                :disabled="isNotScrumMaster"
                                                label="Razvijalec naloge"
                                                :items="projectUsers"
                                                :item-text="({ user }) => {
                                                    return `${user.firstName} ${user.lastName ? user.lastName : ''}`;
                                                }"
                                                item-value="user._id"
                                                hide-details
                                                flat
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-select
                                                color="#3093A0"
                                                v-model="editTask.status"
                                                :disabled="!editingTask || isNotScrumMaster"
                                                :items="taskStatus"
                                                item-text="name"
                                                item-value="value"
                                                label="Status naloge"
                                                hide-details
                                                flat
                                        ></v-select>
                                    </v-flex>
                                </v-layout>

                                <v-layout align-center justify-end row fill-height mb-3>
                                    <ButtonOutline msg="Prekliči" @clicked="clearEdit"
                                                   :isDisabled="isNotScrumMaster"
                                                   class="mr-3"></ButtonOutline>
                                    <ButtonOutline msg="Shrani nalogo" @clicked="addTask"
                                                   :isDisabled="!isEditTaskValid || isNotScrumMaster"></ButtonOutline>
                                </v-layout>

                                <div class="taskBox">
                                    <separator title="Nedodeljene naloge"></separator>
                                    <task-card v-for="(task, index) in unassignedTasks" :task="task"
                                               @editTask="changeTask"
                                               @deleteTask="deleteTask" :key="task._id"
                                               :disabled="isNotScrumMaster"/>

                                    <separator title="Dodeljene naloge"></separator>
                                    <task-card v-for="(task, index) in assignedTasks" :task="task"
                                               @editTask="changeTask"
                                               @deleteTask="deleteTask" :key="task._id"
                                               :disabled="isNotScrumMaster"/>

                                    <separator title="Aktivne naloge"></separator>
                                    <task-card v-for="(task, index) in activeTasks" :task="task" @editTask="changeTask"
                                               @deleteTask="deleteTask" :key="task._id"
                                               :disabled="isNotScrumMaster"/>

                                    <separator title="Zaključene naloge"></separator>
                                    <task-card v-for="(task, index) in finishedTasks" :task="task"
                                               @editTask="changeTask"
                                               @deleteTask="deleteTask" :key="task._id"
                                               :disabled="isNotScrumMaster"/>
                                </div>
                            </v-container>
                        </v-tab-item>
                    </v-tabs>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    import { APICalls } from "../../utils/apiCalls";
    import MyAlert from "../Generic/AlertBox";
    import ButtonOutline from "../Generic/ButtonOutline";
    import Separator from "../Generic/Separator";
    import TaskCard from "../Generic/TaskCard";

    export default {
        name: "EditUserStoryDialog",
        components: { MyAlert, ButtonBase, ButtonOutline, Separator, TaskCard },
        props: ['story', 'fullEdit', 'customBtn'],
        data: () => ({
            dialog: false,
            valid: true,
            activeTab: 0,
            editExisting: false,
            errorText: '',
            storyName: '',
            storyDescription: '',
            storyAcceptanceTests: '',
            selectPriority: '',
            timeEstimation: '',
            storyPriority: ['Must have',
                'Should have',
                'Could have',
                'Wont have this time',
            ],
            selectBussinessValue: '',
            storyValue: ['Critical',
                'Significant',
                'Moderate',
                'Minor',
                'Low',
            ],
            storyFinished: false,
            tasks: [],
            taskStatus: [
                {
                    name: 'Novo',
                    value: 'new'
                },
                {
                    name: 'V delu',
                    value: 'in_progress'
                },
                {
                    name: 'Zaključeno',
                    value: 'finished'
                }
            ],
            editTask: {
                description: '',
                time: '',
                status: 'new'
            },
            editingTask: false
        }),
        methods: {
            updateStory() {
                if (this.story._id) {
                    //update existing story
                    APICalls.updateUserStory({
                        name: this.storyName,
                        description: this.storyDescription,
                        acceptanceTests: this.storyAcceptanceTests,
                        priority: this.selectPriority,
                        timeEstimation: this.timeEstimation,
                        businessValue: this.selectBussinessValue,
                        done: this.storyFinished,
                        tasks: this.tasks
                    }, this.story._id).then(
                        (rs) => {
                            this.closeDialog();
                            this.$emit("refresh", true);
                            this.error = 0;
                            this.errorText = ""
                        },
                        (error) => {
                            console.log(error);
                            this.error = 2;
                            this.errorText = "Uporabniška zgodba s takim naslovom že obstaja."
                        })
                } else {
                    APICalls.addNewUserStoryToProject(
                        {
                            name: this.storyName,
                            description: this.storyDescription,
                            acceptanceTests: this.storyAcceptanceTests,
                            priority: this.selectPriority,
                            timeEstimation: this.timeEstimation,
                            businessValue: this.selectBussinessValue,
                            projectId: this.$store.getters.editingProject._id,
                            sprintId: null,
                            done: false,
                            tasks: this.tasks
                        }
                    ).then(
                        (rs) => {
                            this.closeDialog();
                            this.$emit("refresh", true);
                            this.error = 0;
                            this.errorText = ""
                        },
                        (error) => {
                            console.log(error);
                            this.error = 2;
                            this.errorText = "Uporabniška zgodba s takim naslovom že obstaja."
                        })
                }
            },
            closeDialog() {
                this.dialog = false;
            },
            addTask() {
                let editTask = this.editTask;
                let currentStory = this.story;
                let vm = this;

                //check if all required fields are present
                if (!editTask.description || !editTask.time) {
                    this.error = 2;
                    this.errorText = "Če želite dodati nalogo, vpišite opis naloge in določite čas"
                    return;
                }


                if (!editTask._id) {
                    //add new task to story
                    APICalls.addNewUserTask(
                        {
                            storyId: currentStory._id,
                            description: editTask.description,
                            time: editTask.time,
                            assignee: editTask.assignee,
                            status: editTask.status,
                            accepted: false
                        }
                    ).then(
                        (rs) => {
                            vm.tasks.push(rs.data);
                            vm.clearEdit();
                        },
                        (error) => {
                            console.log(error);
                        })

                }
                else {
                    //update existing task
                    APICalls.updateUserTask(
                        {
                            storyId: currentStory._id,
                            description: editTask.description,
                            time: editTask.time,
                            assignee: editTask.assignee,
                            status: editTask.status,
                            accepted: false
                        }, editTask._id
                    ).then(
                        (rs) => {
                            vm.clearEdit();
                        },
                        (error) => {
                            console.log(error);
                        })

                }
            },
            clearEdit() {
                this.editTask = {
                    description: '',
                    time: '',
                    status: 'new'
                };

                this.editingTask = false;
            },
            changeTask(task) {
                this.editTask = task;
                this.editingTask = true;
            },
            deleteTask(deleteTask) {
                APICalls.deleteUserStory(deleteTask._id).then(
                    (rs) => {
                        this.tasks = this.tasks.filter(function (task) {
                            return task._id !== deleteTask._id
                        });
                    },
                    (error) => {
                        console.log(error);
                    })

                this.clearEdit();

			},
			assignToMe(assignedTask) {
			},
			resetForm() {
				this.$refs.form.reset();
				this.$refs.form.resetValidation();
			},
			generateRandom() {
				return new Date().getTime().toString() + Math.floor(Math.random() * 1000000);
			}
		},
		computed: {
			unassignedTasks() {
				//task is treated as unassigned if it has no assignee
				if (this.tasks) {
					return this.tasks.filter(function (task) {
						return !task.accepted;
					})
				}
			},
			assignedTasks() {
				//for now task is treated as assigned as soon as user is assigned - later user must accept task in order to be treated as assigned (add accepted flag)
				if (this.tasks) {
					return this.tasks.filter(function (task) {
						return task.accepted && task.status === 'new'
					})
				}
			},
			activeTasks() {
				//task is treated as active if it is assigned and is marked as 'in_progress'
				if (this.tasks) {
					return this.tasks.filter(function (task) {
						return task.asignee && task.status === 'in_progress'
					})
				}
			},
			finishedTasks() {
				//task is treated as finished if it is assigned and is marked as 'finished'
				if (this.tasks) {
					return this.tasks.filter(function (task) {
						return task.asignee && task.status === 'finished'
					})
				}
			},
			projectUsers() {
				let projectData = this.$store.getters.editingProject;

                return projectData.users;
            },
            isNotScrumMaster() {
                let projectData = this.$store.getters.editingProject;

                let currentUser = this.$store.getters.currentUser;

                let userInProject = projectData.users.find(function (user) {
                    return user.user._id === currentUser._id;
                });

                return !userInProject.role.includes('scrum_master');
            },
            isEditTaskValid() {
                if (this.editTask) {
                    return this.editTask.description && this.editTask.description.trim() !== '' && this.editTask.time;
                }
            }
        },
        watch: {
            dialog(val) {
                if (!val) {
                    this.error = 0;

                    this.clearEdit();

                    if (!this.story._id) {
                        this.resetForm();
                    }
                }
            }
        },
        created() {
            if (this.story) {
                this.storyName = this.story.name;
                this.storyDescription = this.story.description;
                this.storyAcceptanceTests = this.story.acceptanceTests;
                this.selectPriority = this.story.priority;
                this.timeEstimation = this.story.timeEstimation;
                this.selectBussinessValue = this.story.businessValue;
                this.storyFinished = this.story.done;
                this.editExisting = this.fullEdit;
                if (this.story._id) {
                    APICalls.getTasksInsideCurrentStory(this.story._id).then(
                        (rs) => {
                            this.tasks = rs.data;
                        },
                        (error) => {
                            console.log(error);
                        })
                }
            }
        }
    }

</script>

<style scoped>
    .form-wrapper {
        margin: 0 !important;
        width: 100%;
        height: 80%;
    }

    .cancel {
        margin-right: 2%;
    }

    #storyWrapper {
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

    .taskBox {
        background-color: #F8F8F8;
        padding: 20px 10px;
        border-radius: 3px;
        border-top: solid #A2E0E0 3px;
    }

    .custom-btn {
        padding: 0 20px;
        font-weight: bold;
        width: fit-content;
        min-width: 15px;
        float: right;
        margin: 0;
    }

    .cancel {
        margin-right: 2%;
    }

</style>