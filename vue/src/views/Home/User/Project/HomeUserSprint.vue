<template>
    <div class="contentWrapper list-wrapper">
        <div class="list">
            <h1>Seznam Sprintov</h1>

            <ButtonBase classes="full-width" msg="Ustvari nov Sprint" @clicked="addNewSprint"></ButtonBase>

            <SprintsList ref="sprintsList" @editSprint="setSprintToEdit"/>
        </div>

        <div class="form-container">
            <SprintForm ref="sprintForm" @sprintEdited="onSprintEdited"/>
        </div>
    </div>
</template>

<script>
    import SprintForm from "../../../../components/Custom/SprintForm";
    import MyAlert from "../../../../components/Generic/AlertBox";
    import SprintsList from "../../../../components/Generic/SprintsList";
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    
    export default {
        name: 'homeUserSprint',
        components: {
            ButtonBase,
            SprintsList,
            MyAlert,
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
