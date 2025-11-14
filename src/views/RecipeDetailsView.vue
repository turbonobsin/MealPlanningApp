<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref , reactive, onMounted, computed, onUnmounted } from 'vue'
import { Recipe, useProfilesStore } from '@/stores/profiles';
import AddRecipeToCalMenu from '@/components/calendar/AddRecipeToCalMenu.vue';
import { apiKey } from '@/router';
import { useStateStore } from '@/stores/states';

const props = defineProps({ recipeId: String })

const title = ref("")
const image = ref("")
const cookTime = ref("")
let calories = ref([])
let servings = ref("")
let ingredients = ref([])
let instructions = ref([])
const router = useRouter();

const profileStore = useProfilesStore();
const stateStore = useStateStore();

const recipeId = computed(()=>{
	return parseInt(props.recipeId);
});

const recipe = ref();

const note = ref(profileStore.getNote(recipeId.value));

async function getRecipeDetails() {
	let data = profileStore.currentProfile.recentSearches.find(v => v.id === Number(props.recipeId));
	console.log(data);
	if (data){
		title.value = data.title;
		image.value = data.image;
		cookTime.value = data.readyInMinutes;
		calories = data.nutrition.nutrients[0].amount;
		servings = data.servings;
		ingredients = data.extendedIngredients;
		instructions = data.analyzedInstructions;
		console.log("Loaded stored recipe");
		recipe.value = data;
		return;
	}

	let url = new URL(`https://api.spoonacular.com/recipes/${recipeId.value}/information?includeNutrition=true`);
    url.searchParams.set("apiKey", apiKey.value);
	
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}

	let response = await fetch(url, options)

	if (response.status === 200) {

		data = await response.json()
		recipe.value = data;
		console.log(data)
		title.value = data.title;
		image.value = data.image;
		cookTime.value = data.readyInMinutes;
		calories = data.nutrition?.nutrients[0].amount;
		servings = data.servings;
		ingredients = data.extendedIngredients;
		instructions = data.analyzedInstructions;

		if(!profileStore.currentProfile.recentSearches.some(v=>v.id == data.id)){
			data.extendedIngredients.forEach(v => v.checked = false);
			data.analyzedInstructions[0].steps.forEach(v => v.checked = false);
			profileStore.currentProfile.recentSearches.unshift(data);
			profileStore.saveProfile();
		}
	} else {
		console.log("request failed")
	}
}

onMounted(async () => {
	await getRecipeDetails();
	stateStore.currentRecipe = recipe.value;
});
onUnmounted(()=>{
	stateStore.currentRecipe = undefined;
});

function addToFavorites() {
	if(profileStore.isFavorited(recipeId.value)){
		profileStore.removeRecipeFromFavoritesAnywhere(recipeId.value,true);
	}
	else{
		profileStore.addItemToFavorites(recipeId.value);
		console.log("Added to Favorites Successfully!")
	}
}

function addToCalendar() {
	let recipe = profileStore.getRecipeData(recipeId.value);
	if(!recipe){
		console.warn("failed to open add to calendar menu, no recipe data was found for this recipe id",recipeId.value);
		return;
	}

	console.log("Added to Calendar")

	// calendarStore.addRecipe(recipe.id,prompt("Enter mealType: 'breakfast', 'lunch', 'dinner'",'lunch'),new Date());
	stateStore.addToCalendarMenuOpen = true;
	stateStore.addToCalendarData = {
		recipe,
		mealType:"breakfast",
		date:new Date(),
	};
}

// const addToCalendarMenuOpen = ref(false);
// const addToCalendarRecipe = ref();

const openInstructions = ref(false);

</script>

<template>
	<div class="h-center">
        <div class="material-symbols-outlined back-button" @click="router.back()">chevron_left</div>
        <h1 class="title">{{ title }}</h1>
    </div>

	<main class="vertical" style="padding-bottom: 150px">
		<AddRecipeToCalMenu mode="add" v-if="stateStore.addToCalendarMenuOpen && !stateStore.selectingRecipe" v-model="stateStore.addToCalendarMenuOpen" :recipe="stateStore.addToCalendarData.recipe" :date="new Date()"></AddRecipeToCalMenu>
		<AddRecipeToCalMenu mode="add" v-if="stateStore.addToCalendarMenuOpen && stateStore.selectingRecipe" v-model="stateStore.addToCalendarMenuOpen" :recipe="stateStore.addToCalendarData.recipe" :date="stateStore.addToCalendarData.date" :custom-meal-type="stateStore.addToCalendarData.mealType" :custom-time="stateStore.addToCalendarData.date"></AddRecipeToCalMenu>

		<!-- <div class="recipe-actions">
			<button @click="addToFavorites()" class="icon-btn">
				<span :class="['material-symbols-outlined',{fill:profileStore.isFavorited(recipeId)}]">bookmark</span>
			</button>
			<button @click="addToCalendar()" class="icon-btn">
				<span class="material-symbols-outlined">add</span>
			</button>
		</div> -->
		
		<div class="header-container space-after">
			<!--Image + Actions (Favorite/ Add to Calendar)-->
			<div class="recipe-image-block">
				<img class="recipe-image" :src="image" alt="Recipe Image"></img>
				<div class="recipe-actions h-center">
					<div :class="['material-symbols-outlined', 'recipe-action',{fill:profileStore.isFavorited(recipeId)}]" @click="addToFavorites()">bookmark</div>
					<div class="material-symbols-outlined recipe-action" @click="addToCalendar()">add</div>
				</div>
			</div>
			
			
			<!--Cook Time, servings, Calories-->
			<div class="recipe-specs v-center spaced-even">
				<div class="spec">
					<span class="medium">{{ cookTime }}m</span>
					<span class="small">Cook Time</span>
				</div>

				<div style="width: 100%; border-bottom: 2px solid var(--medium)"></div>

				<div class="spec">
					<span class="medium">{{ servings }}</span>
					<span class="small">Servings</span>
				</div>

				<div style="width: 100%; border-bottom: 2px solid var(--medium)"></div>
				
				<div class="spec">
					<span class="medium">{{ calories }}</span>
					<span class="small">Calories</span>
				</div>
			</div>
		</div>
		


		<div class="two-grid">
			<button :class="{'color-button': !openInstructions, 'blank-button': openInstructions}" @click="openInstructions = !openInstructions">Ingredients</button>
			<button :class="{'color-button': openInstructions, 'blank-button': !openInstructions}" @click="openInstructions = !openInstructions">Instructions</button>
		</div>

		<div class="scroll">
			<div v-show="!openInstructions" class="vertical gap10">
				<!-- <p class="bold">Ingredients:</p> -->
				<div class="h-center spread gap20" v-for="ingredient in ingredients" @click="ingredient.checked = !ingredient.checked">
					<span :class="{'checked': ingredient.checked}">{{ ingredient.original }}</span>
					<button :class="{'small-button': true, 'blank-button': true, 'color-button': ingredient.checked}"></button>
				</div>
			</div>
			<!-- {{ ingredient.original }} -->
	
			<!--Instructions-->
			<div v-show="openInstructions">
				<!-- <p class="bold">Instructions:</p> -->
				<div v-for="instruction in instructions" :key="instruction.name">
					<p v-for="step in instruction.steps" :key="step.number">
						{{ step.number }}. {{ step.step }}
					</p>
				</div>
			</div>
			<div class="gap-before">
				<p>Notes:</p>
				<textarea v-model="note" class="full-width text-input" style="box-sizing:border-box;min-height:4em"></textarea>
				<div v-if="note != profileStore.getNote(recipeId)" class="full-width two-grid half-space-before">
					<button class="color-button" @click="profileStore.saveNote(recipeId,note)">Save</button>
					<button class="blank-button" @click="note = profileStore.getNote(recipeId)">Cancel</button>
				</div>
			</div>
		</div>


	</main>
</template>

<style scoped>

.scroll{
	max-height: 45vh;
	padding: 20px 10px 200px 10px;
	margin: 0px;
}

.header-container{
	display: flex;
	border: 2px solid var(--dark);
	border-radius: 15px;
	overflow: hidden;
	min-height: 200px;
}

.recipe-image-block{
	position: relative;
	display: block;
	height: 200px;
}

.recipe-image{
	height: 100%;
	object-fit: cover;
}

.recipe-actions{
	position: absolute;
	gap: 10px;
	bottom: 15px;
	left: 15px;
}

.recipe-action{
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--light);
	color: var(--dark);
	border-radius: 50%;
	height: 40px;
	width: 40px;
}

.recipe-specs {
	padding: 5px;
	background-color: white;
	width: 100px;
	/* height: 200px; */
}

.spec{
	display: flex;
	flex-direction: column;
	align-items: center;
}

.checked{
	text-decoration: line-through;
}

.color-button{
	border: 2px solid var(--main-color);
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