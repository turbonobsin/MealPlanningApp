<script setup>
import { FavoriteFolder, Recipe } from '@/stores/profiles';


const props = defineProps({
    recipe: Recipe
});

</script>

<template>
    <div>{{ recipe.title }}</div>
    <div>{{ recipe.cookingMinutes }}</div>
</template>