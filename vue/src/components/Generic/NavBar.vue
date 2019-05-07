<template>
    <header>
        <nav id="toolbar">
            <v-layout>
                <v-flex shrink>
                    <router-link :to="{ name: 'dashboard'}" class="application-name">
                        SCRUMMY
                    </router-link>
                </v-flex>

                <v-flex v-if="$store.getters.editingProject" shrink mx-1>
                    <v-layout fill-height align-center>
                        <v-icon color="white">keyboard_arrow_right</v-icon>
                    </v-layout>
                </v-flex>

                <v-flex v-if="$store.getters.editingProject" shrink>
                    <div class="application-name">
                        {{$store.getters.editingProject.name}}
                    </div>
                </v-flex>
            </v-layout>
            <div id="topBarRight">
                <div id="userText">
                    <p id="userName">{{displayName}}</p>
                    <p id="userRole">{{displayRole}}</p>
                </div>
                <ButtonBase id="logoutBtn" @clicked="logoutModal = true" msg="ODJAVA"></ButtonBase>
            </div>
        </nav>

        <v-dialog
                v-model="logoutModal"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Odjava</v-card-title>

                <v-card-text>
                    Ste prepričani, da se želite odjaviti?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            flat="flat"
                            @click="logoutModal = false"
                    >
                        Prekliči
                    </v-btn>
                    
                    <ButtonBase
                            msg="Odjava"
                            @clicked="logout()"
                    />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </header>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";

    import { mapGetters } from 'vuex'

    export default {
        name: 'home',
        components: {
            ButtonBase
        },

        data() {
            return {
                currentUser: this.$store.getters.currentUser,
                logoutModal: false
            }
        },

        methods: {
            logout() {
                this.logoutModal = false;
                
                this.$store.commit('logout');
            }
        },

        computed: {
            displayName() {
                const vm = this;

                let name = vm.currentUser.firstName;

                if (vm.currentUser.lastName) {
                    name += ` ${vm.currentUser.lastName}`;
                }

                return name;
            },

            displayRole() {
                return this.currentUser.isAdmin ? 'ADMINISTRATOR' : 'UPORABNIK';
            }
        }
    }
</script>

<style scoped>
    header {
        height: 72px;
        width: 100%;
        z-index: 1;
    }

    #toolbar {
        background-color: #2E354C;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        width: 100%;
        position: fixed;
        z-index: 10;
    }

    #topBarLeft {
        align-content: center;
    }

    .application-name {
        font-size: 20px;
        color: white;
        text-transform: uppercase;
        text-decoration: none;
        margin: 0 auto;
        padding: 0 15px;
    }

    #topBarRight {
        flex-shrink: 0;
        color: #161719;
        padding: 10px 30px 10px 10px;
        height: 70px;
        display: flex;
        align-items: center;
    }

    #userText {
        text-align: right;
        padding-right: 20px;
        border-right: 1px solid white;
    }

    #logoutBtn {
        margin-left: 20px;
    }

    #userName {
        font-size: 18px;
        font-weight: 700;
        color: #A2E0E0;
    }

    #userRole {
        color: #A0A6B2;
    }
</style>
