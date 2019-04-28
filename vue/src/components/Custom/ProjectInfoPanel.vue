<template>
    <v-flex xs-12 class="projectInfo">
        <v-layout>
            <v-flex md8>
                <v-flex>
                    <h1>{{currentProject.name}}</h1>
                </v-flex>

                <p class="grey--text text-uppercase mb-2">Aktivni Sprint:</p>

                <v-flex class="ml-4 mb-2" v-if="currentSprint">
                    <p>{{currentSprint.name}} ({{currentSprint.startDate | moment('DD. MM. YYYY')}} -
                        {{currentSprint.endDate | moment('DD. MM. YYYY')}})</p>
                </v-flex>
                <v-flex class="ml-4 mb-2" v-else>
                    <p>Trenutno ni aktivnega Sprinta</p>
                </v-flex>

                <p class="grey--text text-uppercase mb-2">Osebe:</p>

                <v-flex class="ml-4">
                    <v-chip disabled v-for="{ user, role } in currentProject.users">
                        <v-avatar class="theme-color white--text">{{user.firstName[0].toUpperCase()}}</v-avatar>
                        <span class="black--text">{{`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`}} ({{getUserProjectRoles(role)}})</span>
                    </v-chip>
                </v-flex>
            </v-flex>
            
            <v-flex md6>
                
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: 'ProjectInfoPanel',
        data() {
            return {
                currentProject: {},
                currentSprint: {},
                userProjectRole: []
            };
        },
        mounted() {
            const vm = this;

            vm.reloadData();
        },
        methods: {
            reloadData() {
                const vm = this;

                vm.getSelectedProject();

                vm.getCurrentSprint();
            },

            getSelectedProject() {
                APICalls.getProjectId(this.$route.params.projectId).then(
                    (rs) => {
                        console.log(rs.data);

                        this.currentProject = rs.data;
                        this.userProjectRole = this.currentProject.users.find(x => x.user._id === this.$store.getters.currentUser._id).role;
                    },
                    (error) => {
                    }
                );
            },

            getCurrentSprint() {
                APICalls.getActiveSprint(this.$route.params.projectId).then(
                    (rs) => {
                        this.currentSprint = rs.data;
                    },
                    (error) => {
                        this.currentSprint = null;
                    }
                );
            },

            getUserProjectRoles(userRoles) {
                const vm = this;

                return userRoles.map((currentUserRole) => {
                    return vm.$userProjectRoles.find((role) => role.value === currentUserRole).text;
                }).join(', ');
            }
        },
        computed: {
            startDateFormat() {
                return this.currentSprint.startDate;
            },

            endDateFormat() {
                return this.currentSprint.endDate;
            }
        }
    }
</script>

<style scoped>
    .projectInfo {
        display: flex;
        justify-content: space-between;
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