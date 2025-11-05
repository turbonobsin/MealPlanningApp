import { defineStore } from "pinia";
import { Profile, useProfilesStore } from "./profiles";

export const useCalendarStore = defineStore("calendar", () => {

    const profileStore = useProfilesStore();
    
    /**
     * Get information stored in the calendar for a particular day.
     * @param {string} date
     */
    function getDay(date) {
        return profileStore.currentProfile.calendar.dates;
    }

    /**
     * 
     * @param {number} recipeId 
     * @param {Date} date
     */
    function addRecipeId(recipeId,date){
        let profile = profileStore.currentProfile;
        if(!profile) return;

        // profile.calendar.dates[];
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

        $reset
    };
});

window.CALENDAR = () => {
    return useCalendarStore();
};