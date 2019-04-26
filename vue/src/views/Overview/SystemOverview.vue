<template>
	<div class="contentWrapper">
		<h1>Pozdravljeni v programu SCRUMMY!</h1>
		<v-layout align-center justify-center row>
			<v-flex xs12 md8 class="overview-card-wrapper">
				<v-card class="user-data-card border-top">
					<h2 class="user-overview-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
					<h2>{{ currentUser.email }}</h2>
					<h2>{{ getUserRole }}</h2>
				</v-card>
			</v-flex>
		</v-layout>
		<admin-overview v-if="isAdmin"></admin-overview>
		<user-overview v-else></user-overview>
	</div>
</template>
<script>
	import AdminOverview from "./AdminOverview";
	import UserOverview from "./UserOverview";

	export default {
		components: {AdminOverview, UserOverview}, name: 'SystemOverview',
		data () {
			return {
				currentUser: {}
			}
		},
		created () {
			this.currentUser = this.$store.getters.currentUser;
		},
		computed: {
			isAdmin() {
				return this.$store.getters.currentUser.isAdmin;
			},
			getUserRole() {
				return this.$store.getters.currentUser.isAdmin ? 'Admin' : 'User';
			}
		}
	}
</script>
<style lang="scss">
	.user-data-card {
		flex-basis: 32%;
		margin: 10px 0;
		border-radius: 4px;
		padding: 20px !important;
	}

	.user-overview-name {
		font-weight: bold;
		font-size: 30px;
	}

	.overview-card-wrapper {
		height: 100% !important;
		padding: 30px !important;
	}
</style>