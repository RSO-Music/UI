<template>
    <div id="wrapper">
        <div class="loginContainer">
            <h1>Prijava v sistem</h1>
            <MyAlert class="smaller" :msg="msg" :isSuccess="isSuccess" @closeAlert="closeAlert"></MyAlert>
            <UserMainForm id="mainLogin" @loginSubmit="loginSubmit"/>
        </div>
    </div>
</template>

<script>
    import { APICalls } from "../utils/apiCalls.js";
    import UserMainForm from "../components/Custom/UserMainForm";
    import MyAlert from "../components/Generic/AlertBox";

    export default {
        name: 'userLogin',
        created(){
        },
        components: {
            MyAlert,
            UserMainForm
        },
        data: () => ({
            isSuccess: 0,
            msg: ''
        }),
        methods: {

            loginSubmit(objLogin) {
            	let vm = this;

                APICalls.loginUser(objLogin).then(
                    (res) => {
                        this.msg = 'Prijava uspešna';
                        this.isSuccess = 1;

						vm.$store.commit('login', res.data);
						vm.$router.push('/');
                    },
                    (error) => {
                        this.msg = 'Prijava neuspešna';
                        this.isSuccess = 2;
                    }
                );
            },
            closeAlert() {
                this.isSuccess = 1;
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