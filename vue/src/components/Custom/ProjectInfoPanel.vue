<template>
    <v-flex xs-12 class="projectInfo">
        <v-layout>
            <v-flex>
                <v-flex>
                    <h1>{{$store.getters.editingProject.name}}</h1>
                </v-flex>

                <p class="grey--text text-uppercase mb-2">Aktivni Sprint:</p>

                <v-flex class="ml-4 mb-2" v-if="$store.getters.currentSprint">
                    <h2 class="black--text">{{$store.getters.currentSprint.name}}: 
                        {{$store.getters.currentSprint.startDate | moment('DD. MM. YYYY')}} -
                        {{$store.getters.currentSprint.endDate | moment('DD. MM. YYYY')}}
                        ({{getRemainingDaysText()}})
                    </h2>
                </v-flex>
                <v-flex class="ml-4 mb-2" v-else>
                    <h2 class="black--text">Trenutno ni aktivnega Sprinta</h2>
                </v-flex>

                <p class="grey--text text-uppercase mb-2">Osebe:</p>

                <v-flex class="ml-4">
                    <v-chip disabled v-for="{ user, role } in $store.getters.editingProject.users" :key="user._id">
                        <v-avatar class="theme-color white--text">{{user.firstName[0].toUpperCase()}}</v-avatar>
                        <span class="black--text">{{`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`}} ({{getUserProjectRoles(role)}})</span>
                    </v-chip>
                </v-flex>
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
                unfinishedSprints: [],
                userProjectRole: [],
                loaded: {
                    userProjectRole: false
                }
            };
        },
        mounted() {
            const vm = this;

            vm.reloadData();
        },
        methods: {
            reloadData() {
                const vm = this;
                
                vm.getUnfinishedSprints();
            },

            getUnfinishedSprints() {
                APICalls.getUnfinishedSprints(this.$route.params.projectId)
                    .then((res) => {
                        this.unfinishedSprints = res.data;
                    })
                    .catch((ex) => {
                        console.log(ex);
                    })
                    .finally(() => {
                        this.loaded.unfinishedSprints = true;
                    });
            },

            getUserProjectRoles(userRoles) {
                const vm = this;

                return userRoles.map((currentUserRole) => {
                    return vm.$userProjectRoles.find((role) => role.value === currentUserRole).text;
                }).join(', ');
            },
            
            getRemainingDaysText() {
                const vm = this;
                
                const currentSprint = vm.$store.getters.currentSprint;
                
                const currentDate = vm.$moment();
                const sprintEndDate = vm.$moment(currentSprint.endDate);
                
                console.log('DATE DIFF', currentDate.diff(sprintEndDate, 'days'));
                
                const dateDifference = sprintEndDate.diff(currentDate, 'days');
                
                switch (dateDifference) {
                    case 0:
                        return 'Sprint se konča danes';
                    case 1:
                        return 'še 1 dan';
                    default:
                        return `še ${dateDifference} dni`;
                        
                        break
                }
            }
        }
    }
</script>

<style scoped>
    .projectInfo {
        display: flex;
        justify-content: space-between;
    }
</style>