<template>
    <div id="wrapper">
        <div class="loginContainer">
                <v-layout column>
                <h1>Prijava v sistem</h1>

                <UserMainForm id="mainLogin" @loginSubmit="loginSubmit"/>
            </v-layout>

            <AlertBox :message="alert.message" :type="alert.type" @close="closeAlert"></AlertBox>
        </div>
    </div>
</template>

<script>
    import { APICalls } from "../utils/apiCalls.js";
    import UserMainForm from "../components/Custom/UserMainForm";
    import AlertBox from "../components/Generic/AlertBox";

    export default {
        name: 'userLogin',
        created() {
        },
        components: {
            AlertBox,
            UserMainForm
        },
        data() {
            return {
                alert: {
                    type: '',
                    message: ''
                }
            };
        },
        methods: {
            loginSubmit(objLogin) {
                const vm = this;

                APICalls.loginUser(objLogin).then(
                    (res) => {
                        vm.$store.commit('login', res.data);
                        
                        vm.$router.push('/');
                    },
                    (error) => {
                        vm.alert = {
                            type: 'error',
                            message: 'Prijava je bila neuspešna'
                        }
                    }
                );
            },
            
            closeAlert() {
                this.alert = {};
            }
        }
    }
</script>

<style scoped>
    #wrapper {
        background-color: white;
        background-image: url("../../public/img/icons/R-grafika.png");
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loginContainer {
        width: 30%;
        height: fit-content;
        background-color: #F6F6F7;
        border-radius: 3px;
        padding: 30px;
        border-top: 5px solid #A2E0E0;
    }

    h1 {
        text-align: center;
    }

    #mainLogin {
        padding: 10px 0;
    }
</style>