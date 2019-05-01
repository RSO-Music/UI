<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout row justify-end>
        <v-dialog v-model="dialog" max-width="1200px">
            <template v-slot:activator="{ on }">
                <v-btn flat icon color="#3093A0" v-on="on">
                    <v-icon>info_outline</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                >
                    <div class="dialog-titlebar">
                        <v-layout>
                            <h2 class="pl-3 pb-0 white--text">PODATKI O ZGODBI</h2>
                        </v-layout>
                    </div>

                    <v-tabs
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
                                                :disabled="true"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs-3 offset-xs1>
                                        <v-checkbox color="#3093A0"
                                                    @change=""
                                                    v-model="storyFinished"
                                                    label="Zgodba zaključena"
                                                    :disabled="true"
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
                                                        :disabled="true"
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
                                                        :disabled="true"
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
                                                        :disabled="true"
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
                                                :disabled="true"
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
                                                :disabled="true"
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-layout mt-2 mb-2 v-if="story.comment">
                                    <v-flex xs12>
                                        <p><v-icon class="red--text">info_outline</v-icon> <span class="ml-2 red--text">Zgodba je že bila zavrnjena z razlogom: {{story.comment}}</span></p>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-tab-item>

                        <v-tab-item v-if="story.sprintId" key="2">
                            <v-container pa-0>
                                <v-layout>
                                    <v-flex lg6 mr-1 pa-2 class="tasks-container">
                                        <separator title="Nedodeljene"></separator>
                                        <template v-if="unassignedTasks.length">
                                            <task-card v-for="(task, index) in unassignedTasks" :task="task"
                                                       @editTask="changeTask"
                                                       :key="task._id"
                                                       :disabled="true"
                                                       :viewOnly="true"
                                            />
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>

                                        <separator title="Dodeljene"></separator>

                                        <template v-if="assignedTasks.length">
                                            <task-card v-for="(task, index) in assignedTasks" :task="task"
                                                       @editTask="changeTask"
                                                       :key="task._id"
                                                       :disabled="true"
                                                       :viewOnly="true"
                                            />
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>

                                        <separator title="Aktivne"></separator>

                                        <template v-if="activeTasks.length">
                                            <task-card v-for="(task, index) in activeTasks" :task="task"
                                                       @editTask="changeTask"
                                                       :key="task._id"
                                                       :disabled="true"
                                                       :viewOnly="true"
                                            />
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>
                                        
                                        <separator title="Zaključene"></separator>
                                        <template v-if="finishedTasks.length">
                                            <task-card v-for="(task, index) in finishedTasks" :task="task"
                                                       @editTask="changeTask"
                                                       :key="task._id"
                                                       :disabled="true"
                                                       :viewOnly="true"
                                            />
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>
                                    </v-flex>


                                    <v-flex v-if="editTask" lg6 ml-1 pa-4>
                                        <h1 >Pregled naloge</h1>
                                        
                                        <v-layout>
                                            <v-flex x12>
                                                <v-textarea
                                                        color="#3093A0"
                                                        prepend-icon="assignment"
                                                        rows="1"
                                                        label="Opis naloge"
                                                        v-model="editTask.description"
                                                        :disabled="true"
                                                ></v-textarea>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout align-center justify-space-between row mb-4>
                                            <v-flex xs4 mr-2>
                                                <v-text-field
                                                        class="mt-4"
                                                        id="taskSpeed"
                                                        color="#3093A0"
                                                        prepend-icon="timer"
                                                        label="Ocena časa"
                                                        type="number"
                                                        v-model="editTask.time"
                                                        :disabled="true"
                                                        min="1"
                                                        flat
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-select
                                                        color="#3093A0"
                                                        prepend-icon="person"
                                                        v-model="editTask.assignee"
                                                        :disabled="true"
                                                        label="Razvijalec"
                                                        :items="projectUsers"
                                                        :item-text="({ user }) => {
                                                    return `${user.firstName} ${user.lastName ? user.lastName : ''}`;
                                                }"
                                                        item-value="user._id"
                                                        hide-details
                                                        flat
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs4 ml-2>
                                                <v-select
                                                        color="#3093A0"
                                                        v-model="editTask.status"
                                                        :disabled="true"
                                                        :items="taskStatus"
                                                        item-text="name"
                                                        item-value="value"
                                                        label="Status naloge"
                                                        hide-details
                                                        flat
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                        
                                        <v-layout mb-2 v-if="editTask._id">
                                            <v-layout align-center v-if="editTask.assignee && !editTask.accepted">
                                                <v-icon class="red--text">info_outline</v-icon> <span class="ml-2 red--text">Razvijalec naloge še ni sprejel</span>
                                            </v-layout>

                                            <v-layout align-center v-if="editTask.assignee && editTask.accepted">
                                                <v-icon class="green--text">check_circle_outline</v-icon> <span class="ml-2 green--text">Razvijalec je sprejel nalogo</span>
                                            </v-layout>
                                        </v-layout>
                                        
                                        <v-layout mb-4 mt-4 v-if="editTask.assignee && editTask.accepted">
                                            <v-flex>
                                                <p><span class="grey--text">Število porabljenih ur:</span> {{editTask.activeHours}}</p>    
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex v-else lg6 ml-1 pa-4>
                                        <h1 >Izberite nalogo</h1>
                                    </v-flex>
                                </v-layout>
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
    import ButtonOutline from "../Generic/ButtonOutline";
    import Separator from "../Generic/Separator";
    import TaskCard from "../Generic/TaskCard";

    export default {
        name: "ViewUserStoryDialog",
        components: { ButtonBase, ButtonOutline, Separator, TaskCard },
        props: ['story', 'fullEdit', 'customBtn'],
        data: () => ({
            dialog: false,
            valid: true,
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
            editTask: null,
        }),
        methods: {
            closeDialog() {
                this.dialog = false;
            },
            clearEdit() {
                this.editTask = {
                    description: '',
                    time: '',
                    status: 'new'
                };
            },
            changeTask(task) {
                this.editTask = JSON.parse(JSON.stringify(task));
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
        border: 1px solid #eee;
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

    .tasks-container {
        overflow-y: scroll;
        height: 500px;
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