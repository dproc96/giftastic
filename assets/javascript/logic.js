// array to store all of the search terms

// function to format text for navigation, capitalize first letters

// function to format text for query, capitalize only first letter

// function to change active search term

// function to make API call for the search term, call the change active search term

// function to add a search term, have it also automatically search said term

// array to store gif objects added to favorites

// function to add gif objects to favorites

// function to store relevant data in a cookie

// function to read the cookie

//1. Create an object called Format to store the formatting methods
var Format = {
    formatForNavigation(string) {
        let characterArray = string.toLowerCase().split("");
        while (characterArray[0] === " ") {
            characterArray.shift();
        }
        characterArray[0] = characterArray[0].toUpperCase();
        for (let i = 0; i < characterArray.length; i++) {
            if (characterArray[i] === " ") {
                characterArray[i + 1] = characterArray[i + 1].toUpperCase();
            }
        }
        return characterArray.join("");
    }
}
//2. Create an object called Favorites to store favorite array and methods
//3. Create an object called Search to store search term array and methods
//4. Create an object called Storage to store storage methods
//5. Create event listeners to trigger methods
//6. Trigger on load events
