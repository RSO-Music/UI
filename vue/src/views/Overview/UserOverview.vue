<template>
		<v-layout align-center justify-center row fill-height>
			<overview-card icon="developer_board" :msg="countProjects" location="/user"></overview-card>
		</v-layout>
</template>
<script>
	import { APICalls } from "../../utils/apiCalls";
	import OverviewCard from "../../components/Generic/OverviewCard";

	export default {
		name: 'User',
		components: {OverviewCard},
		data () {
			return {
				nbOfProjects: 0
			}
		},
		created () {
			APICalls.getProjectBasedOnUserId(this.$store.getters.currentUser._id).then(
				(rs) => {
					this.nbOfProjects = rs.data.length;
				},
				(error) => {
				}
			);
		},
		computed: {
			countProjects() {
				let projectLabel = 'projektov';

				switch (this.nbOfProjects) {
					case 1:
						projectLabel = 'projekt';
						break;

					case 2:
						projectLabel = 'projekta';
						break;

					case 3:
					case 4:
						projectLabel = 'projekti';
						break;

					default:
						break;
				}

				return `${this.nbOfProjects} ${projectLabel}`;
			}
		}
	}
</script>