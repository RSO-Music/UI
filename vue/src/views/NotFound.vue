<template>
    <div class="services">
        <h1>{{title}}</h1>
        <p>
            Page not found, error 404
        </p>
        <button-base msg="GO BACK" @clicked="goBack"></button-base>
    </div>
</template>
<script>
	import ButtonBase from "../components/Generic/ButtonBase";

    export default{
        name:'notFound',
		components: {ButtonBase},
        data (){
            return{
                title:'page not found'
            }
        },
		methods: {
			goBack: function () {
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
