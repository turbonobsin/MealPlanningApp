<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref , reactive, onMounted, computed, onUnmounted, useTemplateRef } from 'vue'
import { Recipe, useProfilesStore } from '@/stores/profiles';
import AddRecipeToCalMenu from '@/components/calendar/AddRecipeToCalMenu.vue';
import { apiKey, switchAPIKey } from '@/router';
import { filterDiets, useStateStore } from '@/stores/states';
import EscapeSymbols from '@/components/EscapeSymbols.vue';

const props = defineProps({ recipeId: String })

const title = ref("")
const image = ref("/Placeholder_Image.png")
const cookTime = ref("")
let calories = ref(0)
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

async function getRecipeDetails(checks=0) {
	let data = profileStore.getRecipeData(props.recipeId);
	if(!data?.nutrition) data = profileStore.currentProfile.recentSearches.find(v => v.id === Number(props.recipeId));
	console.log(data);
	if (data && data?.nutrition){
		title.value = data.title;
		image.value = data.image;
		cookTime.value = data.readyInMinutes;
		calories.value = data.nutrition.nutrients[0].amount;
		servings.value = data.servings;
		ingredients.value = data.extendedIngredients;
		instructions.value = data.analyzedInstructions;
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
		calories.value = data.nutrition?.nutrients[0].amount;
		servings.value = data.servings;
		ingredients.value = data.extendedIngredients;
		instructions.value = data.analyzedInstructions;
		
		if(!profileStore.currentProfile.recentSearches.some(v=>v.id == data.id)){
			profileStore.saveRecipeData(data);
			data.extendedIngredients.forEach(v => v.checked = false);
			data.analyzedInstructions[0].steps.forEach(v => v.checked = false);
			profileStore.currentProfile.recentSearches.unshift(data);
			profileStore.saveProfile();
		}
	}
	else if(response.status == 402){ // payment required
		if(checks >= 1){
			alert("No more requests available at this time");
			return;
		}
		// switch and retry...
		switchAPIKey();
		getRecipeDetails(checks+1);
		return;
	}
	else{
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
const ingredientsChecked = ref(false);
const instructionsChecked = ref(false);

function check(item){
	item.checked = !item.checked;
	if (!item.checked){
		if (item.aisle) ingredientsChecked.value = false;
		else instructionsChecked.value = false;
	}
}

function checkAll(items){
	if (items[0].aisle){
		if (ingredientsChecked.value){
			items.forEach(v => v.checked = false);
			ingredientsChecked.value = false;
		}
		else {
			items.forEach(v => v.checked = true);
			ingredientsChecked.value = true;
		}
	}
	else{
		if (instructionsChecked.value){
			items.forEach(v => v.checked = false);
			instructionsChecked.value = false;
		}
		else{
			items.forEach(v => v.checked = true);
			instructionsChecked.value = true;
		}
	}
}

const headerDown = ref(true);
const headerBlock = useTemplateRef('header');
function resizeHeader(){
	if (headerBlock.value){
		if (headerDown.value){
			headerBlock.value.classList.add('header-up');
			headerDown.value = false;
			console.log('pulled up')
		}
		else{
			headerBlock.value.classList.remove('header-up');
			headerDown.value = true;
			console.log('pulled down');
		}
	}
}

</script>

<template>
	<div class="h-center">
        <div class="material-symbols-outlined back-button" @click="router.back()">chevron_left</div>
        <h1 class="title">Recipe Details</h1>
    </div>
	<h3 class="medium" style="margin: 15px;">{{ title }}</h3>
	<div class="h-center gap10 flex-wrap" style="padding: 0px 0px 10px 20px">
		<div v-for="icon in filterDiets(recipe?.diets)" class="h-center gap10">
			<img class="diet-icon" :src="icon.src"></img>
			<span class="small">{{ icon.title }}</span>
		</div>
	</div>

	<main class="vertical" style="max-height: 80vh; overflow: hidden">
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
		
		<div ref="header" class="header-container spread space-after">
			<!--Image + Actions (Favorite/ Add to Calendar)-->
			<div class="recipe-image-block">
				<img class="recipe-image" :src="image" alt="Recipe Image"></img>
				<div class="recipe-actions h-center">
					<div :class="['material-symbols-outlined', 'recipe-action',{fill:profileStore.isFavorited(recipeId)}]" @click="addToFavorites()">bookmark</div>
					<div class="material-symbols-outlined recipe-action" @click="addToCalendar()">add</div>
					<div class="material-symbols-outlined recipe-action" @click="resizeHeader()">{{(headerDown) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</div>
				</div>
			</div>
			
			
			<!--Cook Time, servings, Calories-->
			<div class="recipe-specs v-center spaced-even">
				<div class="spec">
					<span class="medium">{{ cookTime }}m</span>
					<span class="small">Cook Time</span>
				</div>

				<div v-show="headerDown" style="width: 100%; border-bottom: 2px solid var(--medium)"></div>

				<div v-show="headerDown" class="spec">
					<span class="medium">{{ servings }}</span>
					<span class="small">Servings</span>
				</div>

				<div v-show="headerDown" style="width: 100%; border-bottom: 2px solid var(--medium)"></div>
				
				<div v-show="headerDown" class="spec">
					<span class="medium">{{ calories }}</span>
					<span class="small">Calories</span>
				</div>
			</div>
		</div>
		


		<div class="two-grid space-after">
			<button :class="{'color-button': !openInstructions, 'blank-button': openInstructions}" @click="openInstructions = !openInstructions">Ingredients</button>
			<button :class="{'color-button': openInstructions, 'blank-button': !openInstructions}" @click="openInstructions = !openInstructions">Instructions</button>
		</div>

		<div class="scroll">
			<div v-show="!openInstructions" class="vertical gap10">
				<div class="h-center gap10" @click="checkAll(ingredients)">
					<button :class="{'check-button': true, 'color-button': ingredientsChecked}"></button>
					<span class="small">Check/Uncheck all</span>
				</div>
				<!-- <p class="bold">Ingredients:</p> -->
				<div class="h-center gap10" v-for="ingredient in ingredients" @click="check(ingredient)">
					<button :class="{'material-symbols-outlined': true, 'check-button': true, 'color-button': ingredient.checked, 'center': true}">check</button>
					<span :class="{'checked': ingredient.checked}">{{ ingredient.original }}</span>
				</div>
			</div>
			
			<!--Instructions-->
			<div v-show="openInstructions">
				<!-- <p class="bold">Instructions:</p> -->
				<div v-for="instruction in instructions" :key="instruction.name" class="vertical gap10 medium">
					<div class="h-center gap10 space-before" @click="checkAll(instruction.steps)">
						<button :class="{'check-button': true, 'color-button': instructionsChecked}"></button>
						<span class="small">Mark/unmark all</span>
					</div>
					<span v-for="step in instruction.steps" :key="step.number" :class="{'step': true, 'checked-step': step.checked}" @click="check(step)">
						<div class="step-number">{{ step.number }}.</div>
						<EscapeSymbols style="display:block" :s="step.step"></EscapeSymbols>
					</span>
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
	/* max-height: 45vh; */
	padding: 10px 10px 25vh 10px;
	margin: 0px -10px;
}

.header-container{
	display: flex;
	flex-wrap: wrap;
	border: 2px solid var(--dark);
	border-radius: 15px;
	min-height: 200px;
	max-height: 200px;
	overflow: hidden;
	transition: min-height .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.header-up{
	min-height: 60px;
}

.header-up .recipe-image-block{
	height: 60px;
}

.header-up .recipe-actions{
	bottom: 50%;
	transform: translateY(50%);
}

.recipe-image-block{
	position: relative;
	/* height: 200px; */
	height: 200px;
	width: 70%;
}

.recipe-image{
	height: 100%;
	width: 100%;
	object-fit: cover;
}

.recipe-specs {
	padding: 5px;
	/* background-color: white; */
	/* height: 100%; */
	width: 25%;
}

.spec{
	display: flex;
	flex-direction: column;
	align-items: center;
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
	box-shadow: 0px 3px 5px 0px var(--dark-perma);
}


.check-button{
	border: 2px solid var(--medium);
	/* padding: 2px; */
	height: 2px;
	width: 2px;
	font-size: medium;
	/* color: var(--medium); */
}

.checked{
	text-decoration: line-through;
}


.color-button{
	border: 2px solid var(--main-color);
	animation: pop .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

.step {
	display: flex;
	background-color: var(--light);
	color: var(--dark);
	border-radius: 10px;
	padding: 10px;
	gap: 10px;
	box-shadow: 0px 1px 3px 0px var(--medium);
}

.checked-step{
	text-decoration: line-through;
	background-color: var(--light-color);
	opacity: .7;
	box-shadow: none;
}

.step-number{
	display: block;
}

</style>