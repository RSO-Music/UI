<template>
    <v-container fluid class="wrapper">
        <div id="toolbar">
            <div id="topBarLeft">
                <router-link :to="{ name: 'home'}" id="smrpoName">SCRUMMY</router-link>
            </div>
            <div id="topBarRight">
                <div id="userText">
                    <p id="userName">{{displayUser}}</p>
                    <p id="userRole">{{displayRole}}</p>
                </div>
                <ButtonBase id="logoutBtn" @clicked="logout" msg="ODJAVA"></ButtonBase>
            </div>
        </div>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-container>
</template>

<script>
    import {APICalls} from "../../utils/apiCalls";
    import ButtonBase from "../../components/Generic/ButtonBase";

    export default {
        name: 'home',
        components: {
            ButtonBase
        },
        created() {
        	this.loggedInUser = this.$store.getters.currentUser;
        },
        data: () => ({
            loggedInUser: {}
        }),

        methods: {
            logout() {
				this.$store.commit('logout');
            }
        },
        computed: {
            displayUser: function () {
                return this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;
            },
            displayRole: function () {
            	return this.loggedInUser.isAdmin ? 'ADMIN' : 'USER';
            }
        }
    }
</script>
<style scoped>
    .wrapper {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    #toolbar {
        background-color: #2E354C;
        padding: 5px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #topBarLeft {
        align-content: center;
    }

    #smrpoName {
        font-size: 20px;
        color: white;
        text-transform: uppercase;
        font-weight: bolder;
        text-decoration: none;
        margin: 0 auto;
        padding: 15px;
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
        text-transform: uppercase;
    }

    #userRole {
        color: #A0A6B2;
        text-transform: lowercase;
    }
</style>
