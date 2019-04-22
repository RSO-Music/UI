import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home/Home'
import NotFound from './views/NotFound'
import HomeAdmin from "./views/Home/Admin/HomeAdmin";
import HomeUser from "./views/Home/User/HomeUser";
import HomeUserProject from "./views/Home/User/HomeUserProject";
import HomeAdminUserManagement from "./views/Home/Admin/HomeAdminUserManagement";
import HomeAdminProjectManagement from "./views/Home/Admin/HomeAdminProjectManagement";
import HomeUserProjectEdit from "./views/Home/User/Project/HomeUserProjectEdit";
import HomeUserSprint from "./views/Home/User/Project/HomeUserSprint";
import HomeUserProductBacklog from "./views/Home/User/Project/HomeUserBacklog";
import SystemOverview from "./views/Overview/SystemOverview.vue";

import store from "@/utils/store";

Vue.use(Router);

const createRouter = () => new Router({
	mode: "history",
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			children: [
				{
					path: 'overview',
					name: 'overview',
					component: SystemOverview
				},
				{
					path: 'admin',
					name: 'homeAdmin',
					component: HomeAdmin,
					meta: {
						allowedRoles: ['Administrator']
					},
					children: [
						{
							path: 'userManagement',
							name: 'homeAdminUserManagement',
							component: HomeAdminUserManagement
						},
						{
							path: 'projectManagement',
							name: 'homeAdminProjectManagement',
							component: HomeAdminProjectManagement
						},
					]
				},
				{
					path: 'user',
					name: 'homeUser',
					component: HomeUser,
					meta: {
						allowedRoles: ['User']
					}
				},
				{
					path: 'user/project/:projectId',
					name: 'homeUserProject',
					component: HomeUserProject,
					meta: {
						allowedRoles: ['User'],
					},
					children: [
						{
							path: 'edit',
							name: 'homeUserProjectEdit',
							component: HomeUserProjectEdit
						},
						{
							path: 'sprintManagement',
							name: 'homeUserSprintManagemnet',
							component: HomeUserSprint
						},
						{
							path: 'userProductBackLog',
							name: 'homeUserProductBackLog',
							component: HomeUserProductBacklog
						}
					]
				}
			]
		},
		// THIS MUST BE AT THE BOTTOM, not found page...
		{
			path: '*',
			name: 'notFound',
			component: NotFound
		},
	]
});

const router = createRouter();

router.beforeEach((to, from, next) => {

	if (to.path === '/') next('/overview');

	else {

		// check if user has permission to view this page
		let currentUserRole = store.getters.currentUser.isAdmin ? 'Administrator' : 'User';
		let isAllowed = true;

		if (to.meta.allowedRoles) {
			isAllowed = to.meta.allowedRoles.indexOf(currentUserRole) > -1;
		}
		else {
			//find the last matched (parent) route with roles restrictions
			let lastRestrictedRoute = to.matched.slice().reverse().find((match) => {
				return match.meta.allowedRoles;
			});

			if (lastRestrictedRoute) {
				isAllowed = lastRestrictedRoute.meta.allowedRoles.indexOf(currentUserRole) > -1;
			}
		}

		store.commit('isAllowedRoute', isAllowed);
	}

	next();
});

export default router;
