<template>
    <div>
        <v-layout class="form-wrapper" column>
            <v-flex mb-4 xs12 column>
                <h1 class="text-uppercase text-xs-center">Zaključi Sprint</h1>

                <h2 class="black--text mb-4">{{sprint.name}} ({{formattedStartDate}} - {{formattedEndDate}})</h2>

                <p class="grey--text">Pričakovana hitrost: <span class="black--text">{{sprint.speed}}</span></p>
            </v-flex>
        </v-layout>

        <v-layout mt-4>
            <h2 class="section-title">Uporabniške zgodbe Sprinta</h2>
        </v-layout>

        <v-layout v-if="loaded.stories">
            <template v-if="stories.length">
                <v-layout>
                    <v-flex xs6 v-for="story of stories" :key="story._id">
                        <div class="ma-2">
                            <UserStoryCard :story="story"
                                           :isFinishingStory="true"
                                           :currentSprint="sprint"
                                           @finishedStory="onStoryFinished"
                            />
                        </div>
                    </v-flex>
                </v-layout>
            </template>

            <div v-else>
                <h2 class="backlog-empty-text text-xs-center grey--text">Ni zgodb</h2>
            </div>
        </v-layout>
        <v-layout v-else justify-center>
            <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
            ></v-progress-circular>
        </v-layout>
    </div>
</template>

<script>
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    import { APICalls } from "../../../../utils/apiCalls";
    import UserStoryCard from "../../../../components/Generic/UserStoryCard";

    import EventBus from '../../../../utils/eventBus';

    export default {
        name: "FinishSprintEdit",
        components: { UserStoryCard, ButtonBase },
        props: {
            sprintToFinish: Object
        },
        data() {
            return {
                sprint: this.sprintToFinish,
                stories: [],
                loaded: {
                    stories: false
                },
            }
        },
        mounted() {
            this.getAllStoriesForSprint();
        },
        methods: {
            setSprintToFinish(sprintData) {
                if (this.sprint._id !== sprintData._id) this.sprint = sprintData;
            },

            onStoryFinished() {
                EventBus.$emit('reloadBacklogPage');

                this.getAllStoriesForSprint();
            },

            finishSprint() {
                const updateObject = {
                    $set: {
                        finished: true
                    }
                };

                APICalls.updateSprint(this.sprint._id, updateObject)
                    .then((res) => {
                        this.$emit('sprintFinished');

                        this.$toasted.success('Sprint se je samodejno zaključil, saj so bile vse zgodbe obdelane', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    })
                    .catch((ex) => {
                        console.log(ex);

                        this.$toasted.error('Napaka pri zaključevanju Sprinta', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                    });
            },

            getAllStoriesForSprint() {
                this.loaded.stories = false;

                APICalls.getStoriesInsideCurrentSprint(this.$route.params.projectId, this.sprint._id)
                    .then((res) => {
                        const unrealizedStories = res.data.filter((story) => !story.realized);

                        if (unrealizedStories.length) {
                            this.stories = unrealizedStories;
                        } else {
                            this.finishSprint();
                        }
                    })
                    .catch((ex) => {
                        console.log(ex);

                        this.$toasted.error('Napaka pri pridobivanju zgodb Sprinta', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                    })
                    .finally(() => {
                        this.loaded.stories = true;
                    });
            }
        },
        computed: {
            formattedStartDate() {
                if (this.sprint.startDate) return this.$moment(this.sprint.startDate).format('DD. MM. YYYY');
                else return '';
            },

            formattedEndDate() {
                if (this.sprint.endDate) return this.$moment(this.sprint.endDate).format('DD. MM. YYYY');
                else return '';
            }
        },
        watch: {
            sprint() {
                this.getAllStoriesForSprint();
            }
        }
    }
</script>

<style scoped>
    #sprintTime {
        display: flex;
    }
</style>