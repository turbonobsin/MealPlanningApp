import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", () => {
    
    /**
     * Get information stored in the calendar for a particular day.
     * @param {string} date
     */
    function getDay(date) {

    }

    function $reset() {

    }

    return {

        getDay,

        $reset
    };
});