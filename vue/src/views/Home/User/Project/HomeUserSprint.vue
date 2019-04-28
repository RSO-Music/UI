<template>
    <div class="contentWrapper list-wrapper">
        <v-layout>
            <v-flex xs4 list>
                <h1 class="text-uppercase text-xs-center">Seznam Sprintov</h1>

                <ButtonBase classes="full-width" msg="Ustvari nov Sprint" @clicked="addNewSprint"></ButtonBase>

                <SprintsList ref="sprintsList" @editSprint="setSprintToEdit"/>
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
    
    export default {
        name: 'homeUserSprint',
        components: {
            ButtonBase,
            SprintsList,
            SprintForm
        },
        methods: {
            onSprintEdited() {
                this.$refs.sprintsList.reloadData();
            },

            addNewSprint() {
                this.$refs.sprintForm.resetForm();
            },

            setSprintToEdit(sprintData) {
                this.$refs.sprintForm.setSprintToEdit(JSON.parse(JSON.stringify(sprintData)));
            }
        }
    }
</script>
