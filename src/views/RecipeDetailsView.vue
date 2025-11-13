<script setup>
import { RouterLink } from 'vue-router';
import { ref , reactive, onMounted } from 'vue'
import { useProfilesStore } from '@/stores/profiles';
import AddRecipeToCalMenu from '@/components/calendar/AddRecipeToCalMenu.vue';
import router from '@/router';

const props = defineProps({ recipeId: Number })

const apiKey = "8091b135029642499cfa2a83e6513777";
const title = ref("")
const image = ref("")
const cookTime = ref("")
let calories = ref([])
let servings = ref("")
let ingredients = ref([])
let instructions = ref([])

const profileStore = useProfilesStore();

const note = ref(profileStore.getNote(props.recipeId));

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

function addToFavorites() {
	if(profileStore.isFavorited(props.recipeId)){
		profileStore.removeRecipeFromFavoritesAnywhere(props.recipeId,true);
	}
	else{
		profileStore.addItemToFavorites(props.recipeId);
		console.log("Added to Favorites Successfully!")
	}
}

function addToCalendar() {
	let recipe = profileStore.getRecipeData(props.recipeId);
	if(!recipe){
		console.warn("failed to open add to calendar menu, no recipe data was found for this recipe id",props.recipeId);
		return;
	}

	console.log("Added to Calendar")

	// calendarStore.addRecipe(recipe.id,prompt("Enter mealType: 'breakfast', 'lunch', 'dinner'",'lunch'),new Date());
	addToCalendarMenuOpen.value = true;
	addToCalendarRecipe.value = recipe;
}

const addToCalendarMenuOpen = ref(false);
const addToCalendarRecipe = ref();

</script>

<template>
    <h1>{{title}}</h1>

	<main class="scroll-main">
		<AddRecipeToCalMenu v-if="addToCalendarMenuOpen" v-model="addToCalendarMenuOpen" :recipe="addToCalendarRecipe" :date="new Date()"></AddRecipeToCalMenu>

		<div class="recipe-actions">
			<button @click="router.back" class="icon-btn" style="margin-right:auto">
				<span class="material-symbols-outlined">arrow_back</span>
			</button>
			<button @click="addToFavorites()" class="icon-btn">
				<span :class="['material-symbols-outlined',{fill:profileStore.isFavorited(recipeId)}]">bookmark</span>
			</button>
			<button @click="addToCalendar()" class="icon-btn">
				<span class="material-symbols-outlined">add</span>
			</button>
		</div>
		
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
		<p class="bold">Ingredients:</p>
		<p v-for="ingredient in ingredients">
			{{ ingredient.original }}
		</p>
		</div>

		<!--Instructions-->
		<div>
			<p class="bold">Instructions:</p>
			<div v-for="instruction in instructions" :key="instruction.name">
				<p v-for="step in instruction.steps" :key="step.number">
					{{ step.number }}. {{ step.step }}
				</p>
			</div>
		</div>

		<div>
			<p>Notes:</p>
			<textarea v-model="note" class="full-width text-input" style="box-sizing:border-box;min-height:4em"></textarea>
			<div v-if="note != profileStore.getNote(recipeId)" class="full-width two-grid space-before">
				<button class="color-button" @click="profileStore.saveNote(recipeId,note)">Save</button>
				<button class="blank-button" @click="note = profileStore.getNote(recipeId)">Cancel</button>
			</div>
		</div>
	</main>
</template>

<style>

.recipe-actions {
	display: flex;
	gap: 2rem;
	margin-left: 0.5rem;
	font-size:1.5em !important;
}

.across {
	display: flex;
	gap: 2rem;
	border-radius: 10px;
	outline: 2px solid black;
}

.bold {
	font-weight: bold;
}

</style>