<template>
    <div v-if="story" class="userStory">
        <div id="storyTags">
            <div class="tagDesign" v-if="this.story.priority === 'Must have'" :style="tagRed">
                <p>{{story.priority}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.priority === 'Should have'" :style="tagOrange">
                <p>{{story.priority}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.priority === 'Could have'" :style="tagGreen">
                <p>{{story.priority}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.priority === 'Wont have this time'" :style="tagBlue">
                <p>{{story.priority}}</p>
            </div>
            <div class="tagDesign" v-if="this.story.businessValue === 'Critical'" :style="tagRed">
                <p>{{story.businessValue}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.businessValue === 'Significant'" :style="tagOrange">
                <p>{{story.businessValue}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.businessValue === 'Moderate'" :style="tagYellow">
                <p>{{story.businessValue}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.businessValue === 'Minor'" :style="tagGreen">
                <p>{{story.businessValue}}</p>
            </div>
            <div class="tagDesign" v-else-if="this.story.businessValue === 'Low'" :style="tagBlue">
                <p>{{story.businessValue}}</p>
            </div>
        </div>
        <div id="cardName">
            <h5>{{story.name}}</h5>
        </div>
        <div id="cardDescription">
            <p>{{story.description}}</p>
        </div>
        <div id="addToSprint" v-if="this.story.sprintId === null">
            <v-layout align-center justify-end row class="userStoryButtons">
                <v-flex xs5 align-self-center>
                    <v-toolbar color="white" flat dense>
                        <v-btn flat icon>
                            <v-checkbox color="#3093A0"
                                        @change="changedCheckbox($event)"
                                        v-model="parentData"
                            ></v-checkbox>
                        </v-btn>
                        <EditUserStoryDialog :story="this.story" v-on:refresh="refreshStory"></EditUserStoryDialog>
                        <v-btn flat icon color="red" v-on:click="deleteStory">
                            <v-icon>clear</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-flex>

            </v-layout>
        </div>
        <div id="editTask" v-if="this.story.sprintId !== null && this.story.done === false">
            <v-layout align-center justify-end row fill-height>
                <v-flex xs1>
                    <EditUserStoryDialog :story="this.story" v-on:refresh="refreshStory" :fullEdit="true"></EditUserStoryDialog>
                </v-flex>

            </v-layout>
        </div>
    </div>
</template>

<script>
    import {APICalls} from "../../utils/apiCalls"
    import EditUserStoryDialog from "../Custom/EditUserStoryDialog";

    export default {
        name: "UserStoryCard",
        components: {EditUserStoryDialog},
        props: {
            story: Object,
            parentData: {
                type: Array,
                default() {
                    return []
                }
            }
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
        }),
        methods: {
            changedCheckbox: function ($event) {
                let bool = $event.length === 1;
                this.$emit('addStory', {id: this.story._id, bool: bool});

            },
            deleteStory: function () {
                APICalls.deleteUserStory(this.story._id).then(
                    (res) => {
                        console.log('User story deleted');
                        this.$emit('removeStory', true);
                    },
                    (error) => {
                        console.log('Delete error')
                    }
                );
            },
            refreshStory: function () {
                this.$emit("refresh", true);
            }
        }
    }
</script>

<style scoped>
    .userStory {
        background-color: white;
        border-radius: 4px;
        padding: 10px 0px 0px 20px;
        margin-bottom: 10px;
        border: 1px solid #A0A6B2;
        border-left: 8px solid #3093A0;
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
        padding: 5px;
        margin-top: 5px;
    }

    #cardDescription {
        padding: 10px;
        margin-top: 5px;
    }

    #cardDescription p {
        color: #969DAA;
    }

    .userStoryButtons{
    }
</style>