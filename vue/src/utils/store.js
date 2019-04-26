import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersistence({
    storage: localStorage,
    filter: (mutation) => mutation.type === 'login' || mutation.type === 'logout' || mutation.type === 'updateUserData',
    reducer: (state) => ({ user: state.user }),
});

const store = new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            isAdmin: false
        },
        editingProject: {},
        isAllowedRoute: true,
    },
    mutations: {
        login(state, userData) {
            state.user = userData;
            state.user.loggedIn = true;
            
            if (userData.role === 'system_admin') state.user.isAdmin = true;
        },
        
        logout(state) {
            state.user = {
                loggedIn: false,
            };
        },
        
        updateUserData(state, payload) {
            payload.userData.loggedIn = true;

            state.user = payload.userData;
        },
        
        isAllowedRoute(state, bool) {
            state.isAllowedRoute = bool;
        },
        
        editProject(state, project) {
            state.editingProject = project;
        }
    },
    getters: {
        currentUser(state) {
            return state.user;
        },
        
        isAllowedRoute(state) {
            return state.isAllowedRoute;
        },
        
        editingProject(state) {
            return state.editingProject;
        }

    },
    plugins: [vuexPersist.plugin]
});

export default store;