<template>
    <div class="contentWrapper list-wrapper">
        <v-layout>
            <v-flex xs4 list>
                <h1 class="text-uppercase text-xs-center">Pretekli Sprinti</h1>

                <SprintsList :sprints="sprintsList" :isLoaded="loaded.sprintsList" :isFinishedSprintsList="true" @editSprint="setSprintToEdit"/>
            </v-flex>

            <v-flex xs8 ml-4>
                <FinishSprintEdit ref="finishSprintEdit" v-if="sprintToFinish" :sprintToFinish="sprintToFinish"
                                  @sprintFinished="onSprintFinished"></FinishSprintEdit>
                <v-layout mt-4 v-else column>
                    <h2 class="mb-4">Na tem zaslonu so prikazani vsi Sprinti, ki so se končali, ampak še niso bili
                        zaključeni.</h2>
                    <h2 class="mb-4">Preglejte vse uporabniške zgodbe in jih potrdite ali zavrzite. Ko boste obdelali
                        vse zgodbe, se bo Sprint samodejno zaključil.</h2>
                    <h2 class="mb-4">Zavržene uporabniške zgodbe se bodo dodale nazaj k nedodeljenim zgodbam.</h2>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import SprintForm from "../../../../components/Custom/SprintForm";
    import SprintsList from "../../../../components/Generic/SprintsList";
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    import { APICalls } from "../../../../utils/apiCalls";
    import FinishSprintEdit from "./FinishSprintEdit";

    export default {
        name: 'FinishSPrints',
        components: {
            FinishSprintEdit,
            ButtonBase,
            SprintsList,
            SprintForm
        },
        data() {
            return {
                sprintsList: [],
                loaded: {
                    sprintsList: false
                },
                sprintToFinish: null
            }
        },
        mounted() {
            this.reloadSprints();
        },
        methods: {
            onSprintFinished() {
                this.sprintToFinish = null;

                this.reloadSprints();
            },

            reloadSprints() {
                const vm = this;
                
                vm.loaded.sprintsList = false;

                APICalls.getUnfinishedSprints(vm.$route.params.projectId)
                    .then(
                        (res) => {
                            vm.sprintsList = res.data;
                        },
                        (error) => {
                            console.log('An error occured while fetching sprints');
                        }
                    )
                    .finally(() => {
                        vm.loaded.sprintsList = true;
                    });
            },

            setSprintToEdit(sprintData) {
                const sprintToFinish = JSON.parse(JSON.stringify(sprintData));

                if (this.$refs.finishSprintEdit) {
                    this.$refs.finishSprintEdit.setSprintToFinish(sprintToFinish);
                } else {
                    this.sprintToFinish = sprintToFinish;
                }
            }
        }
    }
</script>
