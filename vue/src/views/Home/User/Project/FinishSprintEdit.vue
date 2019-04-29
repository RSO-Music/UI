<template>
    <v-layout class="form-wrapper" column>
        <v-flex xs12 column>
            <h1 class="text-uppercase text-xs-center">Zaključi Sprint</h1>
            
            <h2 class="black--text">{{sprint.name}} ({{formattedStartDate}} {{formattedEndDate}})</h2>
        </v-flex>

        <v-flex xs12 mb-4>
            <v-layout justify-end>
                <ButtonBase
                        msg="Zaključi"
                        @clicked="finishSprint"
                ></ButtonBase>
            </v-layout>
        </v-flex>
        
        <v-divider></v-divider>

        <v-layout mt-4>
            <h2 class="section-title">Uporabniške zgodbe Sprinta</h2>
        </v-layout>
        
        <v-flex xs12>
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
        </v-flex>
    </v-layout>
</template>

<script>
    import ButtonBase from "../../../../components/Generic/ButtonBase";
    import { APICalls } from "../../../../utils/apiCalls";
    import UserStoryCard from "../../../../components/Generic/UserStoryCard";
    
    export default {
        name: "FinishSprintEdit",
        components: { UserStoryCard, ButtonBase },
        props: {
            sprintToFinish: Object
        },
        data() {
            return {
                sprint: this.sprintToFinish,
                stories: []
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

                        this.$toasted.success('Sprint je zaključen', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    })
                    .catch((ex) => {
                        console.log(ex);

                        this.$toasted.error('Napaka pri zaključevanju Sprinta', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    });
            },
            
            getAllStoriesForSprint() {
                APICalls.getStoriesInsideCurrentSprint(this.$route.params.projectId, this.sprint._id).then(
                    (res) => {
                        this.stories = res.data.filter((story) => !story.realized);
                    },
                    (error) => {
                        
                    }
                );
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