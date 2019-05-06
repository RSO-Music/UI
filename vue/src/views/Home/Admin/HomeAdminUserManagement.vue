<template>
    <div class="contentWrapper list-wrapper">
        <v-layout class="slide-up">
            <v-flex xs4 list>
                <h1 class="text-uppercase text-xs-center">Seznam uporabnikov</h1>

                <ButtonBase classes="full-width" msg="Ustvari novega uporabnika" @clicked="addNewUser"></ButtonBase>

                <UsersList ref="usersList" @editUser="setUserToEdit"/>
            </v-flex>

            <v-flex xs8 ml-4>
                <UserManagementForm ref="userForm" @userEdited="onUserEdited"/>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import UserManagementForm from "../../../components/Custom/UserManagementForm";
    import UsersList from "../../../components/Generic/UsersList";
    import ButtonBase from "../../../components/Generic/ButtonBase";
    
    import EventBus from '../../../utils/eventBus';

    export default {
        name: 'homeAdminUserManagement',
        components: {
            UsersList,
            ButtonBase,
            UserManagementForm
        },
        methods: {
            onUserEdited() {
                this.$refs.usersList.reloadData();

                EventBus.$emit('reloadUsersList');
            },
            
            addNewUser() {
                this.$refs.userForm.resetForm();
            },
            
            setUserToEdit(userData) {
                this.$refs.userForm.setUserToEdit(JSON.parse(JSON.stringify(userData)));
            }
        }
    }
</script>
