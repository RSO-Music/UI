<template>
    <div id="toolbar">
        <div id="topBarLeft">
            <router-link :to="{ name: 'dashboard'}" id="smrpoName">SCRUMMY</router-link>
        </div>
        <div id="topBarRight">
            <div id="userText">
                <p id="userName">{{displayName}}</p>
                <p id="userRole">{{displayRole}}</p>
            </div>
            <ButtonBase id="logoutBtn" @clicked="logout" msg="ODJAVA"></ButtonBase>
        </div>
    </div>
</template>

<script>
    import ButtonBase from "../../components/Generic/ButtonBase";

    export default {
        name: 'home',
        components: {
            ButtonBase
        },
    
        data() {
            return {
                currentUser: this.$store.getters.currentUser
            }    
        },
        
        methods: {
            logout() {
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
    #toolbar {
        background-color: #2E354C;
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
    }

    #userRole {
        color: #A0A6B2;
    }
</style>
