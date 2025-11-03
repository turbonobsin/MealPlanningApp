<script setup>
import { FavoriteFolder, Recipe } from '@/stores/profiles';


const props = defineProps({
    recipe: Recipe
});

</script>

<template>
    <div v-if="recipe">
        <div>{{ recipe.title }}</div>
        <div>{{ recipe.cookingMinutes }}</div>
    </div>
    <div v-else>
        Couldn't find recipe data
    </div>
</template> 