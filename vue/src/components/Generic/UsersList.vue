<template>
    <div id="projectWrapper">
        <v-card class="adminProjectCard" v-for="user in usersList" :key="user._id">
            <div class="adminpName">
                <p>{{`${user.firstName} ${user.lastName ? user.lastName : ''}`}}</p>
                <ButtonOutline msg="Uredi" @clicked="editUser(user)"></ButtonOutline>
            </div>
        </v-card>
    </div>
</template>

<script>
    import MyButton from "./Button";
    import ButtonBase from "./ButtonBase";
    import ButtonOutline from "./ButtonOutline";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "UsersList",
        components: { ButtonOutline, ButtonBase, MyButton },
        data() {
            return {
                usersList: []
            }
        },
        mounted() {
            const vm = this;
            
            vm.reloadData();
        },
        methods: {
            editUser(user) {
                this.$emit('editUser', user);
            },
            
            reloadData() {
                const vm = this;
                
                APICalls.getUsersList().then(
                    (res) => {
                        vm.usersList = res.data;
                    },
                    (error) => {
                        console.log('An error occured while fetching users');
                    }
                );
            }
        }
    }
</script>

<style scoped>
    #projectWrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .userProjectCard {
        flex-basis: 32%;
        padding: 20px;
        margin: 10px 0;
        border-top: 5px solid #A2E0E0;
        border-radius: 2px;
    }

    .adminProjectCard {
        width: 100%;
        padding: 20px;
        margin: 10px 0;
        border-left: 5px solid #A2E0E0;
        border-radius: 2px;
    }

    .pName {
        padding: 10px;
        border: 1px solid #A0A6B2;
        border-radius: 2px;
        margin-top: 5px;
        margin-bottom: 20px;
        display: flex;
    }

    .pName p {
        text-transform: uppercase;
        font-weight: bold;
        display: inline;
        align-self: center;
        padding-left: 10px;
    }

    .adminpName {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .adminpName p {
        font-weight: bold;
    }
</style>