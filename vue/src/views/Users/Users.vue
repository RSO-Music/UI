<template>
    <h1>Hello</h1>
</template>

<script>
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: 'Users',
        mounted() {
            APICalls.getUsersList().then(
                (res) => {
                    console.log(res);
                },
                (error) => {

                }
            );
        }
    }
</script>

<style>
    
</style>