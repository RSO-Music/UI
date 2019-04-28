<template>
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
            ></v-text-field>
            <div id="sprintTime">
                <v-menu
                        ref="menu"
                        v-model="dateStart"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                color="#3093A0"
                                v-model="sprint.startDate"
                                label="Začetni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="sprint.startDate" no-title scrollable>
                        <v-spacer></v-spacer>
                    </v-date-picker>
                </v-menu>
                <v-menu
                        ref="menu"
                        v-model="dateStop"
                        :close-on-content-click="false"
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
                                v-model="sprint.endDate"
                                label="Končni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
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
            ></v-text-field>
        </v-layout>
        
        <v-layout justify-end>
            <ButtonBase
                    msg="Shrani"
                    @clicked="addSprint"
            ></ButtonBase>
        </v-layout>
    </v-form>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "SprintForm",
        components: { ButtonBase },
        data() {
            return {
                sprint: {},
                valid: true,
                isNew: true,
                dateStart: false,
                dateStop: false
            }
        },
        methods: {
            addSprint() {
                const vm = this;

                if (vm.$refs.form.validate()) {
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
                sprintData.startDate = this.$moment(sprintData.startDate).format('YYYY-MM-DD');
                sprintData.endDate = this.$moment(sprintData.endDate).format('YYYY-MM-DD');
                
                this.sprint = sprintData;
                this.isNew = false;
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
                this.user = {};
            }
        }

    }
</script>

<style scoped>
    #sprintTime {
        display: flex;
    }
</style>