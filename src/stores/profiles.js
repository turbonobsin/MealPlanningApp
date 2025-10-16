import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export class CalendarRecurrance {
    /**
     * Optional
     * @default null
     * @type {string}
     */
    weekly = null;

    enabled = false;
}

export class CalendarDate {
    /**
     * @type {CalendarRecurrance}
     */
    recurring = {};
}

export class Calendar {
    /**
     * Map from date (8/15/25) to CalendarDate
     * @type {Map<string,CalendarDate>}
     */
    dates = {};
}

// 

export class FavoriteItem { }

export class Favorite extends FavoriteItem {
    name = "";
}

export class FavoriteFolder extends FavoriteItem {
    name = "";

    /**@type {FavoriteItem[]} */
    items = [];
}

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

    /**
     * Maps from RecipeId to array of notes
     * @type {Record<string,RecipeNote[]>}
     */
    notes = {};

    /**
     * The Calendar for this profile
     * @type {Calendar}
     */
    calendar;

    /**
     * @todo
     */
    recentSearches = [];
}

export const useProfilesStore = defineStore("profiles", () => {
    /**@type {import("vue").Reactive<Profile[]>} */
    const profiles = reactive([]);

    /**
     * This function get's called when the page loads and will load all profiles from LocalStorage into this store
     */
    function initProfiles() {
        console.log(":: loading profiles");

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
            createDefaultProfile();
        }
    }

    function createDefaultProfile() {
        console.log(":: creating default profile because none exist");

        /**@type {Profile} */
        let profile = {
            name: "Default Profile",

            favorites: {
                name: "root",
                items: []
            },
            allergies: [],
            exclusions: [],

            notes: {},

            calendar: {
                dates: {}
            },

            color: "#70f",
            recentSearches: []
        };

        addProfile(profile);
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
    }

    /**
     * Save a profile to LocalStorage
     * @param {Profile} profile 
     */
    function saveProfile(profile) {
        console.log(":: saved profile: " + profile.name);

        localStorage.setItem("profile_" + profile.name, JSON.stringify(profile));
    }

    function $reset() {

    }

    return {
        // system use
        initProfiles,
        createDefaultProfile,

        // general use
        addProfile,
        saveProfile,

        // 
        $reset
    };
});