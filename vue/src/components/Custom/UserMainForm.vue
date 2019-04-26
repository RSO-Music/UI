<template>
    <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="login"
    >
        <v-text-field
                color="#3093A0"
                prepend-icon="person"
                class="inputField"
                v-model="username"
                :counter="10"
                :rules="nameRules"
                label="Uporabniško ime"
                required
        ></v-text-field>

        <v-text-field
                color="#3093A0"
                prepend-icon="lock"
                class="inputField"
                v-model="password"
                label="Geslo"
                :type="'password'"
                required
        ></v-text-field>

        <ButtonBase class="btnFloat" msg="Prijava" type="submit" :disabled="!valid"></ButtonBase>
    </v-form>
</template>

<script>
    import ButtonBase from "../Generic/ButtonBase";

    export default {
        components: { ButtonBase },
        data: () => ({
            valid: true,
            username: '',
            nameRules: [
                v => !!v || 'Uporabniško ime ne sme biti prazno',
                v => (v && v.length <= 10) || 'Uporabniško ime mora biti dolžine najmanj 10'
            ],
            password: '',
        }),

        methods: {
            login() {
                if (this.$refs.form.validate()) {
                    this.$emit('loginSubmit', {
                        password: this.password,
                        username: this.username
                    });
                }
            }
        }
    }
</script>