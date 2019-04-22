<template>
    <div class="formContainer">
        <MyAlert class="smaller" :msg="msg" :is-success="isSuccess" @closeAlert="closeAlert"/>
        <v-form
                class="formWrapper"
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <h1>NOV SPRINT</h1>
            <v-text-field
                    color="#3093A0"
                    prepend-icon="rate_review"
                    label="Ime sprinta"
                    v-model="sprintName"
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
                                v-model="date1"
                                label="Začetni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" no-title scrollable>
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
                                v-model="date2"
                                label="Končni datum"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" no-title scrollable>
                        <v-spacer></v-spacer>
                    </v-date-picker>
                </v-menu>
            </div>
            <v-text-field
                    id="sprintSpeed"
                    color="#3093A0"
                    prepend-icon="timer"
                    label="Pričakovana hitrost"
                    v-model="expectedVelocity"
                    :rules="[ v => sprintValidation(v) || 'Vrednost hitrosti mora biti med 1 in 100']"
                    type="number"
                    required
            ></v-text-field>
            <ButtonBase msg="Dodaj sprint" @clicked="addSprint"></ButtonBase>
        </v-form>
    </div>
</template>

<script>
    import MyAlert from "../Generic/AlertBox";
    import ButtonBase from "../Generic/ButtonBase";

    export default {
        name: "SprintForm",
        components: {ButtonBase, MyAlert},
        data: () => ({
            interval: 1000 * 60 * 60 * 24,
            valid: true,
            sprintName: '',
            expectedVelocity: null,
            date1:  new Date().toISOString().substr(0, 10),
            date2:  new Date().toISOString().substr(0, 10),
            dateStart: false,
            dateStop: false,
            isSuccess: 0,
            msg: ''
        }),
        methods: {
            addSprint(){
                if (this.$refs.form.validate()) {
                    const startDate = Math.floor(new Date( this.date1 ).getTime() / 1000);
                    const endDate = Math.floor(new Date(this.date2).getTime() / 1000);
                    const todayDate =  Math.round((Math.floor(new Date().getTime() / this.interval ) * this.interval) / 1000); // get todaj day at the start od the day...

                    if (endDate < startDate) {
                        this.isSuccess = 2;
                        this.msg = 'Datum konca pred datumom konca';
                        return;
                    }

                    if (startDate < todayDate) {
                        this.isSuccess = 2;
                        this.msg = 'Datum začetka ne more biti v preteklosti';
                        return;
                    }

                    if (startDate === endDate) {
                        this.isSuccess = 2;
                        this.msg = 'Datum začetka in konca sta enaka';
                        return;
                    }
                    this.isSuccess = 0;

                    this.$emit('addNewSprint', {
                        startDate: startDate,
                        endDate: endDate,
                        speed: Number(this.expectedVelocity),
                        name: this.sprintName,
                    });
                   this.resetForm();
                } else {
                    this.valid = false;
                }

            },
            sprintValidation(val) {
                if (!val)
                    return false;
                return !(val < 1 || val > 100 || val.length < 1);
            },
            resetForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
                this.date1 = new Date().toISOString().substr(0, 10);
                this.date2 = new Date().toISOString().substr(0, 10);
            },
            closeAlert() {
                this.isSuccess = 0;
                this.msg = '';
            }
        }

    }
</script>

<style scoped>
    #sprintTime {
        display: flex;
    }
</style>