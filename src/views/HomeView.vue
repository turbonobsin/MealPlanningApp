<script setup>
import { RouterLink } from 'vue-router';
import { onMounted, ref, useTemplateRef } from 'vue'
import { Recipe, useProfilesStore } from '@/stores/profiles';
import { useCalendarStore } from '@/stores/calendar';
import AddRecipeToCalMenu from '@/components/calendar/AddRecipeToCalMenu.vue';
import Modal from '@/components/Modal.vue';
import { useStateStore } from '@/stores/states';
import { filterDiets } from '@/stores/states';
import router, { apiKey } from '@/router';
import EscapeSymbols from '@/components/EscapeSymbols.vue';

const profilesStore = useProfilesStore();
const stateStore = useStateStore();

const items = ref(stateStore.resultsList);
const searchTerm = ref("");
const maxTime = ref("");

let excludedFoods = ref([...profilesStore.currentProfile.exclusions]);
let intolerances = ref([...profilesStore.currentProfile.allergies]);
const intolerancesList = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"];
const mealTypes = ["Appetizer", "Beverage", "Breakfast", "Dessert", "Main Course", "Side Dish"];
const excludeInput = useTemplateRef('exclude-input');

const typeChecked = ref(false);
const intoleranceChecked = ref(false);
const excludeChecked = ref(false);

const selectedOption = ref("");
let recipeSearchLength = ref("");


//Modal
const modal = ref(null)
let filtersApplied = ref(false);

function cancel() {
  modal.value.close()
}

function save(e) {
	// RecipeSearch();
	filtersApplied.value = true;
	modal.value.close(e);
}

function toggleIntolerance(item) {
	// if (checkbox.checked) {
	// 	checkboxState = true;
	// 	checkboxValue = checkbox.value;
	// 	intolerances.push("," + checkboxValue);
	// 	console.log(checkboxValue + "added");
	// 	console.log(intolerances)
	// }

	for (let i =0; i < intolerances.value.length; i++){
		if (intolerances.value[i] === item){
			intolerances.value.splice(i, 1);
			console.log(intolerances.value)
			return;
		}
	}
	intolerances.value.push(item);
}

function useDefaults(){
	intoleranceChecked.value = true;
	excludeChecked.value = true;
	intolerances.value = [...profilesStore.currentProfile.allergies];
	excludedFoods.value = [...profilesStore.currentProfile.exclusions];
}

function clearFilters(){
	typeChecked.value = true;
	intoleranceChecked.value = true;
	excludeChecked.value = true;
	intolerances.value = [];
	excludedFoods.value = [];
	selectedOption.value = '';
	maxTime.value = undefined;
}

function addExclusion(){
    let s = excludeInput.value.value;
    if (s){
        // if (s.includes(',')){
        //     s = s.replaceAll(',', '');
        // }
        let exclusions = s.replaceAll(", ",",").split(",");
        exclusions.forEach(item => {
            if (item){
                excludedFoods.value.push(item);
            }
        });
        excludeInput.value.value = '';
    }
}


async function RecipeSearch() {

	let url = new URL("https://api.spoonacular.com/recipes/complexSearch");
	url.searchParams.set("apiKey", apiKey.value);
	url.searchParams.set("query", searchTerm.value);
	if (maxTime.value != undefined && maxTime.value > 0) {
		url.searchParams.set("maxReadyTime", maxTime.value);
	}
	if (excludeChecked.value && excludedFoods.value != undefined && excludedFoods.value.length > 0) {
		url.searchParams.set("excludeIngredients", excludedFoods.value.join(","));
	}
	if (intoleranceChecked.value && intolerances.value != undefined && intolerances.value.length > 0) {
    	url.searchParams.set("intolerances", intolerances.value.join(","));
	}
	if (typeChecked.value && selectedOption.value != undefined && selectedOption.value != "") {
		url.searchParams.set("type", selectedOption.value);
	}


	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}

	let response = await fetch(url, options)

	if (response.status === 200) {

		let data = await response.json()
		// console.log(data)
		items.value = []; // first clear the search results

		data.results.forEach(item => {
			let temp = profilesStore.getRecipeData(item.id);
			if(!temp) temp = profilesStore.currentProfile.recentSearches.find(v => v.id === item.id);
			if (temp){
				items.value.push(temp);
			}
			else{
				items.value.push(item);
			}
		});
		console.log(items.value);
		// items.value = data.results;
		stateStore.resultsList = items.value;
		stateStore.showSearchResults = true;
		recipeSearchLength = data.results.length;
		console.log(recipeSearchLength)
		
		// profilesStore.saveSearchResults(data.results);
	} else {
		console.log("request failed")
		// items.value = profilesStore.currentProfile.recentSearches;
		// stateStore.resultsList = items.value;
		// stateStore.showSearchResults = true;
	}

}

function addToFavorites(recipe) {
	if(profilesStore.isFavorited(recipe.id)){
		profilesStore.removeRecipeFromFavoritesAnywhere(recipe.id,true);
		console.log("Removed from favorites");
	}
	else{
		profilesStore.addRecipeToFavorites(recipe);
		console.log("Added to Favorites Successfully!")
	}
}

/**
 * @param {Recipe} recipe
 */
function addToCalendar(recipe) {
	console.log("Added to Calendar")
	console.log(items.value)

	// calendarStore.addRecipe(recipe.id,prompt("Enter mealType: 'breakfast', 'lunch', 'dinner'",'lunch'),new Date());
	addToCalendarMenuOpen.value = true;
	addToCalendarRecipe.value = recipe;
}

const addToCalendarMenuOpen = ref(false);
const addToCalendarRecipe = ref();

function displayName(s) {
    if (s.length > 40){
        return s.slice(0, 40) + "..."
    }
    else return s
}
const str = ref("Test: &quot;");

</script>


<template>
	<EscapeSymbols :s="str"></EscapeSymbols>
	<h1 class="page-title">Hello, User!</h1>
	<main>
		<div class="search-bar h-center space-after spread">
			<input class="text-input search-input" type="text" placeholder="Find your next recipe..." v-model="searchTerm" @keypress.enter="RecipeSearch"/>
			<button :class="{'material-symbols-outlined': true, 'search-button': true, 'color-button': filtersApplied}" @click="modal.open()">filter_list</button>
			<button class="material-symbols-outlined search-button dark-button" @click="RecipeSearch">search</button>
		</div>

		<AddRecipeToCalMenu mode="add" v-if="addToCalendarMenuOpen" v-model="addToCalendarMenuOpen" :recipe="addToCalendarRecipe" :date="new Date()"></AddRecipeToCalMenu>
		
		<div class="scroll">
			<div v-if="stateStore.showSearchResults">
				<div class="h-center spread" style="padding: 0px 15px; margin-top: -5px">
					<h3>Found results:</h3>
					<span class="material-symbols-outlined" style="font-weight: 700" @click="stateStore.showSearchResults = false">close</span>
				</div>
				<div v-if="items.length === 0" class="no-results">
					No recipes found.
				</div>
				<div class="vertical result-list">
					<div v-for="item in items" :key="item.id" class="recipe-result-card">
						<img class="recipe-image" :src="item.image" alt="Recipe Image" />
						<div class="spread full-width gap10" style="padding: 10px 10px 10px 0px">
							<div class="vertical spread gap5">
								<span class="recipe-name">{{ displayName(item.title) }}</span>
								<span v-if="item.readyInMinutes" class="small color-text h-center gap5"><span class="material-symbols-outlined medium">nest_clock_farsight_analog</span>{{item.readyInMinutes ?? '-'}} min  |  {{item.nutrition?.nutrients[0].amount ?? '-'}} Cal.</span>
								<div v-if="item.diets" class="h-center gap10">
									<img v-for="icon in filterDiets(item.diets)" class="diet-icon" :src="icon.src"></img>
								</div>								
								<RouterLink :to="`/details/${item.id}`" class="see-full">See full recipe &gt;</RouterLink>
							</div>
							<div class="vertical spread">
								<span @click="addToFavorites(item)" role="button" :class="['material-symbols-outlined',{fill:profilesStore.isFavorited(item.id)}]">bookmark</span>
								<span @click="addToCalendar(item)" role="button" class="material-symbols-outlined">add</span>
							</div>
						</div>
					</div>
				</div>
			</div>
	
			<div v-show="!stateStore.showSearchResults" class="vertical result-list">
				<h3 style="margin-bottom: 0">Recently viewed:</h3>
				<div v-for="item in profilesStore.currentProfile.recentSearches" :key="item.id" class="recipe-result-card">
					<img class="recipe-image" :src="item.image" alt="Recipe Image" />
					<div class="spread full-width gap10" style="padding: 10px 10px 10px 0px">
						<div class="vertical spread gap5">
							<span class="recipe-name">{{ displayName(item.title) }}</span>
							<span class="small color-text h-center gap5"><span class="material-symbols-outlined medium">nest_clock_farsight_analog</span>{{item.readyInMinutes ?? '-'}} min  |  {{item.nutrition?.nutrients[0].amount ?? '-'}} Cal.</span>
							<div class="h-center gap10">
								<img v-for="icon in filterDiets(item.diets)" class="diet-icon" :src="icon.src"></img>
							</div>
							<RouterLink :to="`/details/${item.id}`" class="see-full">See full recipe &gt;</RouterLink>
						</div>
						<div class="vertical spread">
							<span @click="addToFavorites(item)" role="button" :class="['material-symbols-outlined',{fill:profilesStore.isFavorited(item.id)}]">bookmark</span>
							<span @click="addToCalendar(item)" role="button" class="material-symbols-outlined">add</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Modal ref="modal">
			<template #main>
				<div class="filter-window">
					<h4>Maximum Cook Time:</h4>
					<input class="text-input" type="number" id="maxTime" v-model="maxTime">
					<span>minutes</span><br>

					<!--Meal Type-->
					<input type="checkbox" :checked="typeChecked" @click="typeChecked = !typeChecked"></input>
					<h4>Meal Type:</h4><br>

					<div v-show="typeChecked" class="flex-wrap space-after">
						<div v-for="item in mealTypes" @click="selectedOption = (selectedOption === item) ? '' : item"
						:class="{'list-item': true, 'small': true, 'selected': selectedOption === item}">
							{{ item }}
						</div>
					</div>

					<!-- <div class="meal-type space-after">
						<input type="radio" id="main_course" name="meal_type" value="main course" v-model="selectedOption">
						<label for="main_course">Main Course</label><br>
						<input type="radio" id="side_dish" name="meal_type" value="side dish" v-model="selectedOption">
						<label for="side_dish">Side Dish</label><br>
						<input type="radio" id="dessert" name="meal_type" value="dessert" v-model="selectedOption">
						<label for="dessert">Dessert</label><br>
						<input type="radio" id="appetizer" name="meal_type" value="appetizer" v-model="selectedOption">
						<label for="appetizer">Appetizer</label><br>
						<input type="radio" id="breakfast" name="meal_type" value="breakfast" v-model="selectedOption">
						<label for="breakfast">Breakfast</label><br>
						<input type="radio" id="beverage" name="meal_type" value="beverage" v-model="selectedOption">
						<label for="beverage">Beverage</label>
					</div> -->

					<!--Intolerances-->
					<input type="checkbox" :checked="intoleranceChecked" @click="intoleranceChecked = !intoleranceChecked"></input>
					<h4>Intolerances: </h4><br>
					<div v-show="intoleranceChecked" class="flex-wrap space-after">
						<div v-for="item in intolerancesList" @click="toggleIntolerance(item)"
						:class="{'list-item': true, 'small': true, 'selected': intolerances.find(v => v === item)}">
							{{ item }}
						</div>
					</div>

					<!-- Excluded Ingredients -->
					<input type="checkbox" :checked="excludeChecked" @click="excludeChecked = !excludeChecked"></input>
					<h4>Excluded Ingredients:</h4>

					<div v-show="excludeChecked">
						<div class="text-input-button space-after">
							<input ref="exclude-input" class="text-input" placeholder="Ex. Celery, Apple, Beef..." @keypress.enter="addExclusion"></input>
							<button class="dark-button small" @click="addExclusion">Exclude</button>
						</div>
						<div class="flex-wrap">
							<div class="small list-item h-center spread medium-button" v-for="(item, i) in excludedFoods">
								<span>{{ item }}</span>
								<span class="material-symbols-outlined small" @click="excludedFoods.splice(i, 1)">close</span>
							</div>
						</div>
					</div>

					<!-- <div class="space-after flex-wrap h-center">
						<input class="text-input" type="text" id="excludedFoods">
						<button class="color-button">Add to list</button>
					</div> -->

					<!-- Profile Defaults -->
					<div class="flex-wrap space-before">
						<button class="blank-button" style="flex-grow: 1" @click="clearFilters">Clear All</button>
						<button class="blank-button" @click="useDefaults">Use Profile Defaults</button>
					</div>

					<!-- <input type="checkbox" v-model="intolerances" value="Dairy">
					<label for="intolerance1">Dairy</label><br>
					<input type="checkbox" v-model="intolerances" value="Egg">
					<label for="intolerance2">Egg</label><br>
					<input type="checkbox" v-model="intolerances" value="Gluten">
					<label for="intolerance3">Gluten</label><br>
					<input type="checkbox" v-model="intolerances" value="Grain">
					<label for="intolerance4">Grain</label><br>
					<input type="checkbox" v-model="intolerances" value="Peanut">
					<label for="intolerance5">Peanut</label><br>
					<input type="checkbox" v-model="intolerances" value="Seafood">
					<label for="intolerance6">Seafood</label><br>
					<input type="checkbox" v-model="intolerances" value="Sesame">
					<label for="intolerance7">Sesame</label><br>
					<input type="checkbox" v-model="intolerances" value="Shellfish">
					<label for="intolerance8">Shellfish</label><br>
					<input type="checkbox" v-model="intolerances" value="Soy">
					<label for="intolerance9">Soy</label><br>
					<input type="checkbox" v-model="intolerances" value="Sulfite">
					<label for="intolerance10">Sulfite</label><br>
					<input type="checkbox" v-model="intolerances" value="TreeNut">
					<label for="intolerance11">Tree Nut</label><br>
					<input type="checkbox" v-model="intolerances" value="Wheat">
					<label for="intolerance12">Wheat</label><br> -->
				</div>
			</template>

			<template #footer>
				<div class="two-grid space-before">
					<button class="color-button" @click.stop="save">Apply</button>
					<button class="blank-button" @click.stop="cancel">Cancel</button>
				</div>
			</template>
		</Modal>
	</main>
</template>

<style scoped>

.page-title {
	text-align: center;
	font-size: 1.6rem;
	font-weight: 700;
	color:var(--dark);
	margin-bottom: 1rem;
}

.search-bar {
	padding: 5px;
	gap: 10px;
	border-radius: 12px;
	border: 2px solid var(--medium);
	box-shadow: 0 3px 0px 0px var(--medium);
	background-color: var(--light);
}

.search-input{
	display: inline-block;
	width: 80%;
}

.search-button{
	padding: 7px;
}

.scroll{
	overflow: scroll;
	padding: 10px;
	margin: -10px;
	max-height: 80vh;
}

.result-list {
	gap: 10px;
	padding-bottom: 20px;
	margin-bottom: 100px;
	border-bottom: 2px solid var(--medium);
	animation: fade-in 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.recipe-result-card {
	display: flex;
	gap: 10px;
	background-color: var(--light);
	border-radius: 10px;
	overflow: hidden;
	border: 3px solid var(--dark);
	box-shadow: 0 4px 0px var(--dark);
	/* padding: 10px; */
	/* height: 100px; */
}

.recipe-image {
	background: repeating-linear-gradient(45deg,
			var(--medium),
			var(--light) 10px,
			var(--medium) 10px,
			var(--light) 20px);
	width: 30%;
	object-fit: cover;
}


.recipe-name {
	font-weight: 600;
	margin-right: 10px;
	font-size: smaller;
	width: 100%;
}

.icon-btn {
	/* background: var(--light); */
	/* border: none; */
	/* border-radius: 8px; */
	/* padding: 0.3rem; */
	/* cursor: pointer; */
	transition: background 0.2s ease;
}

.icon-btn:hover {
	background: var(--medium);
}

.filter-window label{
	/* font-weight: 600; */
	margin-right: 15px;
}

.filter-window input[type="radio"]{
	margin-right: 10px;
	/* transform: translateY(1px); */
}

.filter-window input[type="checkbox"]{
	margin-right: 10px;
	/* transform: translateY(1px); */
}

.filter-window h4 {
	margin: 5px 10px 15px 0px;
	display: inline-block;
}

.flex-wrap .text-input {
	flex-grow: 1;
}

#maxTime{
	width: 25px;
	margin-right: 7px;
}

input[type="checkbox"]{
	appearance: none;
	border: 2px solid var(--medium);
	border-radius: 3px;
	height: 15px;
	width: 15px;
	transform: translateY(5px);
}

input[type="checkbox"]:checked{
	background-color: var(--main-color);
	border-color: var(--main-color);
}

/* Link */
.see-full {
	text-decoration: none;
	color: var(--dark);
	font-size: small;
}

.see-full:hover {
	text-decoration: underline;
}

/* No results */
.no-results {
	text-align: center;
	color: var(--dark);
	font-style: italic;
	margin-top: 2rem;
}

</style>
