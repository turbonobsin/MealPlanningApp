<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive, onMounted } from 'vue'

const props = defineProps({ recipeId: String })

const apiKey = "8091b135029642499cfa2a83e6513777";
const items = ref([])

async function getRecipeDetails() {

	let url = new URL(`https://api.spoonacular.com/recipes/${props.recipeId}/information`);
    url.searchParams.set("apiKey", apiKey);
	
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
		//items.value = data.results;
		//recipeSearchLength = data.results.length;
		//console.log(recipeSearchLength)
	} else {
		console.log("request failed")
	}
}

onMounted(() => {
	getRecipeDetails();
})
</script>


<template>
    <h1>Recipe Details Page</h1>
    <div>RecipeId: {{ recipeId }}</div>
    <!--Recipe name-->
    <!--<img :src= "data.image">-->



    <!--Image-->


    <!--Cook Time, Level, Calories-->


    <!--Ingriends-->


    <!--Instructions-->
</template>