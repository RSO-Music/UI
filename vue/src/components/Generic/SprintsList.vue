<template>
    <div id="projectWrapper">
        <template v-if="sprints && sprints.length">
            <v-card class="adminProjectCard" v-for="sprint in sprints" :key="sprint._id">
                <div class="adminpName">
                    <v-layout>
                        <v-flex xs9>
                            <h2 class="mb-1 black--text">{{sprint.name}}</h2>
                            <p>{{sprint.startDate | moment('DD. MM. YYYY')}} - {{sprint.endDate | moment('DD. MM. YYYY')}}</p>
                        </v-flex>

                        <v-flex xs3>
                            <v-layout justify-end>
                                <ButtonOutline msg="Uredi" @clicked="editSprint(sprint)"></ButtonOutline>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </div>
            </v-card>
        </template>
        <h2 v-else class="backlog-empty-text text-xs-center full-width">Ni Sprintov</h2>
    </div>
</template>

<script>
    import ButtonBase from "./ButtonBase";
    import ButtonOutline from "./ButtonOutline";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "SprintsList",
        components: { ButtonOutline, ButtonBase },
        props: {
            sprints: Array
        },
        methods: {
            editSprint(sprint) {
                this.$emit('editSprint', sprint);
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