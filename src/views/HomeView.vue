<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive } from 'vue'

const apiKey = "8091b135029642499cfa2a83e6513777";
const items = ref([])
let searchTerm = ref("");
let maxTime = ref("");
let excludedFoods = ref("");
let intolerances = ref("");
let recipeSearchLength = ref("");

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

		//items.value = data.data;
		//playerSearchLength.value = data.data.length;
		//pagesData.value = data.meta.next_cursor;
		//previousPage.value = data.meta.prev_cursor;
		//console.log(data.length)

}


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
              <input type="text" id="intolerances" v-model="intolerances"><br><br>
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
