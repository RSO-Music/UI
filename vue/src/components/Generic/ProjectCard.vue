<template>
    <div id="projectWrapper">
        <v-card class="userProjectCard" v-if="!isAdmin" v-for="project in projectsList" :key="project._id">
            <div class="pName">
                <v-icon>developer_board</v-icon>
                <p>{{project.name}}</p>
            </div>
            <ButtonBase v-if="!isAdmin" msg="Odpri" @clicked="goInsideProject(project)"></ButtonBase>
        </v-card>
        
        <v-card class="adminProjectCard" v-if="isAdmin" v-for="project in projectsList" :key="project._id">
            <div class="adminpName">
                <p>{{project.name}}</p>
                <ButtonOutline msg="Uredi" @clicked="editSelectedProject(project)"></ButtonOutline>
            </div>
        </v-card>
    </div>

</template>

<script>
    import MyButton from "./Button";
    import ButtonBase from "./ButtonBase";
    import ButtonOutline from "./ButtonOutline";

    export default {
        name: "ProjectCard",
        components: { ButtonOutline, ButtonBase, MyButton },
        props: {
            insertedProjectList: Array,
            isAdmin: Boolean
        },
        created() {
            this.projectsList = this.insertedProjectList;
        },
        watch: {
            insertedProjectList(newVal, oldVal) {
                this.projectsList = newVal
            }
        },
        data: function () {
            return {
                projectsList: []
            }
        },
        methods: {
            editSelectedProject(projectToEdit) {
                this.$emit('editProject', projectToEdit);
            },
            goInsideProject(projectToEdit) {
                this.$emit('goInsideProject', projectToEdit);
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