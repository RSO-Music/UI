<template>
    <div id="wrapper">
        <div class="login-background"></div>


        <v-card class="loginContainer slide-up">
            <v-layout column>
                <h1 class="login-application-name">Scrummy</h1>

                <h1>Prijava v sistem</h1>

                <v-form
                        ref="form"
                        lazy-validation
                        @submit.prevent="login"
                >
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="person"
                            class="inputField"
                            v-model="userData.username"
                            :rules="[v => !!v || 'Uporabniško ime ne sme biti prazno']"
                            label="Uporabniško ime"
                            required
                            :disabled="isLoggingIn"
                            focus
                            ref="usernameInput"
                    ></v-text-field>

                    <v-text-field
                            color="#3093A0"
                            prepend-icon="lock"
                            class="inputField"
                            :rules="[v => !!v || 'Geslo ne sme biti prazno']"
                            v-model="userData.password"
                            label="Geslo"
                            :type="'password'"
                            :disabled="isLoggingIn"
                            required
                    ></v-text-field>

                    <ButtonBase 
                            msg="Prijava" 
                            type="submit" 
                            :isLoading="isLoggingIn"
                    ></ButtonBase>
                </v-form>
            </v-layout>

            <AlertBox :message="alert.message" :type="alert.type" @close="closeAlert"></AlertBox>
        </v-card>
    </div>
</template>

<script>
    import { APICalls } from "../utils/apiCalls.js";
    import AlertBox from "../components/Generic/AlertBox";
    import ButtonBase from "../components/Generic/ButtonBase";

    export default {
        name: 'userLogin',
        created() {
        },
        components: {
            ButtonBase,
            AlertBox
        },
        data() {
            return {
                alert: {
                    type: '',
                    message: ''
                },
                userData: {
                    username: '',
                    password: ''
                },
                isLoggingIn: false
            };
        },
        mounted() {
            const vm = this;
            
            vm.$refs['usernameInput'].focus();
        },
        methods: {
            login() {
                const vm = this;

                if (!vm.$refs.form.validate()) {
                    return;
                }

                vm.isLoggingIn = true;

                APICalls.loginUser(vm.userData)
                    .then((res) => {
                        vm.$store.commit('login', res.data);

                        vm.$router.push('/');
                    })
                    .catch((ex) => {
                        console.log(ex);
                        
                        vm.alert = {
                            type: 'error',
                            message: 'Prijava je bila neuspešna'
                        }
                    })
                    .finally(() => {
                        vm.isLoggingIn = false;
                    });
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
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .login-background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 50%;
        background-color: #2E354C;
    }
    
    .login-application-name {
        z-index: 1;
        color: #ffffff;
        position: absolute;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
    }

    .loginContainer {
        max-width: 600px;
        width: 100%;
        margin: 10px;
        height: fit-content;
        background-color: #F6F6F7;
        border-radius: 3px;
        padding: 30px;
        border-top: 5px solid #A2E0E0;
        z-index: 1;
    }

    h1 {
        text-align: center;
    }

    #mainLogin {
        padding: 10px 0;
    }
</style>