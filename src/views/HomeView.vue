<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive } from 'vue'

const apiKey = "8091b135029642499cfa2a83e6513777";
const items = ref([])
let searchTerm = ref("");
let maxTime = ref("");
let excludedFoods = ref("");
let intolerances = ref([""]);
let recipeSearchLength = ref("");

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

function addIntolerances (checkbox) {
	if (checkbox.checked) {
		checkboxState = true;
		checkboxValue = checkbox.value;
		intolerances.push("," + checkboxValue);
		console.log(checkboxValue + "added");
		console.log(intolerances)
	}
}

//intolerance1.addEventListener(change, addIntolerances)


async function RecipeSearch (searchTerm, maxTime, excludedFoods, intolerances) {

		let url = new URL("https://api.spoonacular.com/recipes/complexSearch");
		url.searchParams.set("apiKey",apiKey);
		url.searchParams.set("query",searchTerm);
		if(maxTime != undefined && maxTime != ""){
			url.searchParams.set("maxReadyTime",maxTime);
		}
		if(excludedFoods != undefined && excludedFoods != ""){
			url.searchParams.set("excludeIngredients", excludedFoods);
		}
		if(intolerances != undefined && intolerances != ""){
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
		}else {
			console.log("request failed")
		}

}


/*onMounted(() => {
	addIntolerances();
})*/

</script>

<template>
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
			<!--diary, egg, gluten, grain, peanut, seafood, sesame, shellfish, soy, sulfite, tree nut, wheat-->
			

			<div class="centeredButton">
				<button class="button" @click="RecipeSearch(searchTerm, maxTime, excludedFoods, intolerances)">Search</button>
			</div>

        </div>

		<div class="results">
              <div v-if="recipeSearchLength === 0">No recipes found</div>
				<li v-for="item in items">
					<img :src= "item.image">
					<p>{{ item.title }}</p>
				</li>
        </div>


		<ul>
			<li><RouterLink to="/details">Details</RouterLink></li>
			<li><RouterLink to="/profile">Profile</RouterLink></li>
			<li><RouterLink to="/favorites">Favorites</RouterLink></li>
			<li><RouterLink to="/calendar">Calendar</RouterLink></li>
		</ul>
	</main>
</template>


