<template>
    <div id="projectWrapper">
        <v-card class="adminProjectCard" v-for="sprint in sprintsList" :key="sprint._id">
            <div class="adminpName">
                <v-layout>
                    <v-flex xs9>
                        <p>{{sprint.name}}</p>
                        <p>{{sprint.startDate}}</p>
                        <p>{{sprint.endDate}}</p>
                    </v-flex>
                    
                    <v-flex xs3>
                        <ButtonOutline msg="Uredi" @clicked="editSprint(sprint)"></ButtonOutline>
                    </v-flex>
                </v-layout>
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
        name: "SprintsList",
        components: { ButtonOutline, ButtonBase, MyButton },
        data() {
            return {
                sprintsList: []
            }
        },
        mounted() {
            const vm = this;

            vm.reloadData();
        },
        methods: {
            editSprint(sprint) {
                this.$emit('editSprint', sprint);
            },

            reloadData() {
                const vm = this;

                APICalls.getProjectSprints(vm.$route.params.projectId).then(
                    (res) => {
                        vm.sprintsList = res.data;
                    },
                    (error) => {
                        console.log('An error occured while fetching sprints');
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