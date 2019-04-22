<template>
    <div class="contentWrapper">
        <h1>Časovnica</h1>

        <div class="backlogWrapper">
            <div id="unassigned" class="backlogSection">
                <h2>Nedodeljene zgodbe</h2>
                <div class="storyContainer" v-for="story of storiesInBacklog">
                    <UserStoryCard :story="story" :parent-data="parentData" v-on:addStory="addStory" v-on:refresh="refreshData" v-on:removeStory="refreshData"/>
                </div>
                <MyAlert class="smaller" :msg="napakaTekst" :is-success="napaka" @closeAlert="closeAlert"/>
                <v-layout align-center justify-end row class="mb-2">
                    <ButtonOutline v-if="storiesInBacklog.length !== 0" msg="Dodeli zgodbe trenutnemu sprintu" @clicked="addStoryToSprint"></ButtonOutline>
                </v-layout>
                <v-layout align-center justify-end row class="align-right">
                    <EditUserStoryDialog :story="{}" v-on:refresh="refreshData" :full-edit="false" :customBtn="true"></EditUserStoryDialog>
                </v-layout>
            </div>
            <div id="assigned" class="backlogSection">
                <h2>Zgodbe trenutnega sprinta</h2>
                <div v-if="currentSprint">
                    <div class="storyContainer" v-for="story of storiesInCurrentSprint">
                        <UserStoryCard :story="story" v-on:refresh="refreshData"/>
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
    import {APICalls} from "../../../../utils/apiCalls";
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
            this.getStoriesInCurrnetSprint();
            this.getCompletedStories();
        },
        data: () => ({
            storiesInBacklog: [],
            completedStories: [],
            storiesInCurrentSprint: [],
            currentSprint: {},
            endDate: '',
            startDate: '',
            arr: [],
            parentData: [],
            napaka: 0,
            napakaTekst: ''
        }),
        props: {
            project: Object,
        },
        methods: {
            getStoriesInBacklog: function () {
                APICalls.getProjectBacklog(this.$route.params.projectId).then(
                    (rs) => {
                        this.storiesInBacklog = rs.data;
                    },
                    (error) => {
                    }
                );
            },
            getStoriesInCurrnetSprint: function () {
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
            getCompletedStories: function () {
                APICalls.getDoneStories(this.$route.params.projectId).then(
                    (rs) => {
                        this.completedStories = rs.data;
                    },
                    (error) => {
                    }
                );
            },
            addStory: function (obj) {
                //console.log(obj);
                if (obj.bool === true) {
                    //console.log(obj.id);
                    this.arr.push(obj.id);
                } else {
                    var i = this.arr.findIndex(function (idStory) {
                        return obj.id === idStory;
                    });
                    //console.log(i)
                    this.arr.splice(i, 1)
                }
                console.log(this.arr)
            },
            addStoryToSprint: function () {
                if (this.arr.length !== 0) {
                    //console.log(this.currentSprint._id);
                    for (let x = 0; x < this.arr.length; x++) {
                        APICalls.getStoriesList(this.arr[0]).then(
                            (rs) => {
                                if (rs.status === 200) {
                                    if (rs.data.timeEstimation !== null) {
                                        APICalls.updateUserStory({sprintId: this.currentSprint._id}, this.arr[x]).then(
                                            (rs) => {
                                                this.getStoriesInCurrnetSprint();
                                                this.getStoriesInBacklog();
                                                this.getCompletedStories();
                                                this.parentData = []
                                            },
                                            (error) => {
                                                console.log("Napaka")
                                            })
                                    }
                                    else {
                                        this.napaka = 2;
                                        this.napakaTekst = "Ena od izbranih uporabniških zgodb nima določene časovne ocene";
                                    }
                                } else console.log("Napaka");
                            },
                            (error) => {
                                console.log(error)
                            }
                        );
                    }
                }
            },
            addNewStory: function() {

            },
            refreshData: function () {
				this.getStoriesInBacklog();
				this.getStoriesInCurrnetSprint();
				this.getCompletedStories();
            },
            closeAlert: function () {
                this.napaka = 0;
                this.napakaTekst = '';
            }

        },
        computed: {
            startDateFormat: function () {
                return new Date(this.currentSprint.startDate * 1000).toString().substr(0, 10);
            },
            endDateFormat: function () {
                return new Date(this.currentSprint.endDate * 1000).toString().substr(0, 10);
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