<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive } from 'vue'

const apiKey = "8091b135029642499cfa2a83e6513777";
let searchTerm = ref("");

async function RecipeSearch (searchTerm) {
	event.preventDefault()

		const url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${apiKey}`

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
		<h1>This is the home page</h1>

		<div class="search">
              <label>Find your next recipe:   </label><br>
              <input type="text" required id="searchTerm" v-model="searchTerm"><br><br>				

              <div class="centeredButton">
                  <button class="button" @click="RecipeSearch(searchTerm)">Search</button>
              </div>

        </div>


		<ul>
			<li><RouterLink to="/details">Details</RouterLink></li>
			<li><RouterLink to="/profile">Profile</RouterLink></li>
			<li><RouterLink to="/favorites">Favorites</RouterLink></li>
			<li><RouterLink to="/calendar">Calendar</RouterLink></li>
		</ul>
	</main>
</template>
