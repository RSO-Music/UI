<template>
    <div class="contentWrapper">
        <div class="formContainer">
            <MyAlert class="smaller" :msg="msg" :is-success="isSuccess" @closeAlert="closeAlert"/>
            <SprintForm @addNewSprint="addNewSprint"/>
        </div>
    </div>
</template>

<script>
    import SprintForm from "../../../../components/Custom/SprintForm";
    import MyAlert from "../../../../components/Generic/AlertBox";
    import {APICalls} from "../../../../utils/apiCalls";
    export default {
        name: 'homeUserSprint',
        components: {
            MyAlert,
            SprintForm
        },
        data: () => ({
            isSuccess: 0,
            msg: ''
        }),
        methods: {
            addNewSprint(sprintObj) {
            	let vm = this;

                sprintObj['projectId'] = vm.$route.params.projectId;
                APICalls.createNewSprint(sprintObj).then(
                    (rs) => {
                        this.msg = 'Sprint je bil uspešno ustvajen';
                        this.isSuccess = 1
                    },
                    (error) => {
                        this.isSuccess = 2;
                        this.msg = 'V izbranem časovnem obdobju že obstaja drug sprint';
                    }
                );
            },
            closeAlert() {
                this.isSuccess = 0;
            }
        }
    }
</script>
