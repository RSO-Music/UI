<template>
    <div class="contentWrapper list-wrapper">
        <div class="list">
            <h1>Seznam uporabnikov</h1>

            <ButtonBase classes="full-width" msg="Ustvari novega uporabnika" @clicked="addNewUser"></ButtonBase>
            
            <UsersList ref="usersList" @editUser="setUserToEdit"/>
        </div>
        
        <div class="form-container">
            <UserManagementForm ref="userForm" @userEdited="onUserEdited"/>
        </div>
    </div>
</template>

<script>
    import UserManagementForm from "../../../components/Custom/UserManagementForm";
    import UsersList from "../../../components/Generic/UsersList";
    import ButtonBase from "../../../components/Generic/ButtonBase";

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
