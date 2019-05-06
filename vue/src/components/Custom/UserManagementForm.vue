<template>
    <v-form
            class="form-wrapper"
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-layout column>
            <h1 class="text-uppercase text-xs-center" v-if="isNew">Ustvari uporabnika</h1>
            <h1 class="text-uppercase text-xs-center" v-else>Uredi uporabnika</h1>

            <v-layout>
                <v-flex xs6>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="user.firstName"
                            :rules="nameRules"
                            label="Ime"
                            required
                    ></v-text-field>
                </v-flex>
                
                <v-flex xs6>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="user.lastName"
                            :rules="nameRules"
                            label="Priimek"
                            required
                    ></v-text-field>
                </v-flex>
                
            </v-layout>
            
            <v-layout>
                <v-flex xs6>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="person"
                            v-model="user.username"
                            label="Uporabniško ime"
                            :rules="nameRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex xs6>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="lock"
                            v-model="user.password"
                            label="Geslo"
                            :rules="[v => !!v || 'Geslo je obvezno']"
                            :type="'password'"
                            required
                    ></v-text-field>
                </v-flex>
            </v-layout>
            
            <v-layout>
                <v-flex xs6>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="mail"
                            v-model="user.email"
                            label="E-pošta"
                            :rules="emailRules"
                            required
                    ></v-text-field>
                </v-flex>
            </v-layout>

            <h2 class="section-title mb-2 mt-2">Sistemska vloga</h2>

            <v-layout>
                <v-flex xs6>
                    <v-select
                            color="#3093A0"
                            prepend-icon="star"
                            v-model="user.role"
                            :items="userRoleSelectObjects"
                            :rules="[v => !!v || 'Izberite sistemsko vlogo']"
                            label="Izberite sistemsko vlogo"
                            item-text="label"
                            item-value="value"
                            hide-details
                            required
                            :disabled="!!user._id"
                    ></v-select>
                </v-flex>
            </v-layout>
        </v-layout>
        
        <v-layout justify-end>
            <ButtonBase msg="Shrani" @clicked=addUser></ButtonBase>
        </v-layout>
    </v-form>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "UserManagementForm",

        components: { ButtonBase },

        data() {
            return {
                user: {},
                isNew: true,
                valid: true,
                nameRules: [
                    v => !!v || 'Ime je obvezno'
                ],
                userRoleSelectObjects: [
                    {
                        label: 'Administrator',
                        value: 'system_admin'
                    },
                    {
                        label: 'Uporabnik',
                        value: 'system_user'
                    }
                ],
                emailRules: [
                    v => !!v || 'E-pošta je obvezna',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-pošta ni ustrezna'
                ]
            }
        },

        methods: {
            addUser() {
                const vm = this;

                if (vm.$refs.form.validate()) {
                    if (vm.isNew) {
                        APICalls.addNewUser(vm.user).then(
                            (res) => {
                                vm.$toasted.success('Uporabnik je bil uspešno dodan', {
                                    duration: 3000,
                                    position: "bottom-center",
                                });

                                vm.resetForm();

                                vm.$emit('userEdited');
                            },
                            (error) => {
                                vm.$toasted.error('Pri dodajanju uporabnika je prišlo do napake', {
                                    duration: 3000,
                                    position: "bottom-center",
                                });
                            }
                        );
                    } else {
                        vm.$toasted.error('Funkcionalnost posodabljanja uporabnikov še ni implementirana', {
                            duration: 3000,
                            position: "bottom-center",
                        });
                        
                        // APICalls.editUser(vm.user).then(
                        //     (res) => {
                        //         vm.$toasted.success('Uporabnik je bil uspešno posodobljen', {
                        //             duration: 3000,
                        //             position: "bottom-center",
                        //         });
                        //
                        //         vm.$emit('userEdited');
                        //     },
                        //     (error) => {
                        //         vm.$toasted.error('Pri posodabljanju uporabnika je prišlo do napake', {
                        //             duration: 3000,
                        //             position: "bottom-center",
                        //         });
                        //     }
                        // );
                    }
                } else {
                    this.valid = false;
                }
            },
            
            setUserToEdit(userData) {
                this.user = userData;
                this.isNew = false;
            },
            
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
                this.isNew = true;
                this.user = {};
            }
        },

        computed: {}
    }
</script>

<style scoped>

</style>