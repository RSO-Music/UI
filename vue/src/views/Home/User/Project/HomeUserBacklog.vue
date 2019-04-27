<template>
    <div class="contentWrapper">
        <h1>Pregled</h1>

        <div class="backlogWrapper">
            <div id="unassigned" class="backlogSection">
                <h2>Nedodeljene zgodbe</h2>
                <div class="storyContainer" v-for="story of storiesInBacklog">
                    <UserStoryCard :story="story"
                                   v-on:addStory="addStory"
                                   v-on:refresh="reloadData"
                                   v-on:removeStory="reloadData"
                    />
                </div>

                <v-layout align-center justify-end row class="mb-2">
                    <ButtonOutline v-if="storiesToAddToSprint.length" msg="Dodeli zgodbe trenutnemu sprintu"
                                   @clicked="addStoryToSprint" :isDisabled="!currentSprint">
                    </ButtonOutline>
                </v-layout>

                <v-layout align-center justify-end row class="align-right">
                    <EditUserStoryDialog :story="{}" v-on:refresh="reloadData" :full-edit="false"
                                         :customBtn="true"></EditUserStoryDialog>
                </v-layout>
            </div>

            <div id="assigned" class="backlogSection">
                <h2>Zgodbe trenutnega sprinta</h2>

                <div v-if="currentSprint">
                    <div class="storyContainer" v-for="story of storiesInCurrentSprint">
                        <UserStoryCard :story="story" v-on:refresh="reloadData"/>
                    </div>
                </div>

                <div v-else>
                    <h5>Ni aktivnega sprinta ...</h5>
                </div>
            </div>

            <div id="completed" class="backlogSection">
                <h2>Zaključene zgodbe</h2>

                <div class="storyContainer" v-for="story in completedStories">
                    <UserStoryCard :story="story"/>
                </div>
            </div>

        </div>
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
    .backlogWrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: stretch;
    }

    .backlogWrapper > * {
        flex-basis: 30%;
    }

    .backlogSection {
        padding: 15px;
        border-radius: 4px;
        border-top: 8px solid #A2E0E0;
        background-color: white;
    }

    .backlogSection h2 {
        padding: 10px 0;
    }
</style>