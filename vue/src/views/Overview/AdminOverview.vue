<template>
	<v-layout align-center justify-center row fill-height>
		<overview-card icon="person" :msg="countUsers" location="/admin/userManagement"></overview-card>
		<overview-card icon="developer_board" :msg="countProjects" location="/admin/projectManagement"></overview-card>
	</v-layout>
</template>
<script>
	import { APICalls } from "../../utils/apiCalls";
	import OverviewCard from "../../components/Generic/OverviewCard";
	export default {
		components: {OverviewCard}, name: 'AdminOverview',
		data () {
			return {
				nbOfProjects: 0,
				nbOfUsers: 0,
			}
		},
		created () {
			APICalls.getProjectsList().then(
				(rs) => {
					this.nbOfProjects = rs.data.length;
				},
				(error) => {
				}
			);

			APICalls.getUsersListNoAdmin().then(
				(rs) => {
					this.nbOfUsers = rs.data.length;
				},
				(error) => {
				}
			);
		},
		computed: {
			countProjects() {
				let label = 'projektov';

				switch (this.nbOfProjects) {
					case 1:
						label = 'projekt';
						break;

					case 2:
						label = 'projekta';
						break;

					case 3:
					case 4:
						label = 'projekti';
						break;

					default:
						break;
				}

				return `${this.nbOfProjects} ${label}`;
			},
			countUsers() {
				let label = 'uporabnikov';

				switch (this.nbOfUsers) {
					case 1:
						label = 'uporabnik';
						break;

					case 2:
						label = 'uporabnika';
						break;

					case 3:
					case 4:
						label = 'uporabniki';
						break;

					default:
						break;
				}

				return `${this.nbOfUsers} ${label}`;
			}
		}
	}
</script>
<style>
	.icon-card-wrapper {
		background-color: #3093a0;
		color: white;
	}
</style>