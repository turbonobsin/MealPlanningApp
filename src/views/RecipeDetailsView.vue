<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive, onMounted } from 'vue'

const props = defineProps({ recipeId: String })

const apiKey = "8091b135029642499cfa2a83e6513777";
const title = ref("")
const image = ref("")
const cookTime = ref("")
let calories = ref([])
let servings = ref("")
let ingredients = ref([])
let instructions = ref([])

async function getRecipeDetails() {

	let url = new URL(`https://api.spoonacular.com/recipes/${props.recipeId}/information?includeNutrition=true`);
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
		title.value = data.title;
		image.value = data.image;
		cookTime.value = data.readyInMinutes;
		calories = data.nutrition.nutrients[0].amount;
		servings = data.servings;
		ingredients = data.extendedIngredients;
		instructions = data.analyzedInstructions;
	} else {
		console.log("request failed")
	}
}

onMounted(() => {
	getRecipeDetails();
})
</script>


<template>
    <h1>{{title}}</h1>
    
    
    <!--Image-->
	<img :src="image" alt="Recipe Image" />
	

    <!--Cook Time, servings, Calories-->
	<div class="across">
		<p>Cook Time<br>{{ cookTime }} min</p>
		<p>Servings<br>{{ servings }}</p>
		<p>Calories<br>{{ calories }} cal</p>
	</div>

    <!--Ingredients-->
	<div>
	<p>Ingredients:</p>
	<p v-for="ingredient in ingredients">
		{{ ingredient.original }}
	</p>
	</div>

    <!--Instructions-->
	<div>
		<p>Instructions:</p>
		<div v-for="instruction in instructions" :key="instruction.name">
			<p v-for="step in instruction.steps" :key="step.number">
				{{ step.number }}. {{ step.step }}
			</p>
  		</div>
	</div>

	<div>
		<p>Notes:</p>
		<textarea>

		</textarea>
	</div>
</template>

<style>
.across {
	display: flex;
	gap: 2rem;
	border-radius: 10px;
	outline: 2px solid black;
}

</style>