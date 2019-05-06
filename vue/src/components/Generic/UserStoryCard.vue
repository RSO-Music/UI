<template>
    <v-card v-if="story" :class="{ 'user-story': true, 'user-story--selected': checked, 'slide-up': true }">
        <v-layout>
            <v-flex>
                <div class="user-story-priority" :style="getPriorityColor()"></div>
            </v-flex>

            <v-flex xs11 class="user-story-content">
                <v-layout v-if="currentSprint && story.sprintId === null && canEditUserStories" add-to-sprint-wrapper>
                    <v-checkbox color="#3093A0"
                                @change="changedCheckbox($event)"
                                :disabled="hasNoTimeEstimation"
                    ></v-checkbox>
                </v-layout>

                <v-layout column>
                    <v-flex xs12 id="cardName">
                        <v-layout align-end>
                            <h5>{{story.name}}</h5>
                            <p class="priority-label">({{story.priority}})</p>
                        </v-layout>
                    </v-flex>
                </v-layout>

                <v-layout>
                    <div id="cardDescription">
                        <v-flex xs12 mb-2 mt-2>
                            <p>Poslovna vrednost: {{story.businessValue}}</p>
                        </v-flex>

                        <v-flex xs12 mb-4>
                            <p>Opis: {{story.description}}</p>
                        </v-flex>

                        <v-flex v-if="story.rejected" xs12 mb-4>
                            <p class="red--text">
                                <v-icon class="red--text">info_outline</v-icon>
                                <span class="ml-2">Zgodba je bila zavrnjena</span><span
                                    v-if="story.rejectionReason"> z razlogom: {{story.rejectionReason}}</span>
                            </p>
                        </v-flex>
                    </div>
                </v-layout>

                <v-divider v-if="this.story.done === false || isFinishingStory || viewOnly"></v-divider>

                <v-layout justify-end>
                    <template v-if="!isFinishingStory && !viewOnly">
                        <div id="addToSprint" v-if="this.story.sprintId === null">
                            <v-layout align-end justify-end row>
                                <UserStoryDialog :story="this.story" v-on:refresh="refreshStory"></UserStoryDialog>

                                <v-btn v-if="canEditUserStories" flat icon color="red" v-on:click="deleteStory">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-layout>
                        </div>

                        <div id="editTask" v-if="this.story.sprintId !== null && this.story.done === false">
                            <v-layout align-end justify-end row fill-height>
                                <UserStoryDialog 
                                        :story="this.story" 
                                        v-on:refresh="refreshStory"
                                        :fullEdit="true"
                                ></UserStoryDialog>
                            </v-layout>
                        </div>
                    </template>

                    <div id="finishTask" v-else-if="isFinishingStory">
                        <v-layout align-end justify-end row fill-height>
                            <UserStoryDialog
                                    :story="this.story"
                                    :fullEdit="true"
                                    :viewOnly="true"
                                    :isFinishing="true"
                                    v-on:finishedStory="finishStory"
                            ></UserStoryDialog>
                        </v-layout>
                    </div>

                    <div id="viewTask" v-else-if="viewOnly">
                        <v-layout align-end justify-end row fill-height>
                            <UserStoryDialog 
                                    :story="this.story"
                                    :fullEdit="true"
                                    :viewOnly="true"
                            ></UserStoryDialog>
                        </v-layout>
                    </div>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
    import { APICalls } from "../../utils/apiCalls"
    import UserStoryDialog from "../Custom/UserStoryDialog";

    export default {
        name: "UserStoryCard",
        components: { UserStoryDialog },
        props: {
            story: Object,
            isFinishingStory: Boolean,
            viewOnly: Boolean,
            currentSprint: Object
        },
        data: () => ({
            tagRed: {
                backgroundColor: '#E53849'
            },
            tagOrange: {
                backgroundColor: '#FC8F00'
            },
            tagYellow: {
                backgroundColor: '#FFBA02'
            },
            tagGreen: {
                backgroundColor: '#AACE25'
            },
            tagBlue: {
                backgroundColor: '#16B4D8'
            },
            checked: false
        }),
        methods: {
            changedCheckbox(checked) {
                this.checked = checked;

                this.$emit('addStory', { id: this.story._id, checked });

            },
            deleteStory() {
                APICalls.deleteUserStory(this.story._id).then(
                    (res) => {
                        this.$emit('removeStory', true);
                    },
                    (error) => {
                        console.log('Delete error')
                    }
                );
            },
            refreshStory() {
                this.$emit("refresh", true);
            },
            finishStory() {
                this.$emit("finishedStory", true);
            },
            getPriorityColor() {
                if (this.story.priority === 'Must have') {
                    return this.tagRed;
                } else if (this.story.priority === 'Should have') {
                    return this.tagOrange;
                } else if (this.story.priority === 'Could have') {
                    return this.tagGreen;
                } else if (this.story.priority === 'Wont have this time') {
                    return this.tagBlue;
                }
            }
        },
        computed: {
            hasNoTimeEstimation() {
                return !this.story.timeEstimation || this.story.timeEstimation === '';
            },
            canEditUserStories() {
                let projectData = this.$store.getters.editingProject;

                let currentUser = this.$store.getters.currentUser;

                let userInProject = projectData.users.find(function (user) {
                    return user.user._id === currentUser._id;
                });

                return userInProject.role.includes('scrum_master') || userInProject.role.includes('product_owner');
            }
        }
    }
</script>

<style scoped>
    .user-story {
        background-color: white;
        border-radius: 2px;
        margin-bottom: 10px;
        border: 2px solid #DEDEDE;
        position: relative;
    }

    .user-story--selected {
        border: 2px solid teal;
    }

    .user-story-priority {
        width: 24px;
        height: 100%;
    }

    .user-story-content {
        padding: 12px 12px 0;
    }

    .add-to-sprint-wrapper {
        position: absolute;
        right: 16px;
        top: 0;
    }

    #storyTags {
        display: flex;
        padding: 5px 0;
    }

    .tagDesign {
        margin-right: 5px;
        padding: 3px 8px;
        border-radius: 10px;
    }

    #cardName {
        margin-top: 5px;
    }

    .priority-label {
        padding-left: 8px;
    }

    #cardDescription {
        margin-top: 5px;
    }

    #cardDescription p {
        color: #969DAA;
    }

    .userStoryButtons {
    }
</style>