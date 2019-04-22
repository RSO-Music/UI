<template>
	<v-layout row mb-4 class="divider-wrapper">
		<v-flex xs3>
			<span>{{ title }}</span>
		</v-flex>
		<v-flex xs9 class="divider-wrapper" mt-3>
			<v-divider></v-divider>
		</v-flex>
	</v-layout>
</template>
<script>
	export default {
		name: 'Separator',
		props: {
			title: String
		}
	}
</script>
<style lang="scss" scoped>
	.divider-wrapper {
		display: flex;
		text-align: center;
	}
</style>