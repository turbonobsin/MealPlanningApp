<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles';

const apiKey = "8091b135029642499cfa2a83e6513777";
const items = ref([])
let searchTerm = ref("");
let maxTime = ref("");
let excludedFoods = ref("");
let intolerances = ref([""]);
let recipeSearchLength = ref("");
const profilesStore = useProfilesStore();

//checkbox variables
const intolerance1 = document.getElementById('intolerance1');
const intolerance2 = document.getElementById('intolerance2');
const intolerance3 = document.getElementById('intolerance3');
const intolerance4 = document.getElementById('intolerance4');
const intolerance5 = document.getElementById('intolerance5');
const intolerance6 = document.getElementById('intolerance6');
const intolerance7 = document.getElementById('intolerance7');
const intolerance8 = document.getElementById('intolerance8');
const intolerance9 = document.getElementById('intolerance9');
const intolerance10 = document.getElementById('intolerance10');
const intolerance11 = document.getElementById('intolerance11');
const intolerance12 = document.getElementById('intolerance12');

let checkboxState;
let checkboxValue;

function addIntolerances(checkbox) {
	if (checkbox.checked) {
		checkboxState = true;
		checkboxValue = checkbox.value;
		intolerances.push("," + checkboxValue);
		console.log(checkboxValue + "added");
		console.log(intolerances)
	}
}

//intolerance1.addEventListener(change, addIntolerances)

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
	if (intolerances != undefined && intolerances != "") {
		url.searchParams.set("intolerances", intolerances);
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
		console.log(data)
		items.value = data.results;
		recipeSearchLength = data.results.length;
		console.log(recipeSearchLength)
	} else {
		console.log("request failed")
	}

	//items.value = data.data;
	//playerSearchLength.value = data.data.length;
	//pagesData.value = data.meta.next_cursor;
	//previousPage.value = data.meta.prev_cursor;
	//console.log(data.length)

}
function addToFavorites(recipe) {
	profilesStore.addRecipeToFavorites(recipe);
	console.log("Added to Favorites Successfully!")
}

function addToCalendar() {
	console.log("Added to Calendar")
	console.log(items.value)
}


/*onMounted(() => {
	addIntolerances();
})*/

</script>

<!-- <template>
	<main>
		<h1>Hello, user!</h1>

		<div class="search">
			<label>Find your next recipe:   </label><br>
			<input type="text" required id="searchTerm" v-model="searchTerm"><br><br>
			
			<label>Maximum Cook Time:   </label><br>
			<input type="number" id="maxTime" v-model="maxTime"><br><br>

			<label>Excluded Foods:   </label><br>
			<input type="text" id="excludedFoods" v-model="excludedFoods"><br><br>

			<label>Intolerances:   </label><br>
			<input type="checkbox" name="intolerance" id="intolerance1" value="Diary">
			<label for="intolerance1">Diary</label><br>
			<input type="checkbox" name="intolerance" id="intolerance2" value="Egg">
			<label for="intolerance2">Egg</label><br>
			<input type="checkbox" name="intolerance" id="intolerance3" value="Gluten">
			<label for="intolerance3">Gluten</label><br>
			<input type="checkbox" name="intolerance" id="intolerance4" value="Grain">
			<label for="intolerance4">Grain</label><br>
			<input type="checkbox" name="intolerance" id="intolerance5" value="Peanut">
			<label for="intolerance5">Peanut</label><br>
			<input type="checkbox" name="intolerance" id="intolerance6" value="Seafood">
			<label for="intolerance6">Seafood</label><br>
			<input type="checkbox" name="intolerance" id="intolerance7" value="Sesame">
			<label for="intolerance7">Sesame</label><br>
			<input type="checkbox" name="intolerance" id="intolerance8" value="Shellfish">
			<label for="intolerance8">Shellfish</label><br>
			<input type="checkbox" name="intolerance" id="intolerance9" value="Soy">
			<label for="intolerance9">Soy</label><br>
			<input type="checkbox" name="intolerance" id="intolerance10" value="Sulfite">
			<label for="intolerance10">Sulfite</label><br>
			<input type="checkbox" name="intolerance" id="intolerance11" value="TreeNut">
			<label for="intolerance11">Tree Nut</label><br>
			<input type="checkbox" name="intolerance" id="intolerance12" value="Wheat">
			<label for="intolerance12">Wheat</label><br>
			<!--diary, egg, gluten, grain, peanut, seafood, sesame, shellfish, soy, sulfite, tree nut, wheat--
			

			<div class="centeredButton">
				<button class="button" @click="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)">Search</button>
			</div>

			<div class="centeredButton">
				<button class="button"
					@click="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)">Search</button>
			</div>

        </div>

		<!-- <div>Jessica's List</div> -->
<!-- <div class="results"> -->
<!-- <div v-if="recipeSearchLength === 0">No recipes found</div> -->
<!-- <RouterLink v-for="item in items" :to="`/details/${item.id}`"> -->
<!-- <img :src= "item.image"> -->
<!-- <p>{{ item.title }}</p> -->
<!-- </RouterLink> -->


<!--<li v-for="item in items">
					<img :src= "item.image">
					<p>{{ item.title }}</p>
				</li>-->
<!-- </div> --
	</main>
</template>
-->
<template>
	<main class="search-results-page">
		<h1 class="page-title">Hello, User!</h1>

		<div class="search-bar">
			<input type="text" placeholder="Find your next recipe..." v-model="searchTerm" />

			<button class="filter-btn" @click="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)">
				Search 
			</button>
		</div>
		<br>
			
		<h2 class="results-heading">Found results:</h2>

		<div v-if="items.length === 0" class="no-results">
			No recipes found.
		</div>

		<div v-for="item in items" :key="item.id" class="recipe-result-card">
			<div class="recipe-image">
				<img :src="item.image" alt="Recipe Image" />
			</div>

			<div class="recipe-info">
				<div class="recipe-header">
					<h3 class="recipe-name">{{ item.title }}</h3>
				</div>

				<div class="recipe-actions">
					<button @click="addToFavorites(item)" class="icon-btn">
						<span class="material-symbols-outlined">bookmark</span>
					</button>
					<button @click="addToCalendar(item)" class="icon-btn">
						<span class="material-symbols-outlined">add</span>
					</button>
				</div>
			</div>

			<RouterLink :to="`/details/${item.id}`" class="see-full">
				See full recipe &gt;
			</RouterLink>
		</div>

		<ul>
			<li><RouterLink to="/details">Details</RouterLink></li>
			<li><RouterLink to="/profile">Profile</RouterLink></li>
			<li><RouterLink to="/favorites">Favorites</RouterLink></li>
			<li><RouterLink to="/calendar">Calendar</RouterLink></li>
		</ul>
	</main>
</template>

<style scoped>

.search-results-page {
	font-family: 'Inter', sans-serif;
	background-color: var(--light);
	padding: 1.2rem;
	min-height: 100vh;
}

.page-title {
	text-align: center;
	font-size: 1.6rem;
	font-weight: 700;
	color:var(--dark);
	margin-bottom: 1rem;
}

.search-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: var(--light);
	border-radius: 12px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	padding: 0.4rem 0.8rem;
}

.search-bar input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 0.9rem;
	background: none;
}

.filter-btn {
	border: none;
	background: var(--dark);
	color: var(--light);
	border-radius: 8px;
	padding: 0.4rem 0.6rem;
	cursor: pointer;
	transition: background 0.2s ease;
}

.filter-btn:hover {
	background: var(--dark);
}

.results-heading {
	font-size: 1rem;
	font-weight: 600;
	margin: 1.5rem 0 0.8rem 0;
	color: var(--dark);
}

.recipe-result-card {
	background-color: var(--light);
	border-radius: 16px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
	padding: 1rem;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.7rem;
}

.recipe-image {
	background: repeating-linear-gradient(45deg,
			var(--medium),
			var(--light) 10px,
			var(--medium) 10px,
			var(--light) 20px);
	border-radius: 12px;
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.recipe-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12px;
}

.recipe-info {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.recipe-header {
	flex: 1;
	color: var(--dark);
}

.recipe-name {
	font-weight: 600;
	font-size: 1.05rem;
	color: var(--dark);
	margin-bottom: 0.3rem;
}

.recipe-actions {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	margin-left: 0.5rem;
}

.icon-btn {
	background: var(--light);
	border: none;
	border-radius: 8px;
	padding: 0.3rem;
	cursor: pointer;
	transition: background 0.2s ease;
}

.icon-btn:hover {
	background: var(--medium);
}

/* Link */
.see-full {
	text-align: right;
	font-size: 0.9rem;
	color: var(--dark);
	text-decoration: none;
	font-weight: 500;
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
