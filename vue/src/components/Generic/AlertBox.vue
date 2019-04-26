<template>
    <div>
        <v-alert v-if="isSuccess === 1"
                 color="#AACE25"
                 :value="true"
                 :type="alertType"
                 @click="closeAlert"
                 dismissible
        >
            <span>{{computedMsg}}</span>
        </v-alert>
        <v-alert v-if="isSuccess === 2"
                 color="#E53849"
                 :value="true"
                 :type="alertType"
                 @click="closeAlert"
                 dismissible
        >
            <span>{{computedMsg}}</span>
        </v-alert>
    </div>

</template>

<script>
    export default {
        name: 'MyAlert',
        props: {
            isSuccess: Number,
            msg: String

        },
        created: function(){
            this.alertType = this.isSuccess === 1 ? 'success' : 'error';
        },
        watch: {
            isSuccess: function(newVal, oldVal) {
                this.alertType = newVal === 1 ? 'success' : 'error';
            }
        },
        data() {
            return {
                success: 'success',
                error: 'error',
                alertType: null
            }
        },
        methods: {
            closeAlert(){
                this.$emit('closeAlert');
            }
        },
        computed: {
            computedMsg: function(){
                const constMsgString = this.isSuccess === 1 ? 'success' : 'error';
                return this.msg;
            }
        }
    }
</script>

<style scoped>
</style>