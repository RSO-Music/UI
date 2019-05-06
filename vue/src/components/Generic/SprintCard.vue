<template>
    <v-card class="adminProjectCard slide-up">
        <div class="adminpName">
            <v-layout>
                <v-flex xs9>
                    <h2 class="mb-1 black--text">{{sprint.name}}</h2>
                    <p>{{sprint.startDate | moment('DD. MM. YYYY')}} - {{sprint.endDate | moment('DD. MM. YYYY')}}</p>
                </v-flex>

                <v-flex xs3>
                    <v-layout justify-end>
                        <template v-if="editable">
                            <ButtonOutline v-if="finished" msg="Zaključi" @clicked="editSprint(sprint)"></ButtonOutline>
                            <ButtonOutline v-else msg="Uredi" @clicked="editSprint(sprint)"></ButtonOutline>
                        </template>
                        <ButtonOutline v-else msg="Preglej" @clicked="viewSprint(sprint)"></ButtonOutline>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>
    </v-card>
</template>

<script>
    import ButtonBase from "./ButtonBase";
    import ButtonOutline from "./ButtonOutline";
    import { APICalls } from "../../utils/apiCalls";

    export default {
        name: "SprintCard",
        components: { ButtonOutline, ButtonBase },
        props: {
            sprint: Object,
            editable: Boolean,
            finished: Boolean
        },
        methods: {
            editSprint(sprint) {
                this.$emit('editSprint', sprint);
            },
            viewSprint(sprint) {
                this.$emit('viewSprint', sprint);
            }
        }
    }
</script>

<style scoped>
    .adminProjectCard {
        width: 100%;
        padding: 20px;
        margin: 10px 0;
        border-radius: 2px;
    }

    .adminpName {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .adminpName p {
        font-weight: bold;
    }
</style>