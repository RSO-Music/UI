<template>
    <div id="projectWrapper">
        <template v-if="sprints && sprints.length">
            <v-layout v-if="categorize">
                <v-flex xs12>
                    <v-layout column mt-2>
                        <separator title="Aktivni Sprint"></separator>

                        <SprintCard v-if="getActiveSprint" :sprint="getActiveSprint"
                                    @viewSprint="viewSprint(getActiveSprint)"></SprintCard>
                        <h2 v-else class="backlog-empty-text text-xs-center full-width">Ni aktivnega Sprinta</h2>

                    </v-layout>

                    <v-divider></v-divider>

                    <v-layout column>
                        <separator title="Prihodnji Sprinti"></separator>

                        <template v-if="getFutureSprints.length">
                            <SprintCard v-for="sprint in getFutureSprints" :key="sprint._id" :sprint="sprint"
                                        :editable="true"
                                        @editSprint="editSprint(sprint)"></SprintCard>
                        </template>
                        <h2 v-else class="backlog-empty-text text-xs-center full-width">Ni Sprintov v prihodnosti</h2>
                    </v-layout>

                    <v-divider></v-divider>

                    <v-layout column>
                        <separator title="Pretekli Sprinti"></separator>

                        <template v-if="getPastSprints.length">
                            <SprintCard v-for="sprint in getPastSprints" :key="sprint._id" :sprint="sprint"
                                        @viewSprint="viewSprint(sprint)"></SprintCard>
                        </template>
                        <h2 v-else class="backlog-empty-text text-xs-center full-width">Ni preteklih Sprintov</h2>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout v-else>
                <v-flex xs12>
                    <SprintCard v-for="sprint in sprints" :key="sprint._id" :sprint="sprint"
                                :editable="true"
                                @editSprint="editSprint(sprint)"></SprintCard>
                </v-flex>
            </v-layout>
        </template>
        <h2 v-else class="backlog-empty-text text-xs-center full-width">Ni Sprintov</h2>
    </div>
</template>

<script>
    import ButtonBase from "./ButtonBase";
    import ButtonOutline from "./ButtonOutline";
    import { APICalls } from "../../utils/apiCalls";
    import SprintCard from "./SprintCard";
    import Separator from "./Separator";

    export default {
        name: "SprintsList",
        components: { Separator, SprintCard, ButtonOutline, ButtonBase },
        props: {
            sprints: Array,
            categorize: Boolean
        },
        methods: {
            editSprint(sprint) {
                this.$emit('editSprint', sprint);
            },
            viewSprint(sprint) {
                this.$emit('viewSprint', sprint);
            }
        },
        computed: {
            getActiveSprint() {
                const vm = this;

                if (vm.sprints && vm.sprints.length) return vm.sprints.find((sprint) => {
                    const currentDate = vm.$moment();

                    return vm.$moment(sprint.startDate).isBefore(currentDate) && vm.$moment(sprint.endDate).isAfter(currentDate);
                });
            },

            getFutureSprints() {
                const vm = this;

                if (vm.sprints && vm.sprints.length) {
                    return vm.sprints.filter((sprint) => {
                        const currentDate = vm.$moment();

                        return vm.$moment(sprint.startDate).isAfter(currentDate);
                    });
                } else {
                    return [];
                }
            },

            getPastSprints() {
                const vm = this;

                if (vm.sprints && vm.sprints.length) {
                    return vm.sprints.filter((sprint) => {
                        const currentDate = vm.$moment();

                        return vm.$moment(sprint.endDate).isBefore(currentDate);
                    });
                } else {
                    return [];
                }
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
</style>