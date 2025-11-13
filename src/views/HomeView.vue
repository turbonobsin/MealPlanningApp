<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import { Recipe, useProfilesStore } from '@/stores/profiles';
import { useCalendarStore } from '@/stores/calendar';
import AddRecipeToCalMenu from '@/components/calendar/AddRecipeToCalMenu.vue';
import Modal from '@/components/Modal.vue';
import { useStateStore } from '@/stores/states';
import router from '@/router';

const profilesStore = useProfilesStore();
const stateStore = useStateStore();


// const apiKey = "8091b135029642499cfa2a83e6513777";
let apiKey = "72909a71317946c88a692ee6c6ed461a";
if(router.currentRoute.value.query.api == "jessica") apiKey = "8091b135029642499cfa2a83e6513777";
const items = ref(stateStore.resultsList);
const searchTerm = ref("");
const maxTime = ref("");
const excludedFoods = ref("");
const intolerances = ref([]);
let recipeSearchLength = ref("");

//let meal_type = ref("")

let checkboxState;
let checkboxValue;

//Modal
const modal = ref(null)
let filtersApplied = ref(false);

function cancel() {
  modal.value.close()
}

function save(e) {
	RecipeSearch(searchTerm.value, maxTime.value, excludedFoods.value, intolerances.value)
	filtersApplied.value = true;
	modal.value.close(e)
}

function addIntolerances(checkbox) {
	if (checkbox.checked) {
		checkboxState = true;
		checkboxValue = checkbox.value;
		intolerances.push("," + checkboxValue);
		console.log(checkboxValue + "added");
		console.log(intolerances)
	}
}


async function RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances) {

	let url = new URL("https://api.spoonacular.com/recipes/complexSearch");
	url.searchParams.set("apiKey", apiKey);
	url.searchParams.set("query", searchTerm);
	if (maxTime != undefined && maxTime != "") {
		url.searchParams.set("maxReadyTime", maxTime);
	}
	if (excludedFoods != undefined && excludedFoods != "") {
		url.searchParams.set("excludeIngredients", excludedFoods);
	}
	if (intolerances != undefined && intolerances.length > 0) {
    	url.searchParams.set("intolerances", intolerances.join(","));
	}
	//if (meal_type != undefined && meal_type != "") {
		//url.searchParams.set("type", meal_type);
	//}


	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}

	let response = await fetch(url, options)

	if (response.status === 200) {

		let data = await response.json()
		console.log(data)
		items.value = data.results;
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

</script>


<template>
	<h1 class="page-title">Hello, User!</h1>
	<main>
		<div class="search-bar h-center space-after spread">
			<input class="text-input" type="text" placeholder="Find your next recipe..." v-model="searchTerm" @keypress.enter="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)"/>
			<button :class="{'material-symbols-outlined': true, 'search-button': true, 'color-button': filtersApplied}" @click="modal.open()">filter_list</button>
			<button class="material-symbols-outlined search-button dark-button" @click="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)">search</button>
		</div>

		<AddRecipeToCalMenu v-if="addToCalendarMenuOpen" v-model="addToCalendarMenuOpen" :recipe="addToCalendarRecipe" :date="new Date()"></AddRecipeToCalMenu>
		
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
								<!-- <span class="small color-text h-center space-after gap5"><span class="material-symbols-outlined medium">nest_clock_farsight_analog</span>N/A  |  N/A Cal.</span> -->
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
				<h3 class="space-after">Recently opened:</h3>
				<div v-for="item in profilesStore.currentProfile.recentSearches" :key="item.id" class="recipe-result-card">
					<img class="recipe-image" :src="item.image" alt="Recipe Image" />
					<div class="spread full-width gap10" style="padding: 10px 10px 10px 0px">
						<div class="vertical spread gap5">
							<span class="recipe-name">{{ displayName(item.title) }}</span>
							<span class="small color-text h-center space-after gap5"><span class="material-symbols-outlined medium">nest_clock_farsight_analog</span>{{item.readyInMinutes}} min  |  {{item.nutrition.nutrients[0].amount}} Cal.</span>
							<RouterLink :to="`/details/${item.id}`" class="see-full">See full recipe &gt;</RouterLink>
						</div>
						<div class="vertical spread">
							<span @click="addToFavorites(item)" role="button" :class="['material-symbols-outlined',{fill:profilesStore.isFavorited(item.id)}]">bookmark</span>
							<span @click="addToCalendar(item)" role="button" class="material-symbols-outlined">add</span>
						</div>
					</div>
				</div>
	
				<!-- <div class="recipe-info">
					<div class="recipe-header">
						<h3 class="recipe-name">{{ item.title }}</h3>
					</div>
				</div>
				<div class="recipe-actions">
					<button @click="addToFavorites(item)" class="icon-btn">
						<span :class="['material-symbols-outlined',{fill:profilesStore.isFavorited(item.id)}]">bookmark</span>
					</button>
					<button @click="addToCalendar(item)" class="icon-btn">
						<span class="material-symbols-outlined">add</span>
					</button>
				</div> -->
	
				<!-- <RouterLink :to="`/details/${item.id}`" class="see-full">
					See full recipe &gt;
				</RouterLink> -->
			</div>
		</div>

		<Modal ref="modal">
			<template #main>
				<div>
				<label>Maximum Cook Time:   </label><br>
				<input type="number" placeholder="minutes" id="maxTime" v-model="maxTime"><br><br>

				<label>Excluded Foods:   </label><br>
				<input type="text" id="excludedFoods" v-model="excludedFoods"><br><br>

				<!--Meal Type-->
				<p>Meal Type:</p>
				<input type="radio" id="main_course" name="meal_type" value="main_course"></input>
				<label for="main_course">Main Course</label><br>
				<input type="radio" id="side_dish" name="meal_type" value="side_dish"></input>
				<label for="side_dish">Side Dish</label><br>
				<input type="radio" id="dessert" name="meal_type" value="dessert"></input>
				<label for="dessert">Dessert</label><br>
				<input type="radio" id="appetizer" name="meal_type" value="appetizer"></input>
				<label for="appetizer">Appetizer</label><br>
				<input type="radio" id="breakfast" name="meal_type" value="breakfast"></input>
				<label for="breakfast">Breakfast</label><br>
				<input type="radio" id="beverage" name="meal_type" value="beverage"></input>
				<label for="beverage">Beverage</label><br><br>

				<!--Intolerances-->
				<label>Intolerances: </label><br>
				<input type="checkbox" v-model="intolerances" value="Dairy">
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
				<label for="intolerance12">Wheat</label><br>
			</div>
			</template>
			<template #footer>
				<button class="medium-button" @click.stop="save">Apply</button>
				<button class="medium-button" @click.stop="cancel">Cancel</button>
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
}

.text-input{
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
	max-height: 70vh;
}

.result-list {
	gap: 10px;
	padding-bottom: 20px;
	margin-bottom: 30px;
	border-bottom: 2px solid var(--medium);
	animation: fade-in 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* .filter-button {
	/* border: none; */
	/* background: var(--dark); */
	/* color: var(--light); */
	/* border-radius: 8px; */
	/* padding: 0.4rem 0.6rem; */
	/* aspect-ratio: 1;
	cursor: pointer;
	transition: background 0.2s ease;
} */

/* 
.filter-btn:hover {
	background: var(--dark);
} */

.recipe-result-card {
	display: flex;
	gap: 10px;
	background-color: var(--light);
	border-radius: 10px;
	overflow: hidden;
	border: 3px solid var(--main-color);
	box-shadow: 0 4px 0px var(--main-color);
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
