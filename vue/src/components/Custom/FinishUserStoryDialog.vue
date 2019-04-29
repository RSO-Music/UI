<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout row justify-end>
        <v-dialog v-model="dialog" max-width="1200px">
            <template v-slot:activator="{ on }">
                <v-btn flat icon color="#3093A0" v-on="on">
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                >
                    <div id="toolbar">
                        <div id="topBarLeft">
                            <v-layout justify-center>
                                <h2 class="pl-3 pb-0 white--text" v-if="story._id">ZAKLJUČI ZGODBO</h2>
                            </v-layout>
                        </div>
                    </div>

                    <v-tabs
                            :key="activeTab"
                            v-model="activeTab"
                            dark
                            slider-color="#A2E0E0"
                            fixed-tabs
                            color="#1A2432"
                    >
                        <v-tab key="1">
                            Osnovni podatki
                        </v-tab>

                        <v-tab-item key="1">
                            <v-container>
                                <v-layout row>
                                    <v-flex xs-8>
                                        <v-text-field
                                                color="#3093A0"
                                                prepend-icon="rate_review"
                                                label="Naslov zgodbe"
                                                :value="story.name"
                                                required
                                                :disabled="true"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs-3 offset-xs1>
                                        <v-checkbox color="#3093A0"
                                                    @change=""
                                                    v-model="story.done"
                                                    label="Zgodba zaključena"
                                                    :disabled="true"
                                        ></v-checkbox>
                                    </v-flex>
                                </v-layout>
                                <div id="storyWrapper">
                                    <div id="storyDropdowns">
                                        <v-layout mb-3 row justify-space-between>
                                            <v-flex xs4>
                                                <v-text-field
                                                        color="#3093A0"
                                                        prepend-icon="rate_review"
                                                        label="Prioriteta"
                                                        :value="story.priority"
                                                        required
                                                        :disabled="true"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-text-field
                                                        color="#3093A0"
                                                        prepend-icon="rate_review"
                                                        label="Poslovna vrednost"
                                                        :value="story.businessValue"
                                                        required
                                                        :disabled="true"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-text-field
                                                        color="#3093A0"
                                                        prepend-icon="access_time"
                                                        type="number"
                                                        min="0"
                                                        label="Časovna ocena"
                                                        :value="story.timeEstimation"
                                                        :disabled="true"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                </div>
                                <v-layout row justify-space-between>
                                    <v-flex xs6 class="mr-4">
                                        <v-textarea
                                                color="#3093A0"
                                                id="storyDesc"
                                                label="Opis zgodbe"
                                                :value="story.description"
                                                rows="2"
                                                :auto-grow="true"
                                                required
                                                :disabled="true"
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-textarea
                                                color="#3093A0"
                                                label="Sprejemni testi"
                                                :value="story.acceptanceTests"
                                                rows="2"
                                                :auto-grow="true"
                                                required
                                                :disabled="true"
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>

                                <v-layout mt-4>
                                    <h2 class="section-title">Zaključi zgodbo</h2>
                                </v-layout>
                                
                                <v-layout justify-start>
                                    <v-flex xs4>
                                        <v-radio-group v-model="finished.state" row :mandatory="false">
                                            <v-radio label="Sprejmi zgodbo" value="accept"></v-radio>
                                            <v-radio label="Zavrni zgodbo" value="reject"></v-radio>
                                        </v-radio-group>
                                    </v-flex>

                                    <v-text-field
                                            color="#3093A0"
                                            label="Razlog za zavrnitev"
                                            v-model="finished.comment"
                                            :disabled="finished.state !== 'reject'"
                                    ></v-text-field>
                                </v-layout>
                                
                                <v-layout>
                                    <v-flex xs12>
                                        <ButtonBase msg="Zaključi" @clicked="finishStory"></ButtonBase>
                                        <ButtonBase msg="Prekliči" @clicked="closeDialog" class="cancel"></ButtonBase>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-tab-item>
                    </v-tabs>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    import { APICalls } from "../../utils/apiCalls";
    import ButtonOutline from "../Generic/ButtonOutline";
    import Separator from "../Generic/Separator";
    import TaskCard from "../Generic/TaskCard";

    export default {
        name: "FinishUserStoryDialog",
        components: { ButtonBase, ButtonOutline, Separator, TaskCard },
        props: ['story', 'fullEdit', 'customBtn'],
        data: () => ({
            dialog: false,
            valid: true,
            activeTab: 0,
            finished: {
                state: 'accept',
                comment: ''
            }
        }),
        methods: {
            finishStory() {
                const updateObject = {};
                
                if (this.finished.state === 'accept') {
                    updateObject.done = true;
                    updateObject.realized = true;
                } else if (this.finished.state === 'reject') {
                    updateObject.done = false;
                    updateObject.sprintId = null;
                    updateObject.comment = this.finished.comment;
                }

                APICalls.updateUserStory(updateObject, this.story._id).then(
                    (res) => {
                        this.$toasted.success(this.finished.state === 'accept' ? 'Zgodba je bila sprejeta' : 'Zgodba je bila zavrnjena', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                        
                        this.closeDialog();
                        
                        this.$emit("finishedStory", true);
                    },
                    (error) => {
                        console.log(error);

                        this.$toasted.error('Napaka pri zaključevanju zgodbe', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                    });
            },
            closeDialog() {
                this.dialog = false;
            }
		}
    }

</script>

<style scoped>
    .form-wrapper {
        margin: 0 !important;
        width: 100%;
        height: 80%;
        border: 1px solid #eee;
    }

    .cancel {
        margin-right: 2%;
    }

    #storyWrapper {
        justify-content: space-between;
        align-items: stretch;
    }

    #storyDropdowns {
        flex-basis: 40%;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #storyDropdowns:last-child {
        align-self: flex-end;
    }

    .tasks-container {
        overflow-y: scroll;
        height: 500px;
    }

    .custom-btn {
        padding: 0 20px;
        font-weight: bold;
        width: fit-content;
        min-width: 15px;
        float: right;
        margin: 0;
    }

    .cancel {
        margin-right: 2%;
    }

</style>