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