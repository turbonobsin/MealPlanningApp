# 10/15/25
- added some basic views for the pages needed by the app with the router supporting those pages
- started adding pinia stores for calendar, favorites, and profiles
- added types for profiles
- profiles now get loaded on page load and if there are no profiles saved then a default one is created and loaded

# 10/21/25
- changed recipes in folders to be ids instead of classes
j
# 10/22/25
- added the rest of the properties to the Recipe class

# 10/23/25
- added switch profile
- added remove profile
- added some type information

# 10/28/25
- started the calendar page

# 10/29/25
- added saveSearchResults
- added getRecipeData (from localStorage cache)
- added saveRecipeData (to localStorage cache)
- more work on calendar
- added icons to footer

# 10/30/25 
- added renameProfile
- fixed deleting profile when you delete the current one
- added addRecipeToFavorites
- added color property when creating a new profile

# 11/2/25
- fixed favorites page to load even if some of the recipes were invalid in the user data or if the recipe data couldn't be found
- fixed footer icons to always be dark and always use outlined icons
- added cleanup to profiles when they load to fix up some invalid data (nulls in favorites)
- added extra checks to addItemToFavorites and addRecipeToFavorites so that they fail if the inputed item was null
- removed the original links from HomeView
- added being able to go forward/backward or nav different months in the calendar view
- changed the calendar page to display a calendar in the month view with the few previous days of the last month and the few next days of the next month too but grayed out
- added accent for the current day
- started adding some styling for meals under the dates
- added moveItemToFavoriteFolder function in the profileStore 

# 11/4/25
- added css for animations for a slide up menu/panel at the bottom of the screen and added this to the calendar page
- added CalDate.vue to simplify date things on the calendar and reuse data
- added CalendarSlideUpData.vue wrapper for reusing data
- added calendarStore
    - started adding addRecipeId
    - started adding initCalendarDay
- refined some classes/types in the profileStore
- added styling and functionality to click on a date in the calendar page so that it opens the bottom panel with some simple debug info about it
    - clicking the same date again closes the menu

# 11/6/25
- added meal dots to dates on the calendar if a meal has been added there
- slide up menu in calendar page now displays all 3 meals picked if possible
- slide up menu has better animation now and has it's own close button
- added some better styling, image, and time on slide up menu
- added addRecipeId function to calendar store
- added removeRecipe function to calendar store
- fixed saveSearchResults to save even the search item data even if it isn't all the data
- fixed getRecipeData to pull data out of your recent searches if possible to be faster
- fixed HomeView to call saveSearchResults after successfully searching
- added "addToCalendar" functionality to home page
- made popup menu in calendar page closable by clicking off of it

# 11/9/25
- added menus for deleting recipe from calendar page
- added menus for adding a recipe to calendar pagef from the home page with a specific date/time and meal time