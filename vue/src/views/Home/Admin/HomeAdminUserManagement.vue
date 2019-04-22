<template>
    <div class="contentWrapper">
        <MyAlert class="smaller" :msg="msg" :isSuccess="isSuccess" @closeAlert="closeAlert"/>
        <div class="formContainer">
            <UserManagementForm @adminAddUser = adminAddUser />
        </div>
    </div>
</template>

<script>
    import UserManagementForm from "../../../components/Custom/UserManagementForm";
    import MyAlert from "../../../components/Generic/AlertBox";
    import {APICalls} from "../../../utils/apiCalls";

    export default {
        name: 'homeAdminUserManagement',
        components: {
            MyAlert,
            UserManagementForm
        },
        data () {
            return {
                isSuccess: 0, // 0 -> nothing has happened(neutral), 1 -> success adding, 2-> error adding
                msg: ''
            }
        },
        methods: {
            adminAddUser(newUserObj) {
            	let vm = this;

                APICalls.addNewUser(newUserObj).then(
                    (rs) => {
                        this.isSuccess = 1;
                        this.msg = 'Uporabnik je bil uspešno dodan';
                    },
                    (error) => {
                        this.isSuccess = 2;
                        this.msg = 'Uporabnik že obstaja';
                    }
                );
            },
            closeAlert() {
                this.isSuccess = 0;
                this.msg = '';
            }
        }
    }
</script>
