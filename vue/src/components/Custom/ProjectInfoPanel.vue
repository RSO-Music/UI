<template>
    <div class="projectInfo">
        <div class="infoLeft">
            <h5 class="project-name">{{selectedProject.name}}</h5>
            <p class="levelDown"> - </p>
            <p class="textBold" v-if="currentSprint !== null">TRENUTNI SPRINT:</p>
            <p class="pName" v-if="currentSprint !== null">{{currentSprint.name}}</p>
            <p class="sDate" v-if="currentSprint !== null">({{startDateFormat}} - {{endDateFormat}})</p>
            <p v-if="currentSprint === null" class="sConfirmation">Trenutno ni aktivnega Sprinta</p>
        </div>
        <div class="info-wrapper">
            <p class="textBold">Vaše vloge v projektu:</p>
            <p class="roleName">{{getCurrentUserProjectRoles}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProjectInfoPanel',
        props: {
            selectedProject: Object,
            currentSprint: Object,
            userProjectRole: Array
        },
        methods: {},
        computed: {
            startDateFormat() {
                return this.currentSprint.startDate;
            },
            
            endDateFormat() {
                return this.currentSprint.endDate;
            },
            
            getCurrentUserProjectRoles() {
                const vm = this;
                
                return vm.userProjectRole.map((currentUserRole) => {
                    return vm.$userProjectRoles.find((role) => role.value === currentUserRole).text;
                }).join(', ');
            }

        }
    }
</script>

<style scoped>
    .projectInfo {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        background-color: #F6F6F7;
        border-bottom: 2px solid white;
    }

    .infoLeft {
        display: flex;
        padding: 10px;
        align-items: center;
    }

    .info-wrapper {
        display: flex;
        padding: 10px;
        border: 1px solid #3093A0;
        border-radius: 8px;
        background-color: white;
    }

    .textBold {
        font-weight: bold;
        padding-right: 10px;
        color: #969DAA;
    }

    .levelDown {
        padding: 0 15px;
        font-weight: bolder;
        color: #969DAA;
    }

    .sDate {
        color: #969DAA;
        padding: 0 10px;
        font-style: italic;
    }

    .sConfirmation {
        color: #969DAA;
        font-style: italic;
    }
</style>