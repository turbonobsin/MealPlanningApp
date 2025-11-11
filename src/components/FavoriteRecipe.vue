<script setup>
import { FavoriteFolder, Recipe } from '@/stores/profiles';


const props = defineProps({
    recipe: Recipe
});

</script>

<template>
    <div v-if="recipe">
        <img :src="recipe.image"></img>
        <div>{{ recipe.title }}</div>
        <div>{{ recipe.cookingMinutes }}</div>
    </div>
    <div v-else>
        Not Available
    </div>
</template> 

<style scoped>



</style>