import { defineStore } from "pinia";
import { useProfilesStore } from "./profiles";

export const useCalendarStore = defineStore("calendar", () => {

    const profileStore = useProfilesStore();
    
    /**
     * Get information stored in the calendar for a particular day.
     * @param {string} date
     */
    function getDay(date) {
        return profileStore.currentProfile.calendar.dates;
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