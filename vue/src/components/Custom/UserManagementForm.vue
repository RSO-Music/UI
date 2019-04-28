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

            <div class="formDivide">
                <div id="formLeft">
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="user.firstName"
                            :rules="nameRules"
                            label="Ime"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="user.lastName"
                            :rules="nameRules"
                            label="Priimek"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="mail"
                            v-model="user.email"
                            label="E-pošta"
                            :rules="emailRules"
                            required
                    ></v-text-field>
                </div>
                <div id="formRight">
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="person"
                            v-model="user.username"
                            label="Uporabniško ime"
                            :rules="nameRules"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="lock"
                            v-model="user.password"
                            label="Geslo"
                            :rules="[v => !!v || 'Geslo je obvezno']"
                            :type="'password'"
                            required
                    ></v-text-field>
                    <v-select
                            color="#3093A0"
                            prepend-icon="star"
                            v-model="user.role"
                            :items="userRoleSelectObjects"
                            :rules="[v => !!v || 'Izberite sistemsko vlogo']"
                            label="Sistemska vloga"
                            item-text="label"
                            item-value="value"
                            hide-details
                            required
                    ></v-select>
                </div>
            </div>
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
    h1 {
        text-transform: uppercase;
    }

    .formDivide {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    }

    .formDivide > * {
        flex-basis: 50%;
    }

    #formLeft {
        margin-right: 5px;
    }

    #formRight {
        margin-left: 5px;
    }
</style>