<template>
    <div class="contentWrapper list-wrapper">
        <v-layout>
            <v-flex xs4 list>
                <h1 class="text-uppercase text-xs-center">Seznam Sprintov</h1>

                <ButtonBase classes="full-width" msg="Ustvari nov Sprint" @clicked="addNewSprint"></ButtonBase>

                <SprintsList :sprints="sprintsList" :isLoaded="loaded.sprintsList" :categorize="true" @editSprint="setSprintToEdit"
                             @viewSprint="setSprintToView"/>
            </v-flex>

            <v-flex xs8 ml-4>
                <SprintForm ref="sprintForm" @sprintEdited="onSprintEdited"/>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import SprintForm from "../../../../components/Custom/SprintForm";
    import SprintsList from "../../../../components/Generic/SprintsList";
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    import { APICalls } from "../../../../utils/apiCalls";

    export default {
        name: 'homeUserSprint',
        components: {
            ButtonBase,
            SprintsList,
            SprintForm
        },
        data() {
            return {
                sprintsList: [],
                loaded: {
                    sprintsList: false
                }
            }
        },
        mounted() {
            this.reloadSprints();
        },
        methods: {
            onSprintEdited() {
                this.reloadSprints();
                
                this.$emit('sprintsUpdated');
            },

            addNewSprint() {
                this.$refs.sprintForm.resetForm();
            },

            reloadSprints() {
                const vm = this;
                
                vm.loaded.sprintsList = false;

                APICalls.getProjectSprints(vm.$route.params.projectId)
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
                this.$refs.sprintForm.setSprintToEdit(JSON.parse(JSON.stringify(sprintData)));
            },

            setSprintToView(sprintData) {
                this.$refs.sprintForm.setSprintToView(JSON.parse(JSON.stringify(sprintData)));
            }
        }
    }
</script>
