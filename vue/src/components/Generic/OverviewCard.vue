<template>
		<v-flex xs12 md4 class="text-xs-center overview-card-wrapper">
			<v-card class="overview-card" v-on:click="route">
				<v-layout row class="full-height">
					<v-flex xs4 class="full-height icon-card-wrapper">
						<v-icon class="card-icon">{{icon}}</v-icon>
					</v-flex>
					<v-flex xs8 class="full-height text-card-wrapper">
						<h2 class="card-text">{{msg}}</h2>
					</v-flex>
				</v-layout>
			</v-card>
		</v-flex>
</template>
<script>
	export default {
		name: 'OverviewCard',
		props: {
			icon: String,
			msg: String,
			location: String
		},
		methods: {
			route() {
				this.$router.push(this.location);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.overview-card-wrapper {
		height: 100% !important;
		padding: 30px !important;
		cursor: pointer !important;

		&:hover {
			transform: scale(1.05);
		}
	}
	.overview-card {
		flex-basis: 32%;
		margin: 10px 0;
		border-radius: 4px;
		height: 50%;
	}
	.icon-card-wrapper {
		background-color: #3093a0;
		color: white;
		display: flex;
	}
	.card-icon {
		color: white;
		width: 100%;
		font-size: 60px !important;
	}
	.text-card-wrapper {
		display: flex;
		align-items: center;
		text-align: center;
	}
	.card-text {
		width: 100%;
		font-size: 30px;
	}
</style>