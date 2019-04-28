<template>
	<div v-if="task" class="storyTask">
		<div>
			<v-layout row>
				<v-flex xs2>
					<div id="cardUserName">
						<p>{{ getProperName(task.assignee) }}</p>
					</div>
				</v-flex>
				<v-flex xs2>
					<div id="cardDescription">
						<p>{{task.time}} h</p>
					</div>
				</v-flex>
				<v-flex xs2 >
					<div id="cardName">
						<p>{{task.description}}</p>
					</div>
				</v-flex>
				<v-flex xs2 >
					<v-btn flat color="#1C69C1" v-on:click="assignToMe" :disabled="task.assignee != null">
						Assign to me
					</v-btn>
				</v-flex>
				<v-flex xs1 offset-xs5>
					<v-btn flat icon color="#3093A0" v-on:click="editTask" :disabled="disabled">
						<v-icon>edit</v-icon>
					</v-btn>
				</v-flex>
				<v-flex xs1>
					<v-btn flat icon color="red" v-on:click="deleteTask" :disabled="disabled">
						<v-icon>clear</v-icon>
					</v-btn>
				</v-flex>
			</v-layout>
		</div>
	</div>
</template>

<script>
	import { APICalls } from "../../utils/apiCalls"

	export default {
		name: "TaskCard",
		props: {
			task: Object,
			disabled: Boolean
		},
		data: () => ({
			array: []
		}),
		methods: {
			editTask() {
				this.$emit('editTask', this.task)
			},
			deleteTask() {
				this.$emit('deleteTask', this.task)
			},
			getProperName(id) {
				const users = this.$store.getters.editingProject.users;
				for (let i = 0; i < users.length; i++) {
					let user = users[i];
					if (user.user._id === id) {
						return user.user.firstName + " " + user.user.lastName;
					}
				}
				return "unassigned"
			},
			assignToMe() {
				console.log(
						"storyId: " + this.task.storyId + " taskId: " + this.task._id
				);
				const task = {accepted: true, storyId: this.task.storyId, assignee: this.$store.getters.currentUser._id};
				console.log(task);
				APICalls.assignToMe(this.task.storyId, this.task._id, task).then(
						(res) => {
							this.$emit('assignToMe', this.task);
							this.$forceUpdate();
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

				if (this.task.asignee) {
					let editingProject = this.$store.getters.editingProject;

					let assignedUser = editingProject.users.find(function (u) {
						return u.user._id === vm.task.asignee;
					});

					if (assignedUser) return `${assignedUser.user.firstName} ${assignedUser.user.lastName}`;
				}
			}
		}
	}
</script>

<style scoped>
	.storyTask {
		background-color: white;
		border-radius: 4px;
		padding: 10px 10px 10px 20px;
		margin-bottom: 10px;
		border: 1px solid #A0A6B2;
		border-left: 8px solid #3093A0;
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