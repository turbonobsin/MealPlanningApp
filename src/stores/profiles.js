import { defineStore } from "pinia";
import { computed, reactive, ref, toRaw } from "vue";

// 

export class ExtendedIngredient {
    id = 0; // ingredient id
    name = ""; // butter

    original = ""; // 1 tbsp butter
    originalName = ""; // butter
    unit = ""; // tbsp

    aisle = "";
    amount = 0;
    consistency = ""; // solid, liquid
    image = ""; // url?
    measures = {
        metric: {
            amount: 0,
            unitLong: "",
            unitShort: ""
        },
        us: {
            amount: 0,
            unitLong: "",
            unitShort: ""
        }
    };

    /**@type {string[]} */
    meta = []; // extra info
}

export class SearchResult {
    id = 0; // recipe id
    title = "";
    image = ""; // url
    imageType = ""; // jpg
}

export class Recipe extends SearchResult {
    summary = ""; // description of recipe

    servings = 0;
    readyInMinutes = 0;
    cookingMinutes = 0;
    preparationMinutes = 0;

    license = "";
    sourceName = "";
    sourceUrl = "";
    spoonacularSourceUrl = ""; // may not be needed
    creditsText = "";

    healthScore = 0;
    pricePerServing = 0;
    analyzedInstructions = []; // not sure what type this one is

    cheap = false;
    cuisines = [];

    dairyFree = false;
    glutenFree = false;
    ketogenic = false;
    lowFodmap = false;
    sustainable = false;
    vegan = false;
    vegetarian = false;
    veryHealthy = false;
    veryPopular = false;
    whole30 = false;
    weighWatcherSmartPoints = 0;
    diets = [];

    /**@type {string[]} */
    dishTypes = [];

    /**@type {ExtendedIngredient[]} */
    extendedIngredients = [];
}

// 

export class CalendarRecurrance {
    /**
     * Optional
     * @default null
     * @type {string}
     */
    weekly = null;

    enabled = false;
}

/**
 * @typedef {"breakfast"|"lunch"|"dinner"} MealType
 */

export class DateMeal {
    /**
     * If undefined then use default time for this meal type
     * 
     * ISO Date string
     * @type {string | undefined}
     */
    time = undefined;

    /**@type {MealType} */
    mealType = "breakfast";

    /**@type {number|undefined} */
    recipeId = 0;
}

export class CalendarDate {
    /**
     * @type {CalendarRecurrance}
     */
    recurring = {};

    /**@type {DateMeal} */
    breakfast = {};
    /**@type {DateMeal} */
    lunch = {};
    /**@type {DateMeal} */
    dinner = {};
}

export class Calendar {
    /**
     * Map from date (8/15/25) to CalendarDate
     * @type {Record<string,CalendarDate>}
     */
    dates = {};
}

// 

export class FavoriteItem { }

// export class Favorite extends FavoriteItem {
//     name = "";
//     recipeId = 0;
// }

export class FavoriteFolder extends FavoriteItem {
    /**
     * The name of the new folder.
     * 
     * You can optionally add a parentFolder if you want this folder to be inside another custom folder, otherwise it's added into the root folder.
     * @param {String} name 
     */
    constructor(name) {
        super();
        this.name = name;
    }

    name = "";

    /** 
     * @type {(FavoriteFolder | number)[]}
     * @example
     * ```javascript
     *  items = [
            {
                name:"",
                items:[
                    {
                        name:"sub folder",
                        items:[]
                    },
                    75,
                    234
                ]
            },
            25,
            64
        ];
     * ```
    */
    items = [];
}

/**
 * @deprecated
 */
export class RecipeNote {
    /**
     * The content of the note
     * @type {string}
     */
    content = "";
}

export class Profile {
    /**
     * The name of this profile
     * @type {string}
     */
    name = "";

    /**
     * The favorite's root folder
     * @type {FavoriteFolder}
     */
    favorites;

    /**
     * @type {string[]}
     */
    allergies = [];

    /**
     * @type {string[]}
     */
    exclusions = [];

    /**
     * The color of this profile
     * @type {string}
     */
    color = "#f07";

    // /**
    //  * Maps from RecipeId to array of notes
    //  * @type {Record<string,RecipeNote[]>}
    //  */
    /**
     * Maps from RecipeId to note string
     * @type {Record<number,string>}
     */
    notes = {};

    /**
     * The Calendar for this profile
     * @type {Calendar}
     */
    calendar;

    /**
     * The list of the most recent search results
     * @type {Recipe[]}
     */
    recentSearches = [];
}

export const useProfilesStore = defineStore("profiles", () => {
    /**@type {import("vue").Reactive<Profile[]>} */
    const profiles = reactive([]);

    const currentProfileId = ref("");
    const currentProfile = computed(() => {
        return profiles.find(v => v.name == currentProfileId.value);
    });

    /**
     * This function get's called when the page loads and will load all profiles from LocalStorage into this store
     */
    function initProfiles() {
        console.log(":: loading profiles");

        /**@type {Profile[]} */
        let allProfiles = [];
        try {
            allProfiles = JSON.parse(localStorage.getItem("profiles"));
        }
        catch (e) { }

        allProfiles ??= [];

        for (const profileName of allProfiles) {
            let data = JSON.parse(localStorage.getItem("profile_" + profileName));

            profiles.push(data);
        }

        if (allProfiles.length != 0) console.log(`:: loaded (${allProfiles.length}) profiles`);

        // if no profiles, create default profile
        if (allProfiles.length == 0) {
            console.log(":: creating default profile because none exist");
            createDefaultProfile();
        }

        // clean up profiles
        for (const profile of profiles) {
            function loop(/**@type {FavoriteFolder}*/f) {
                f.items = f.items.filter(v => v != undefined);
            }
            loop(profile.favorites);
        }

        // load current profile selected
        currentProfileId.value = localStorage.getItem("currentProfileId");
        if (!profiles.some(v => v.name == currentProfileId.value)) {
            // if the current profile selected doesn't exist, then load the first one
            currentProfileId.value = profiles[0].name;
        }
        localStorage.setItem("currentProfileId", currentProfileId.value);
    }

    /**
     * Set the current profile
     * @param {Profile} profile
     */
    function switchProfile(profile) {
        console.log("switched to profile: " + profile.name);
        currentProfileId.value = profile.name;
        localStorage.setItem("currentProfileId", currentProfileId.value);
    }

    /**
     * Create a new profile with default options
     * @param {String} name 
     * @param {String} [color]
     */
    function createDefaultProfile(name = "Default Profile", color) {
        /**@type {Profile} */
        let profile = {
            name,

            favorites: {
                name: "Favorites",
                items: []
            },
            allergies: [],
            exclusions: [],

            notes: {},

            calendar: {
                dates: {}
            },

            color: color ?? "#70f",
            recentSearches: []
        };

        addProfile(profile);

        return profile;
    }

    /**
     * Add a new profile
     * @param {Profile} profile 
     */
    function addProfile(profile) {
        console.log(":: added new profile: " + profile.name);

        profiles.push(profile);
        saveProfile(profile);

        // update list of all profiles
        localStorage.setItem("profiles", JSON.stringify(profiles.map(v => v.name)));

        // when creating a new profile, automatically switch to it
        switchProfile(profile);
    }

    /**
     * Delete an existing profile
     * @param {Profile} profile
     */
    function removeProfile(profile) {
        console.log(":: removed profile: " + profile.name);

        let ind = profiles.findIndex(v => v.name == profile.name);
        if (ind == -1) {
            console.warn("failed to delete this profile, it doesn't exist in the list of profiles");
            return;
        }

        let newProfile = profiles[ind - 1] ?? profiles[0];

        profiles.splice(ind, 1);

        localStorage.removeItem("profile_" + profile.name);

        currentProfileId.value = newProfile.name;
        localStorage.setItem("currentProfileId", currentProfileId.value);

        // update list of all profiles
        localStorage.setItem("profiles", JSON.stringify(profiles.map(v => v.name)));

        // 

        if(profiles.length == 0){
            console.log("deleted the only profile...");
            createDefaultProfile();
        }
    }

    /**
     * Save a profile to LocalStorage
     * 
     * If no profile is specified, the current one is saved
     * @param {Profile} [profile] 
     */
    function saveProfile(profile) {
        if (!profile) profile = currentProfile.value;
        if (!profile) {
            console.warn("can't save profile, none selected");
            return;
        }

        console.log(":: saved profile: " + profile.name);

        localStorage.setItem("profile_" + profile.name, JSON.stringify(profile));
    }


    /**
     * Change the name of a profile and save it
     * @param {string} newName the new name of the profile
     * @param {Profile} [profile] which profile to change
     */
    function renameProfile(newName, profile) {
        if (!profile) profile = currentProfile.value;
        if (!profile) {
            console.warn("can't save profile, none selected");
            return;
        }

        if (profile.name == currentProfileId.value) {
            currentProfileId.value = newName;
            localStorage.setItem("currentProfileId", currentProfileId.value);
        }
        let oldName = profile.name;
        profile.name = newName;

        localStorage.removeItem("profile_" + oldName);
        localStorage.setItem("profile_" + newName, JSON.stringify(profile));

        console.log(":: changed the name of profile: " + profile.name + " to: " + newName);

        // save the new set of profile names
        localStorage.setItem("profiles", JSON.stringify(profiles.map(v => v.name)));
    }

    /**
     * Check if a specified recipe is favorited or not
     * @param {number} recipeId
     */
    function isFavorited(recipeId){
        let profile = currentProfile.value;
        if(!profile) return false;

        if(typeof recipeId == "string") recipeId = parseInt(recipeId);

        let root = profile.favorites;
        /**
         * @param {FavoriteFolder} f 
         */
        function search(f){
            if(!f) return false;
            if(f.items?.includes(recipeId)) return true;
            if(f.items) for(const item of f.items){
                if(typeof item == "number") continue;
                if(search(item)) return true;
            }
            return false;
        }
        return search(root);
    }

    // favorites
    /**
     * Add a Recipe to your favorites, optionally with a custom folder or else it will be put in the root folder
     * @param {number | FavoriteFolder} recipeId
     * @param {FavoriteFolder} [parentFolder]
     * @example
     * ```javascript
     * // simply add an item to favorites
     * let recipeId = 123;
     * profileStore.addItemToFavorites(recipeId);
     * 
     * // add an item to a specific favorites folder
     * let subFolder = new FavoriteFolder("nice desserts"); // assume we've already added this folder...
     * profileStore.addItemToFavorites(item, subFolder);
     * ```
     */
    function addItemToFavorites(recipeId, parentFolder) {
        if (recipeId == undefined) {
            alert("Failed to add recipe");
            console.warn("failed to add recipe: ", recipeId);
            return;
        }

        let profile = currentProfile.value;
        if (!profile) {
            console.warn("couldn't add to favorites, no current profile");
            return;
        }

        if (!parentFolder) parentFolder = profile.favorites;

        parentFolder.items.push(recipeId);

        saveProfile(profile);
    }

    /**
     * 
     * @param {Recipe} recipe 
     * @param {FavoriteFolder} [parentFolder] 
     */
    function addRecipeToFavorites(recipe, parentFolder) {
        if (!recipe) {
            alert("Failed to add recipe");
            console.warn("failed to add recipe: ", recipe);
            return;
        }

        let profile = currentProfile.value;
        if (!profile) {
            console.warn("couldn't add to favorites, no current profile");
            return;
        }

        if (!parentFolder) parentFolder = profile.favorites;

        saveRecipeData(recipe);
        parentFolder.items.push(recipe.id);

        saveProfile(profile);
    }

    /**
     * Add a Folder to your favorites, optionally with a custom folder or else it will be put in the root folder
     * @param {FavoriteFolder} folder 
     * @param {FavoriteFolder} [parentFolder]
     * @example
     * ```javascript
     * // add a new favorites folder to the root folder
     * let subFolder = new FavoriteFolder("nice desserts");
     * profileStore.addItemToFavorites(subFolder);
     * ```
     */
    function addFolderToFavorites(folder, parentFolder) {
        this.addItemToFavorites(folder, parentFolder);
    }

    /**
     * @param {number} recipeId
     * @param {boolean} skipCheck
     */
    function removeRecipeFromFavoritesAnywhere(recipeId,skipCheck=false){
        let profile = currentProfile.value;
        if(!profile) return false;

        if(!skipCheck) if(!isFavorited(recipeId)){
            console.warn("failed to remove recipe from anywhere, it wasn't favorited");
            return;
        }

        let root = profile.favorites;
        /**
         * @param {FavoriteFolder} f 
         */
        function search(f){
            if(!f) return undefined;
            if(f.items?.includes(recipeId)) return f;
            if(f.items) for(const item of f.items){
                if(typeof item == "number") continue;
                if(search(item)) return item;
            }
            return undefined;
        }
        root = search(root);

        if(!root){
            console.warn("failed to remove recipe from anywhere, couldn't find a folder that it was in");
            return;
        }

        removeItemFromFavorites(recipeId,root);
    }

    /**
     * Remove a Recipe from your favorites (specify a parent folder if this item is within a sub folder, otherwise it'll use the root folder)
     * @param {number | FavoriteFolder} recipeId 
     * @param {FavoriteFolder} [parentFolder]
     */
    function removeItemFromFavorites(recipeId, parentFolder) {
        let profile = currentProfile.value;
        if (!profile) {
            console.warn("couldn't add to favorites, no current profile");
            return;
        }

        if (!parentFolder) parentFolder = profile.favorites;

        // for future use potentially...
        // let ind = parentFolder.items.findIndex(v=>{
        //     if(!(v instanceof Favorite)) return false;
        //     return v.recipeId == item.recipeId;
        // });

        let ind = parentFolder.items.indexOf(recipeId);
        if (ind != -1) parentFolder.items.splice(ind, 1);
        else {
            console.warn("The item was not deleted because it wasn't found in the folder specified", { item: recipeId, parentFolder });
        }

        saveProfile(profile);
    }

    /**
     * Remove a Folder from your favorites (specify a parent folder if this item is within a sub folder, otherwise it'll use the root folder)
     * @param {FavoriteFolder} folder 
     * @param {FavoriteFolder} [parentFolder]
     */
    function removeFolderFromFavorites(folder, parentFolder) {
        removeItemFromFavorites(folder, parentFolder);
    }

    /**
     * Move recipeID or favorite folder to another favorite folder
     * @param {FavoriteFolder | number} item 
     * @param {FavoriteFolder} fromFolder
     * @param {FavoriteFolder} toFolder
     */
    function moveItemToFavoriteFolder(item, fromFolder, toFolder) {
        removeItemFromFavorites(item,fromFolder);
        addItemToFavorites(item,toFolder);
    }

    /**
     * Get a Recipe's information from it's recipeId
     * @param {number} recipeId 
     */
    function getDummyRecipe(recipeId) {
        let r = new Recipe();
        r.title = "Dummy Recipe";
        r.cookingMinutes = 123;
        r.healthScore = 2;
        r.id = recipeId;
        r.image = "https://img.spoonacular.com/recipes/716429-556x370.jpg";
        r.imageType = "jpg";
        r.license = "";
        r.preparationMinutes = 60;
        r.readyInMinutes = 50;
        r.servings = 10;
        return r;
    }

    /**
     * Save the results of the recipe search into the recent searches list
     * @param {SearchResult[]} results 
     */
    function saveSearchResults(results) {
        if (!Array.isArray(results)) {
            alert("Failed to save search results, wasn't an array");
            console.warn("Failed to save search results, wasn't an array", results);
            return;
        }

        let profile = currentProfile.value;
        if (!profile) {
            console.warn("couldn't add to recent search results because no profile was loaded");
            return;
        }

        console.log("saved search results");
        for(const result of results){
            saveRecipeData(result);
        }

        profile.recentSearches = results;
        saveProfile(profile);
    }

    /**
     * Get a cache'd recipe's data by its id
     * @param {number} recipeId 
     * @returns {Recipe}
     */
    function getRecipeData(recipeId) {
        if(recipeId == undefined) return undefined;

        let profile = currentProfile.value;
        let recent = profile.recentSearches.find(v=>v.id == recipeId);
        if(recent) return recent;
        
        let itemStr = localStorage.getItem("recipe_" + recipeId);
        if (!itemStr) {
            console.warn("couldn't find data for the recipe: " + recipeId);
            return;
        }
        return JSON.parse(itemStr);
    }

    /**
     * After getting and viewing a recipe's data, save it for later so we don't have to refetch
     * @param {Recipe} recipe
     */
    function saveRecipeData(recipe) {
        localStorage.setItem("recipe_" + recipe.id, JSON.stringify(recipe));
    }

    /**
     * Get the note from the corresponding recipe
     * @param {number} recipeId 
     */
    function getNote(recipeId){
        let profile = currentProfile.value;
        if(!profile) return;

        return profile.notes[recipeId] ?? "";
    }

    /**
     * Set the specified recipe's note content
     * @param {number} recipeId 
     * @param {string} content
     */
    function saveNote(recipeId,content){
        let profile = currentProfile.value;
        if(!profile) return;

        profile.notes[recipeId] = content;
        saveProfile(profile);
    }

    // 

    function $reset() {

    }

    return {
        // system use
        initProfiles,
        createDefaultProfile,

        // general use
        addProfile,
        saveProfile,
        removeProfile,
        switchProfile,
        renameProfile,
        currentProfile,
        profiles,

        // favorites
        addItemToFavorites,
        addFolderToFavorites,
        removeItemFromFavorites,
        removeFolderFromFavorites,
        addRecipeToFavorites,
        moveItemToFavoriteFolder,
        removeRecipeFromFavoritesAnywhere,
        isFavorited,

        // recipe data
        getDummyRecipe,
        saveSearchResults,
        getRecipeData,
        saveRecipeData,
        getNote,
        saveNote,

        // 
        $reset
    };
});

// DEBUG
window.PROFILES = {
    currentProfile: () => {
        return toRaw(useProfilesStore().currentProfile);
    },
    store: () => {
        return useProfilesStore();
    }
};

// console.log(new Date().toLocaleString([],{month:"long"}));

window.clearRecentSearches = ()=>{
    let s = useProfilesStore();
    s.currentProfile.recentSearches = [];
    s.saveProfile();
};