<template>
    <div class="contentWrapper">
        <h1>Pregled</h1>
        
        <v-layout>
            <v-flex sm12 m4 mx-2>
                <v-layout column id="unassigned" class="backlog-section">
                    <v-layout column>
                        <h2>Nedodeljene zgodbe</h2>
                        <template v-if="storiesInBacklog.length">
                            <div class="storyContainer" v-for="story of storiesInBacklog" :key="story._id">
                                <UserStoryCard :story="story"
                                               :currentSprint="currentSprint"
                                               v-on:addStory="addStory"
                                               v-on:refresh="reloadData"
                                               v-on:removeStory="reloadData"
                                />
                            </div>
                        </template>

                        <div v-else>
                            <h2 class="backlog-empty-text text-xs-center grey--text">Ni nedodeljenih zgodb</h2>
                        </div>
                    </v-layout>
                    

                    <v-layout align-center justify-end row class="mb-2">
                        <ButtonOutline v-if="storiesToAddToSprint.length" msg="Dodeli zgodbe trenutnemu sprintu"
                                       @clicked="addStoryToSprint">
                        </ButtonOutline>
                    </v-layout>

                    <v-layout class="align-right">
                        <EditUserStoryDialog :story="{}" v-on:refresh="reloadData" :full-edit="false"
                                             :customBtn="true"></EditUserStoryDialog>
                    </v-layout>
                </v-layout>
            </v-flex>
            
            <v-flex sm12 m4 mx-2>
                <v-layout column id="assigned" class="backlog-section">
                    <h2>Zgodbe trenutnega Sprinta</h2>
                    
                    <template v-if="currentSprint">
                        <template v-if="storiesInCurrentSprint.length">
                            <div class="storyContainer" v-for="story of storiesInCurrentSprint" :key="story._id">
                                <UserStoryCard :story="story" v-on:refresh="reloadData"/>
                            </div>
                        </template>

                        <div v-else>
                            <h2 class="backlog-empty-text text-xs-center grey--text">Dodajte zgodbe v Sprint</h2>
                        </div>
                    </template>

                    <div v-else>
                        <h2 class="backlog-empty-text text-xs-center grey--text">Ni aktivnega Sprinta</h2>
                    </div>
                </v-layout>
            </v-flex>
            
            <v-flex sm12 m4 mx-2>
                <v-layout column id="completed" class="backlog-section">
                    <h2>Zaključene zgodbe</h2>

                    <template v-if="completedStories.length">
                        <div class="storyContainer" v-for="story in completedStories" :key="story._id">
                            <UserStoryCard :story="story"/>
                        </div>
                    </template>

                    <div v-else>
                        <h2 class="backlog-empty-text text-xs-center grey--text">Ni zaključenih zgodb</h2>
                    </div>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import UserStoryCard from "../../../../components/Generic/UserStoryCard";
    import { APICalls } from "../../../../utils/apiCalls";
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    import ButtonOutline from "../../../../components/Generic/ButtonOutline";
    import Separator from "../../../../components/Generic/Separator";
    import MyAlert from "../../../../components/Generic/AlertBox";
    import EditUserStoryDialog from "../../../../components/Custom/EditUserStoryDialog"

    export default {
        name: 'homeUserProductBacklog',
        components: {
            MyAlert,
            Separator, ButtonBase, ButtonOutline,
            UserStoryCard, EditUserStoryDialog
        },
        created() {
            this.getStoriesInBacklog();
            this.getStoriesInCurrentSprint();
            this.getCompletedStories();
        },
        data: () => ({
            storiesInBacklog: [],
            completedStories: [],
            storiesInCurrentSprint: [],
            currentSprint: {},
            endDate: '',
            startDate: '',
            storiesToAddToSprint: []
        }),
        props: {
            project: Object,
        },
        methods: {
            getStoriesInBacklog() {
                APICalls.getProjectBacklog(this.$route.params.projectId).then(
                    (rs) => {
                        this.storiesInBacklog = rs.data;
                    },
                    (error) => {
                    }
                );
            },
            getStoriesInCurrentSprint() {
                APICalls.getActiveSprint(this.$route.params.projectId).then(
                    (rs) => {
                        this.currentSprint = rs.data;
                        APICalls.getStoriesInsideCurrentSprint(this.$route.params.projectId, this.currentSprint._id).then(
                            (rs) => {
                                //SHOW ONLY NOT DONE TASKS
                                this.storiesInCurrentSprint = rs.data.filter(function (d) {
                                    return !d.done;
                                });
                            },
                            (error) => {
                            }
                        );
                    },
                    (error) => {
                        this.currentSprint = null;
                    }
                );
            },
            getCompletedStories() {
                APICalls.getDoneStories(this.$route.params.projectId).then(
                    (rs) => {
                        this.completedStories = rs.data;
                    },
                    (error) => {
                    }
                );
            },
            addStory(obj) {
                if (obj.checked === true) {
                    //console.log(obj.id);
                    this.storiesToAddToSprint.push(obj.id);
                } else {
                    const i = this.storiesToAddToSprint.findIndex(function (idStory) {
                        return obj.id === idStory;
                    });
                    this.storiesToAddToSprint.splice(i, 1)
                }
            },
            addStoryToSprint() {
                const vm = this;

                if (vm.storiesToAddToSprint.length !== 0) {
                    APICalls.addStoriesToActiveSprint(vm.storiesToAddToSprint, vm.currentSprint._id)
                        .then(function (res) {
                            if (res.status === 200) {
                                vm.$toasted.success('Zgodbe so bile uspešno dodane v aktivni Sprint', {
                                    duration: 3000,
                                    position: 'bottom-center'
                                });

                                vm.reloadData();
                            } else {
                                vm.$toasted.error('Pri dodajanju zgodb v Sprint je prišlo do napake', {
                                    duration: 3000,
                                    position: 'bottom-center'
                                });
                            }
                        })
                        .catch(function (ex) {
                            console.log(ex);

                            vm.$toasted.error('Pri dodajanju zgodb v Sprint je prišlo do napake', {
                                duration: 3000,
                                position: 'bottom-center'
                            });
                        })
                }
            },
            reloadData() {
                this.storiesToAddToSprint = [];

                this.getStoriesInBacklog();
                
                this.getStoriesInCurrentSprint();
                
                this.getCompletedStories();
            }
        }
    }
</script>

<style scoped>
    .backlog-section {
        padding: 15px;
        border-radius: 2px;
        border-top: 8px solid #A2E0E0;
        background-color: white;
    }

    .backlog-section h2 {
        color: #222;
        padding-bottom: 20px;
    }
    
    .backlog-empty-text {
        padding: 32px 0;
    }
</style>