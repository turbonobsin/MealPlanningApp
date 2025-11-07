import { defineStore } from "pinia";
import { Profile, useProfilesStore } from "./profiles";

/**
 * @param {Date} date 
 */
export function getDateStr(date){
    return date.toLocaleString([],{dateStyle:"short"});
}

export const useCalendarStore = defineStore("calendar", () => {

    const profileStore = useProfilesStore();
    
    /**
     * Get information stored in the calendar for a particular day.
     * @param {Date} date
     */
    function getDay(date) {
        let dateStr = getDateStr(date);
        return profileStore.currentProfile.calendar.dates[dateStr];
    }

    /**
     * 
     * @param {number} recipeId 
     * @param {import("./profiles").MealType} mealType
     * @param {Date} date
     */
    function addRecipe(recipeId,mealType,date){
        let profile = profileStore.currentProfile;
        if(!profile) return;

        let dateStr = getDateStr(date);

        if(!profile.calendar.dates[dateStr]) profile.calendar.dates[dateStr] = {
            breakfast:undefined,
            lunch:undefined,
            dinner:undefined,
            recurring:undefined,
        };

        profile.calendar.dates[dateStr][mealType] = {
            mealType,
            recipeId,
            time:date // undefined for use default?
        };

        profileStore.saveProfile(profile);
    }

    /**
     * 
     * @param {Date} date 
     * @param {number} recipeId 
     * @param {import("./profiles").MealType} mealType 
     */
    function removeRecipe(date,mealType){
        let dateStr = getDateStr(date);
        let profile = profileStore.currentProfile;
        if(!profile) return;

        let day = profile.calendar.dates[dateStr];
        if(!day) return;

        day[mealType] = undefined;

        profileStore.saveProfile(profile);
    }

    /**
     * @private
     * @param {Profile} profile 
     * @param {Date} date 
     */
    function initCalendarDay(profile,date){
        if(!profile) return;
        
        let str = date.toISOString();
        if(!profile.calendar.dates[str]){
            profile.calendar.dates[str] = /**@type {CalendarDate}*/{
                recurring:{},
                // breakfast:{
                //     mealType:"breakfast",
                //     recipeId:undefined
                // }
            };
        }
    }

    function $reset() {

    }

    return {

        getDay,
        addRecipe,
        removeRecipe,

        $reset
    };
});

window.CALENDAR = () => {
    return useCalendarStore();
};