<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout row justify-end>
        <v-dialog v-model="dialog" max-width="1200px">
            <template v-slot:activator="{ on }">
                <template v-if="customBtn">
                    <v-btn v-on="on"
                           v-if="canEditUserStories"
                           class="main-button"
                           color="#3093A0"
                           dark
                    >
                        DODAJ NOVO ZGODBO
                    </v-btn>
                </template>

                <v-btn flat icon color="#3093A0" v-on="on" v-else>
                    <v-icon v-if="!viewOnly && canEditUserStories">edit</v-icon>
                    <v-icon v-else>info_outline</v-icon>
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
                            <h2 class="pl-3 pb-0 white--text" v-if="viewOnly || !canEditUserStories">PREGLEJ ZGODBO</h2>
                            <h2 class="pl-3 pb-0 white--text" v-else-if="isFinishing">ZAKLJUČI ZGODBO</h2>
                            <h2 class="pl-3 pb-0 white--text" v-else-if="story._id">UREDI ZGODBO</h2>
                            <h2 class="pl-3 pb-0 white--text" v-else>DODAJ ZGODBO</h2>
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
                                                :disabled="editExisting || viewOnly || !canEditUserStories"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs-3 offset-xs1>
                                        <v-checkbox color="#3093A0"
                                                    @change=""
                                                    v-model="storyFinished"
                                                    label="Zgodba zaključena"
                                                    :disabled="!editExisting || viewOnly || !canEditUserStories"
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
                                                        :disabled="editExisting || viewOnly || !canEditUserStories"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-select
                                                        color="#3093A0"
                                                        prepend-icon="loyalty"
                                                        v-model="selectBusinessValue"
                                                        :items="storyValue"
                                                        :rules="[v => !!v || 'Poslovna vrednost ne sme biti prazna']"
                                                        label="Poslovna vrednost"
                                                        hide-details
                                                        required
                                                        :disabled="editExisting || viewOnly || !canEditUserStories"
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
                                                        :disabled="editExisting || viewOnly || !canEditUserStories"
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
                                                :disabled="editExisting || viewOnly || !canEditUserStories"
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
                                                :disabled="editExisting || viewOnly || !canEditUserStories"
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-layout mt-2 mb-2 v-if="story.rejected">
                                    <v-flex xs12>
                                        <p class="red--text">
                                            <v-icon class="red--text">info_outline</v-icon>
                                            <span class="ml-2">Zgodba je bila enkrat že zavrnjena</span><span
                                                v-if="story.rejectionReason"> z razlogom: {{story.rejectionReason}}</span>
                                        </p>
                                    </v-flex>
                                </v-layout>

                                <template v-if="isFinishing">
                                    <v-layout mt-4>
                                        <h2 class="section-title">Zaključi zgodbo</h2>
                                    </v-layout>

                                    <v-layout justify-start>
                                        <v-flex xs4>
                                            <v-radio-group v-model="finished.state" row :mandatory="false">
                                                <v-radio color="#1A616B" label="Sprejmi zgodbo"
                                                         value="accept"></v-radio>
                                                <v-radio color="#1A616B" label="Zavrni zgodbo" value="reject"></v-radio>
                                            </v-radio-group>
                                        </v-flex>

                                        <v-text-field
                                                color="#3093A0"
                                                label="Razlog za zavrnitev"
                                                v-model="finished.rejectionReason"
                                                :disabled="finished.state !== 'reject'"
                                        ></v-text-field>
                                    </v-layout>

                                    <v-layout>
                                        <v-flex xs12>
                                            <ButtonBase msg="Zaključi" @clicked="finishStory"></ButtonBase>
                                            <ButtonBase msg="Prekliči" @clicked="closeDialog"
                                                        class="cancel"></ButtonBase>
                                        </v-flex>
                                    </v-layout>
                                </template>

                                <v-layout v-else-if="!viewOnly && canEditUserStories">
                                    <v-flex xs12>
                                        <ButtonBase :disabled="!valid" msg="Shrani" @clicked="updateStory"></ButtonBase>
                                        <ButtonBase msg="Prekliči" @clicked="closeDialog" class="cancel"></ButtonBase>
                                    </v-flex>
                                </v-layout>

                                <v-layout v-else>
                                    <v-flex xs12>
                                        <ButtonBase msg="Zapri" @clicked="closeDialog" class="cancel"></ButtonBase>
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
                                                       @updateTask="addTask"
                                                       :viewOnly="viewOnly"
                                                       @deleteTask="deleteTask" :key="task._id"
                                                       :disabled="!canEditTasks"/>
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>

                                        <separator title="Dodeljene"></separator>

                                        <template v-if="assignedTasks.length">
                                            <task-card v-for="(task, index) in assignedTasks" :task="task"
                                                       @editTask="changeTask"
                                                       @updateTask="addTask"
                                                       :viewOnly="viewOnly"
                                                       @deleteTask="deleteTask" :key="task._id"
                                                       :disabled="!canEditTasks"/>
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>

                                        <separator title="Aktivne"></separator>

                                        <template v-if="activeTasks.length">
                                            <task-card v-for="(task, index) in activeTasks" :task="task"
                                                       @editTask="changeTask"
                                                       @updateTask="addTask"
                                                       :viewOnly="viewOnly"
                                                       @deleteTask="deleteTask" :key="task._id"
                                                       :disabled="!canEditTasks"/>
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>

                                        <v-divider></v-divider>

                                        <separator title="Zaključene"></separator>
                                        <template v-if="finishedTasks.length">
                                            <task-card v-for="(task, index) in finishedTasks" :task="task"
                                                       @editTask="changeTask"
                                                       @updateTask="addTask"
                                                       :viewOnly="viewOnly"
                                                       @deleteTask="deleteTask" :key="task._id"
                                                       :disabled="!canEditTasks"/>
                                        </template>
                                        <p v-else class="grey--text mb-4 text-xs-center">Ni nalog</p>
                                    </v-flex>


                                    <v-flex lg6 ml-1 pa-4>
                                        <h1 v-if="editTask._id">Uredi nalogo</h1>
                                        <h1 v-else>Dodaj nalogo</h1>

                                        <v-layout>
                                            <v-flex x12>
                                                <v-textarea
                                                        color="#3093A0"
                                                        prepend-icon="assignment"
                                                        rows="1"
                                                        label="Opis naloge"
                                                        v-model="editTask.description"
                                                        :disabled="!canEditTasks || viewOnly || editTask.active"
                                                ></v-textarea>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout align-center row mb-4>
                                            <v-flex xs4 mr-2>
                                                <v-text-field
                                                        class="mt-4"
                                                        id="taskSpeed"
                                                        color="#3093A0"
                                                        prepend-icon="timer"
                                                        label="Ocena časa"
                                                        type="number"
                                                        v-model="editTask.time"
                                                        :disabled="!canEditTasks || viewOnly ||editTask.active"
                                                        min="1"
                                                        flat
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs8>
                                                <v-select
                                                        color="#3093A0"
                                                        prepend-icon="person"
                                                        v-model="editTask.assignee"
                                                        :disabled="!canEditTasks || viewOnly || editTask.accepted"
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
                                        </v-layout>

                                        <v-layout mb-4 v-if="!viewOnly && editTask._id">
                                            <v-layout shrink align-center
                                                      v-if="editTask.assignee && !editTask.accepted">
                                                <v-flex>
                                                    <v-icon class="red--text">info_outline</v-icon>
                                                    <span class="ml-2 red--text">Razvijalec naloge še ni sprejel</span>
                                                </v-flex>

                                                <v-flex v-if="editTask.assignee === $store.getters.currentUser._id">
                                                    <ButtonBase
                                                            msg="Sprejmi nalogo"
                                                            @clicked="acceptOrRejectStory"
                                                            class="ml-3"
                                                    />
                                                </v-flex>
                                            </v-layout>

                                            <v-layout v-if="editTask.assignee && editTask.accepted">
                                                <v-flex>
                                                    <v-icon class="green--text">check_circle_outline</v-icon>
                                                    <span class="ml-2 green--text">Razvijalec je sprejel nalogo</span>
                                                </v-flex>

                                                <v-flex v-if="editTask.assignee === $store.getters.currentUser._id">
                                                    <ButtonBase
                                                            msg="Opusti nalogo"
                                                            @clicked="acceptOrRejectStory"
                                                            :isDisabled="editTask.active"
                                                            class="ml-3"
                                                    />
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>

                                        <v-layout
                                                v-if="editTask.assignee && editTask.accepted && editTask.assignee === this.$store.getters.currentUser._id.toString()">
                                            <v-flex>
                                                <p><span class="grey--text">Število mojih ur:</span>
                                                    {{editTask.activeHoursAssignee}}</p>
                                            </v-flex>
                                            <v-flex v-if="!viewOnly && editTask.assignee === $store.getters.currentUser._id">
                                                <ButtonBase
                                                        :msg="`${!editTask.active ? 'Zaženi števec' : 'Ustavi števec'}`"
                                                        @clicked="setTaskActiveStatus"
                                                        :isDisabled="!canEditTasks"
                                                        class="ml-3"
                                                >
                                                </ButtonBase>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout mb-4 v-if="editTask.activeHours > 0">
                                            <v-flex>
                                                <p><span
                                                        class="grey--text">Število ur vseh razvijalcev:</span>
                                                    {{editTask.activeHours}}</p>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout v-if="!viewOnly" align-center justify-end row>
                                            <ButtonBase msg="Ponastavi" @clicked="clearEdit"
                                                        :isDisabled="!canEditTasks || editTask.accepted && editTask.active"
                                                        class="mr-3"></ButtonBase>

                                            <ButtonBase msg="Shrani" @clicked="addTask(editTask)"
                                                        :isDisabled="!isEditTaskValid || !canEditTasks || editTask.accepted && editTask.active"></ButtonBase>
                                        </v-layout>
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
    import {APICalls} from "../../utils/apiCalls";
    import ButtonOutline from "../Generic/ButtonOutline";
    import Separator from "../Generic/Separator";
    import TaskCard from "../Generic/TaskCard";

    export default {
        name: "UserStoryDialog",
        components: {ButtonBase, ButtonOutline, Separator, TaskCard},
        props: {
            story: Object,
            customBtn: Boolean,
            fullEdit: Boolean,
            viewOnly: Boolean,
            isFinishing: Boolean
        },
        data() {
            return {
                dialog: false,
                valid: true,
                editExisting: false,
                errorText: '',
                storyName: '',
                storyDescription: '',
                storyAcceptanceTests: '',
                selectPriority: '',
                timeEstimation: '',
                storyPriority: [
                    'Must have',
                    'Should have',
                    'Could have',
                    'Wont have this time',
                ],
                selectBusinessValue: '',
                storyValue: [
                    'Critical',
                    'Significant',
                    'Moderate',
                    'Minor',
                    'Low',
                ],
                storyFinished: false,
                tasks: [],
                editTask: {
                    description: '',
                    time: ''
                },
                editingTask: false,
                finished: {
                    state: 'accept',
                    rejectionReason: ''
                }
            };
        },
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
                        businessValue: this.selectBusinessValue,
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
                            businessValue: this.selectBusinessValue,
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
            finishStory() {
                const updateObject = {};

                if (this.finished.state === 'accept') {
                    updateObject.done = true;
                    updateObject.realized = true;
                } else if (this.finished.state === 'reject') {
                    updateObject.done = false;
                    updateObject.sprintId = null;
                    updateObject.rejected = true;
                    updateObject.rejectionReason = this.finished.rejectionReason;
                }

                APICalls.updateUserStory(updateObject, this.story._id).then(
                    (res) => {
                        this.$toasted.success(this.finished.state === 'accept' ? 'Zgodba je bila sprejeta' : 'Zgodba je bila zavrnjena', {
                            duration: 3000,
                            position: "bottom-center",
                        });

                        this.closeDialog();

                        this.$emit("finishedStory", true);
                    },
                    (error) => {
                        console.log(error);

                        this.$toasted.error('Napaka pri zaključevanju zgodbe', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    });
            },
            closeDialog() {
                this.dialog = false;
            },
            addTask(editTask) {
                let currentStory = this.story;
                let vm = this;

                //check if all required fields are present
                if (!editTask.description || !editTask.time) {
                    vm.$toasted.error('Če želite dodati nalogo, vpišite opis naloge in določite čas', {
                        duration: 3000,
                        position: "bottom-center",
                    });

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
                            accepted: false,
                            active: false
                        }
                    ).then(
                        (rs) => {
                            vm.tasks.push(rs.data);

                            vm.clearEdit();

                            vm.$toasted.success('Naloga je bila uspešno dodana', {
                                duration: 3000,
                                position: "bottom-center",
                            });
                        },
                        (error) => {
                            console.log(error);
                        })

                } else {
                    //update existing task
                    APICalls.updateUserTask(
                        {
                            storyId: currentStory._id,
                            description: editTask.description,
                            time: editTask.time,
                            assignee: editTask.assignee,
                            accepted: editTask.accepted
                        }, editTask._id
                    ).then(
                        (res) => {
                            const updatedTask = res.data;

                            vm.tasks = vm.tasks.map((task) => {
                                if (task._id === updatedTask._id) {
                                    return updatedTask;
                                }

                                return task;
                            });

                            vm.clearEdit();

                            vm.$toasted.success('Naloga je bila uspešno posodobljena', {
                                duration: 3000,
                                position: "bottom-center",
                            });
                        },
                        (error) => {
                            console.log(error);
                        })

                }
            },
            acceptOrRejectStory() {
                const vm = this;

                const updateObject = {};

                const editTask = vm.editTask;

                if (editTask.accepted) {
                    updateObject.assignee = null;
                    updateObject.accepted = false;
                } else {
                    updateObject.assignee = vm.$store.getters.currentUser._id;
                    updateObject.accepted = true;
                }

                APICalls.updateUserTask(updateObject, vm.editTask._id)
                    .then(
                        (res) => {
                            const updatedTask = res.data;

                            vm.tasks = vm.tasks.map((task) => {
                                if (task._id === updatedTask._id) {
                                    return updatedTask;
                                }

                                return task;
                            });

                            vm.clearEdit();

                            vm.editTask.activeHours = updatedTask.activeHours;
                            vm.editTask.activeHoursAssignee = updatedTask.activeHoursAssignee;

                            vm.$toasted.success('Naloga je bila uspešno posodobljena', {
                                duration: 3000,
                                position: "bottom-center",
                            });
                        },
                        (error) => {
                            console.log(error);
                        })
            },
            clearEdit() {
                this.editTask = {
                    description: '',
                    time: ''
                };

                this.editingTask = false;
            },
            changeTask(task) {
                const clonedTask = JSON.parse(JSON.stringify(task));

                this.editTask = clonedTask;

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
                    });

                this.clearEdit();

            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            },
            async setTaskActiveStatus() {
                const vm = this;

                await APICalls.setActive(vm.editTask._id)
                    .then((res) => {
                        const task = res.data;
                        console.log(task);

                        vm.editTask.active = task.active;

                        vm.$toasted.success(`${vm.editTask.active ? 'Naloga je sedaj aktivna, čas se beleži' : 'Naloga je sedaj neaktivna, čas se več ne beleži'}`, {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    })
                    .catch((ex) => {
                        console.log(ex);
                        vm.$toasted.error('Pri zagonu beleženja časa je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    });

                //vm.editTask.active = !vm.editTask.active;

                await APICalls.updateUserTask({active: vm.editTask.active}, vm.editTask._id)
                    .then((res) => {
                        const updatedTask = res.data;

                        vm.tasks = vm.tasks.map((task) => {
                            if (task._id === updatedTask._id) {
                                return updatedTask;
                            }

                            return task;
                        });

                        /*

                        vm.$toasted.success(`${vm.editTask.active ? 'Naloga je sedaj aktivna' : 'Naloga je sedaj neaktivna'}`, {
                            duration: 3000,
                            position: "bottom-center",
                        });

                        */

                        /*

                        let totalTime = 0;

                        for (let i = 0; i < res.data.activities.length; i++) {
                            let activity = res.data.activities[i];
                            if (activity.user.toString() === res.data.assignee.toString()) {
                                totalTime += activity[i].activeHours;
                            }
                        }

                        console.log("~705, total time", totalTime);

                        vm.editTask.activeHours = totalTime;

                        */

                        vm.editTask.activeHours = updatedTask.activeHours;
                        vm.editTask.activeHoursAssignee = updatedTask.activeHoursAssignee;
                    })
                    .catch((ex) => {
                        console.log(ex);

                        vm.editTask.active = !vm.editTask.active;

                        vm.$toasted.error('Pri posodabljanju naloge je prišlo do napake', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    });

                console.log("708, vm.editTask._id", vm.editTask._id);

            }
        },
        computed: {
            unassignedTasks() {
                //task is treated as unassigned if it has no assignee
                if (this.tasks) {
                    return this.tasks.filter(function (task) {
                        return !task.assignee;
                    })
                }
            },
            assignedTasks() {
                //for now task is treated as assigned as soon as user is assigned - later user must accept task in order to be treated as assigned (add accepted flag)
                if (this.tasks) {
                    return this.tasks.filter(function (task) {
                        return task.assignee !== null && !task.active;
                    })
                }
            },
            activeTasks() {
                //task is treated as active if it is assigned and is marked as 'in_progress'
                if (this.tasks) {
                    return this.tasks.filter(function (task) {
                        return task.assignee && task.active;
                    })
                }
            },
            finishedTasks() {
                //task is treated as finished if it is assigned and is marked as 'finished'
                if (this.tasks) {
                    return this.tasks.filter(function (task) {
                        return task.assignee && task.finished;
                    })
                }
            },
            projectUsers() {
                let projectData = this.$store.getters.editingProject;

                return projectData.users;
            },
            canEditUserStories() {
                let projectData = this.$store.getters.editingProject;

                let currentUser = this.$store.getters.currentUser;

                let userInProject = projectData.users.find(function (user) {
                    return user.user._id === currentUser._id;
                });

                return userInProject.role.includes('scrum_master') || userInProject.role.includes('product_owner');
            },
            canEditTasks() {
                let projectData = this.$store.getters.editingProject;

                let currentUser = this.$store.getters.currentUser;

                let userInProject = projectData.users.find(function (user) {
                    return user.user._id === currentUser._id;
                });

                return userInProject.role.includes('scrum_master') || userInProject.role.includes('developer');
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
                this.selectBusinessValue = this.story.businessValue;
                this.storyFinished = this.story.done;
                this.editExisting = this.fullEdit;
                if (this.story._id) {
                    APICalls.getTasksInsideCurrentStory(this.story._id).then(
                        (rs) => {
                            this.tasks = rs.data;

                            /*

                            for (let i = 0; i < this.tasks.length; i++) {
                                let currentTask = this.tasks[i];

                                console.log("currentTask.activities", currentTask.activities);

                                let totalTimeUser = 0;
                                //let totalTime = 0;

                                for (let j = 0; j < currentTask.activities.length; j++) {
                                    let activity = currentTask.activities[j];

                                    //totalTime += activity.activeHours;

                                    console.log("activity.activeHours", activity.activeHours);

                                    console.log("activity.user.toString(), currentTask.assignee.toString()", activity.user.toString(), currentTask.assignee.toString());

                                    if (activity.user.toString() === this.$store.getters.currentUser._id.toString()) {
                                        totalTimeUser += activity.activeHours;
                                    }
                                }

                                console.log("~846, total time", totalTimeUser);

                                this.tasks[i].activeHours = totalTimeUser;
                                //this.tasks[i].activeHoursAll = totalTime;
                            }

                             */

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