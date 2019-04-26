<template>
	<div class="services">
		<h1>{{title}}</h1>
		<p>
			You do not have permissions to view this page
		</p>
		<button-base msg="GO BACK" @clicked="goBack"></button-base>
	</div>
</template>
<script>
	import ButtonBase from "../components/Generic/ButtonBase";

	export default{
		name: 'notAllowed',
		components: {ButtonBase},
		data (){
			return{
				title:'page not allowed'
			}
		},
		methods: {
			goBack() {
				this.$router.back();
			}
		}
	}
</script>
<style scoped>
	.services {
		height: 100%;
		display: flex;
		align-items: center;
		text-align: center;
		flex-direction: column;
	}
</style>