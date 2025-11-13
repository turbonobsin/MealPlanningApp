import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeDetailsView from '@/views/RecipeDetailsView.vue';
import ProfileView from '@/views/ProfileView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import CalendarView from '@/views/CalendarView.vue';
import SettingsView from '@/views/SettingsView.vue';
import { computed } from 'vue';

const router = createRouter({
	// history: createWebHistory(import.meta.env.BASE_URL),
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: "/details/:recipeId",
			name: "details",
			component: RecipeDetailsView,
			props: true,
		},
		// {
		// 	path: "/profile",
		// 	name: "profile",
		// 	component: ProfileView
		// },
		{
			path: "/favorites",
			name: "favorites",
			component: FavoritesView
		},
		{
			path: "/calendar",
			name: "calendar",
			component: CalendarView
		},
		{
			path: "/settings",
			children: [
				{
					path: "",
					name: "settings",
					component: SettingsView
				},
				{
					path: "/profile",
					name: "profile",
					component: ProfileView
				}
			]
		}
	],
});

export default router

// const apiKey = "8091b135029642499cfa2a83e6513777";
export let apiKey = computed(()=>{
	let custom = localStorage.getItem("customAPIKey");
	if(custom){
		console.warn("using customAPIKey",custom);
		return custom;
	}
	
	let key = "72909a71317946c88a692ee6c6ed461a";
	if(router.currentRoute.value.query.api == "jessica"){
		key = "8091b135029642499cfa2a83e6513777";
		console.warn("Set apiKey to Jessica's");
	}
	else{
		console.warn("Set apiKey to Amir's");
	}
	return key;
});