<template>

    <div class="formContainer">
        <v-form
                class="formWrapper"
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <h1>Dodaj uporabnika</h1>
            <div class="formDivide">
                <div id="formLeft">
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="firstName"
                            :rules="nameRules"
                            label="Ime"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="face"
                            v-model="lastName"
                            :rules="nameRules"
                            label="Priimek"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="mail"
                            v-model="email"
                            label="E-pošta"
                            :rules="emailRules"
                            required
                    ></v-text-field>
                </div>
                <div id="formRight">
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="person"
                            v-model="username"
                            label="Uporabniško ime"
                            :rules="nameRules"
                            required
                    ></v-text-field>
                    <v-text-field
                            color="#3093A0"
                            prepend-icon="lock"
                            v-model="password"
                            label="Geslo"
                            :rules="[v => !!v || 'Password is required']"
                            :type="'password'"
                            required
                    ></v-text-field>
                    <v-select
                            color="#3093A0"
                            prepend-icon="star"
                            v-model="select"
                            :items="items"
                            :rules="[v => !!v || 'Status selection is required']"
                            label="Sistemska vloga"
                            item-text="label"
                            item-value="value"
                            hide-details
                            required
                    ></v-select>
                </div>
            </div>
            <ButtonBase msg="Shrani" :isDisabled="!valid" @clicked = addUser></ButtonBase>
        </v-form>
    </div>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";
    export default {
        name: "UserManagementForm",
        components: {ButtonBase},
        data: () => ({
            valid: true,
            username: '',
            nameRules: [
                v => !!v || 'Field is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters'
            ],
            password: '',
            select: null,
            items: [
                {
                    label: 'admin',
                    value: 1
                },
                {
                    label: 'user',
                    value: 2
                }
            ],
            firstName: '',
            lastName: '',
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ]
        }),
        methods: {
            addUser () {
                if (this.$refs.form.validate()) {
                    this.$emit("adminAddUser", {
                        isAdmin: this.select === 1,
                        password: this.password,
                        username: this.username,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email

                    });
                    this.resetForm();
                } else {
                    this.valid = false;
                }
            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            }
        },
        computed: {
        }
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