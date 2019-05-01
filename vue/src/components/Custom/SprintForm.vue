<template>
    <div>
        <v-form
            class="form-wrapper"
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-layout column>
            <h1 class="text-uppercase text-xs-center" v-if="isNew">Ustvari Sprint</h1>
            <h1 class="text-uppercase text-xs-center" v-else>Uredi Sprint</h1>

            <v-text-field
                    color="#3093A0"
                    prepend-icon="rate_review"
                    label="Ime sprinta"
                    v-model="sprint.name"
                    :rules="[v => !!v || 'Ime sprinta ne sme biti prazno']"
                    required
                    :disabled="!isEditable"
            ></v-text-field>
            <div id="sprintTime">
                <v-menu
                        v-model="dateStart"
                        :close-on-content-click="true"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                color="#3093A0"
                                :value="formattedStartDate"
                                hint="DD. MM. YYYY"
                                persistent-hint
                                label="Začetni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
                                :disabled="!isEditable"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="sprint.startDate" no-title scrollable>
                        <v-spacer></v-spacer>
                    </v-date-picker>
                </v-menu>
                <v-menu
                        v-model="dateStop"
                        :close-on-content-click="true"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                color="#3093A0"
                                :value="formattedEndDate"
                                hint="DD. MM. YYYY"
                                persistent-hint
                                label="Končni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
                                :disabled="!isEditable"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="sprint.endDate" no-title scrollable>
                        <v-spacer></v-spacer>
                    </v-date-picker>
                </v-menu>
            </div>
            <v-text-field
                    id="sprintSpeed"
                    color="#3093A0"
                    prepend-icon="timer"
                    label="Pričakovana hitrost"
                    v-model="sprint.speed"
                    :rules="[ v => sprintValidation(v) || 'Vrednost hitrosti mora biti med 1 in 100']"
                    type="number"
                    required
                    :disabled="!isEditable"
            ></v-text-field>
        </v-layout>

        <v-layout v-if="isEditable" justify-end>
            <ButtonBase
                    msg="Shrani"
                    @clicked="addSprint"
            ></ButtonBase>
        </v-layout>
    </v-form>

        <template v-if="!isNew">
            <v-layout mt-4>
                <h2 class="section-title">Uporabniške zgodbe Sprinta</h2>
            </v-layout>

            <v-flex xs12>
                <template v-if="stories.length">
                    <v-layout>
                        <v-flex xs4 v-for="story of stories" :key="story._id">
                            <div class="ma-2">
                                <UserStoryCard :story="story"
                                               :viewOnly="true"
                                               :currentSprint="sprint"
                                />
                            </div>
                        </v-flex>
                    </v-layout>
                </template>

                <div v-else>
                    <h2 class="backlog-empty-text text-xs-center grey--text">Ni zgodb</h2>
                </div>
            </v-flex>
        </template>
    </div>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    import { APICalls } from "../../utils/apiCalls";
    import UserStoryCard from "../Generic/UserStoryCard";

    export default {
        name: "SprintForm",
        components: { UserStoryCard, ButtonBase },
        data() {
            return {
                sprint: {},
                stories: [],
                loaded: {
                    stories: false
                },
                valid: true,
                isNew: true,
                isEditable: true,
                dateStart: false,
                dateStop: false
            }
        },
        methods: {
            addSprint() {
                const vm = this;

                if (vm.$refs.form.validate()) {
                    if (vm.$moment(vm.sprint.startDate).valueOf() > vm.$moment(vm.sprint.endDate).valueOf()) {
                        this.$toasted.error('Začetni datum Sprinta ne sme biti za končnim datumom', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                        
                        return;
                    }
                    
                    vm.sprint.projectId = vm.$route.params.projectId;
                    
                    if (vm.isNew) {
                        APICalls.createNewSprint(vm.sprint).then(
                            (res) => {
                                vm.$toasted.success('Sprint je bil uspešno dodan', {
                                    duration: 3000,
                                    position: "bottom-center"
                                });

                                vm.resetForm();

                                vm.$emit('sprintEdited');
                            },
                            (error) => {
                                vm.$toasted.error('Pri dodajanju Sprinta je prišlo do napake', {
                                    duration: 3000,
                                    position: "bottom-center"
                                });
                            }
                        );
                    } else {
                        vm.$toasted.error('Funkcionalnost posodabljanja Sprintov še ni implementirana', {
                            duration: 3000,
                            position: "bottom-center"
                        });
                    }
                } else {
                    this.valid = false;
                }
            },
            
            setSprintToEdit(sprintData) {
                this.sprint = sprintData;
                this.isEditable = true;
                this.isNew = false;
                
                this.fetchStories();
            },

            setSprintToView(sprintData) {
                this.sprint = sprintData;
                this.isEditable = false;
                this.isNew = false;

                this.fetchStories();
            },
            
            fetchStories() {
                this.loaded.stories = false;
                
                APICalls.getAllStoriesForSprint(this.$store.getters.editingProject._id, this.sprint._id)
                    .then((res) => {
                        this.stories = res.data;
                    })
                    .catch((ex) => {
                        console.log(ex);
                    })
                    .finally(() => {
                        this.loaded.stories = true;
                    });
            },
            
            sprintValidation(val) {
                if (!val)
                    return false;
                return !(val < 1 || val > 100 || val.length < 1);
            },
            
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
                this.isNew = true;
                this.isEditable = true;
                this.sprint = {};
                this.stories = [];
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
        }
    }
</script>

<style scoped>
    #sprintTime {
        display: flex;
    }
</style>