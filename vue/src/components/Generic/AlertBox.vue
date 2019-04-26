<template>
    <v-alert v-if="message"
             :value="true"
             :type="type"
             @click="closeAlert"
             dismissible
    >
        <span>{{message}}</span>
    </v-alert>
</template>

<script>
    export default {
        name: 'AlertBox',
        
        props: {
            message: String,
            type: String
        },
        
        methods: {
            closeAlert() {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
</style>