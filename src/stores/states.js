import { defineStore } from "pinia";
import { ref } from "vue";
import { Recipe } from "./profiles";

/**
 * @typedef {{
 *      date:Date;
 *      meal:MealType;
 *      path:string
 * }} SelectRecipe
 */

/**
 * @typedef {{
 *      recipe:Recipe;
 *      mealType:MealType;
 *      date:Date;
 * }} AddToCalendarData
 */

export const useStateStore = defineStore("state", () => {
    const showSearchResults = ref(false);
    const resultsList = ref([]);

    // selecting a recipe
    /**@type {import("vue").Ref<SelectRecipe>} */
    const selectingRecipe = ref();

    /**@type {import("vue").Ref<Recipe>} */
    const currentRecipe = ref();

    // add to calendar
    const addToCalendarMenuOpen = ref(false);
    /**@type {import("vue").Ref<AddToCalendarData>} */
    const addToCalendarData = ref();

    return {
        showSearchResults,
        resultsList,
        selectingRecipe,
        currentRecipe,
        addToCalendarMenuOpen,
        addToCalendarData,
    };
});

export const diets = [
	{
		title: "gluten free",
		src: "/gluten_free.svg"
	},
	{
		title: "ovo vegetarian",
		src: "/ovo_vegetarian.svg"
	},
	{
		title: "lacto vegetarian",
		src: "/lacto_vegetarian.svg"
	},
	{
		title: "vegan",
		src: "/vegan.svg"
	},
	{
		title: "pescatarian",
		src: "/pescatarian.svg"
	},
	{
		title: "ketogenic",
		src: "/ketogenic.svg"
	},
	{
		title: "dairy free",
		src: "/dairy_free.svg"
	},
	{
		title: "empty_diets",
		src: "/empty_diets.svg"
	}
]

export function filterDiets(arr){
    if (!arr) return [diets[7]];
	let res = [];
	let s = arr.find(v => { v.includes("vegetarian")});
	if (arr.includes("vegan")){
		res.push(diets[3]);
	}
	else if (s){
		if (s.includes("ovo")) res.push(diets[1]);
		else res.push(diets[2]);
	}
	if (arr.includes("pescatarian")) res.push(diets[4]);
	if (arr.includes("gluten free")) res.push(diets[0]);
	if (arr.includes("ketogenic")) res.push(diets[5]);
	if (arr.includes("dairy free")) res.push(diets[6]);

	return res;
}