import { defineStore } from "pinia";
import { ref } from "vue";

export const useStateStore = defineStore("state", () => {
    const showSearchResults = ref(false);
    const resultsList = ref([]);

    return {showSearchResults, resultsList};
});