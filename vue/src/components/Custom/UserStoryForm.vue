<template>
    <div class="formContainer">
        <v-form
                class="formWrapper"
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <h1>NEW USER STORY</h1>
			<v-tabs
				fixed-tabs
			>
				<v-tab key="1">
					Osnovni podatki
    			</v-tab>
				<v-tab key="2">
					Naloge
    			</v-tab>
				<v-tab-item key="1">
					<v-text-field
							color="#3093A0"
							prepend-icon="rate_review"
							label="Name"
							:rules="[v => !!v || 'Story name required']"
							v-model="storyName"
							required
					></v-text-field>
					<div id="storyWrapper">
						<div id="storyDropdowns">
							<v-select
									color="#3093A0"
									prepend-icon="label_important"
									v-model="selectPriority"
									:items="storyPriority"
									:rules="[v => !!v || 'Priority is required']"
									label="Priority"
									hide-details
									required
							></v-select>
							<v-select
									color="#3093A0"
									prepend-icon="loyalty"
									v-model="selectBussinessValue"
									:items="storyValue"
									:rules="[v => !!v || 'Bussiness value is required']"
									label="Bussiness value"
									hide-details
									required
							></v-select>
							<v-text-field
									color="#3093A0"
									prepend-icon="access_time"
									type="number"
									min="0"
									label="Časovna ocena"
									v-model="timeEstimation"
							></v-text-field>
						</div>
						<v-textarea
								color="#3093A0"
								id="storyDesc"
								label="Story Description"
								v-model="storyDescription"
								:rules="[v => !!v || 'Story description required']"
								required
						></v-textarea>
					</div>
					<v-textarea
							color="#3093A0"
							label="Acceptance Tests"
							v-model="storyAcceptanceTests"
							:rules="[v => !!v || 'Story acceptance tests required required']"
							rows="1"
							required
					></v-textarea>
					<v-divider></v-divider>
				</v-tab-item>
				<v-tab-item key="2">
					<p>Naloge</p>
					<v-layout row>
						<v-flex xs5>
							<v-textarea
									color="#3093A0"
									prepend-icon="assignment"
									rows="1"
									label="Task description"
									v-model="editTask.description"
							></v-textarea>
						</v-flex>
						<v-flex xs1>
							<v-text-field
									id="taskSpeed"
									color="#3093A0"
									prepend-icon="timer"
									label="Expected hours"
									type="number"
									v-model="editTask.time"
							></v-text-field>
						</v-flex>
						<v-flex xs2>
							<v-select
									color="#3093A0"
									prepend-icon="person"
									v-model="editTask.asignee"
									label="Uporabniška vloga"
									hide-details
									required
									flat
							></v-select>
						</v-flex>
						<v-flex xs2>
							<v-select
									color="#3093A0"
									v-model="editTask.status"
									:items="taskStatus"
									item-text="name"
									item-value="value"
									label="Uporabniška vloga"
									hide-details
									required
									flat
							></v-select>
						</v-flex>
						<v-flex xs1 offset-xs1>
							<ButtonOutline msg="+" @clicked="addTask" v-if="!editingTask"></ButtonOutline>
							<ButtonOutline msg="Prekliči" @clicked="clearEdit" v-else></ButtonOutline>
						</v-flex>
					</v-layout>
					<v-divider></v-divider>
					<separator title="Nedodeljene naloge"></separator>
					<task-card v-for="(task, index) in unassignedTasks" :task="task" @editTask="changeTask" @deleteTask="deleteTask" :key="id"/>
					<separator title="Dodeljene naloge"></separator>
					<task-card v-for="(task, index) in assignedTasks" :task="task" @editTask="changeTask" @deleteTask="deleteTask" :key="id"/>
					<separator title="Aktivne naloge"></separator>
					<task-card v-for="(task, index) in activeTasks" :task="task" @editTask="changeTask" @deleteTask="deleteTask" :key="id"/>
					<separator title="Zaključene naloge"></separator>
					<task-card v-for="(task, index) in finishedTasks" :task="task" @editTask="changeTask" @deleteTask="deleteTask()" :key="id"/>
					<v-divider class="mb-3"></v-divider>
				</v-tab-item>
			</v-tabs>
            <ButtonBase :disabled="!valid" msg="Add User Story" @clicked="addSStory"></ButtonBase>
        </v-form>
    </div>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
	import UserTaskForm from "./UserTaskForm";
	import ButtonOutline from "../Generic/ButtonOutline";
	import Separator from "../Generic/Separator";
	import TaskCard from "../Generic/TaskCard";
    export default {
        name: "UserStoryForm",
        components: {TaskCard, Separator, ButtonOutline, UserTaskForm, ButtonBase},
        data: () => ({
            valid: true,
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
            	id: '',
            	description: '',
                time: '',
                asignee: '',
                status: ''
            },
            editingTask: false
        }),
        methods: {
            addSStory () {
                if (this.$refs.form.validate()) {
                    this.$emit('addUserStory', {
                        name: this.storyName,
                        description: this.storyDescription,
                        priority: this.selectPriority,
                        businessValue: this.selectBussinessValue,
                        acceptanceTests: this.storyAcceptanceTests,
                        timeEstimation: this.timeEstimation,
                        done: false
                    });
                    this.resetForm();
                } else {
                    this.valid = false;
                }
            },
            addTask () {
            	console.log(this.tasks);
            	if (this.editTask.description !== '' && this.editTask.time > 0) {
            		this.editTask.id = this.generateRandom();
            		this.tasks.push(this.editTask);
				}

            	this.clearEdit();
            },
            clearEdit () {
				this.editTask = {
					id: '',
					description: '',
					time: '',
					asignee: ''
				};

				this.editingTask = false;
            },
            changeTask (task) {
            	console.log(task);

            	this.editTask = task;
            	this.editingTask = true;
            },
            deleteTask (deleteTask) {
            	this.tasks = this.tasks.filter(function (task) {
                    return task.id !== deleteTask.id
				})
            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            },
            generateRandom() {
					return new Date().getTime().toString() + Math.floor(Math.random()*1000000);
            }
        },
        computed: {
        	//TODO: add users logic
            unassignedTasks() {
                return this.tasks.filter(function (task) {
                    return !task.asignee && task.status === 'new'
				})
			},
			assignedTasks() {
				return this.tasks.filter(function (task) {
					return task.asignee && task.status === 'new'
				})
			},
			activeTasks() {
				return this.tasks.filter(function (task) {
					return task.status === 'in_progress'
				})
			},
			finishedTasks() {
				return this.tasks.filter(function (task) {
					return task.status === 'finished'
				})
			}
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