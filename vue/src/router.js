import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard/Dashboard'
import NotFound from './views/NotFound'
import HomeUserProject from "./views/Home/User/HomeUserProject";

import store from "@/utils/store";

Vue.use(Router);

const createRouter = () => new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/projects/:projectId',
            meta: {
                allowedRoles: ['system_user'],
                name: 'homeUserProject'
            },
            name: 'projectPage',
            component: HomeUserProject
        },
        {
            path: '*',
            name: 'notFound',
            component: NotFound
        }
    ]
});

const router = createRouter();

router.beforeEach((to, from, next) => {
    const currentUserRole = store.getters.currentUser.role;

    let isAllowed = true;

    if (to.meta.allowedRoles) {
        isAllowed = to.meta.allowedRoles.indexOf(currentUserRole) > -1;
    } else {
        //find the last matched (parent) route with roles restrictions
        let lastRestrictedRoute = to.matched.slice().reverse().find((match) => {
            return match.meta.allowedRoles;
        });

        if (lastRestrictedRoute) {
            isAllowed = lastRestrictedRoute.meta.allowedRoles.indexOf(currentUserRole) > -1;
        }
    }

    store.commit('isAllowedRoute', isAllowed);

    next();
});

export default router;
