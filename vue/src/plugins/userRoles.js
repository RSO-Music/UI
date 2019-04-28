import Vue from 'vue'

const UserRoles = {
    install(VueInstance, options) {
        VueInstance.prototype.$userProjectRoles = [
            {
                text: 'Produktni vodja',
                value: 'product_owner'
            },
            {
                text: 'Vodja metodologije',
                value: 'scrum_master'
            },
            {
                text: 'Razvijalec',
                value: 'developer'
            }
        ]
    }
};

Vue.use(UserRoles, {});