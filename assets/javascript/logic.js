var gifCount = 0;
$(document).ready(function() {
    var Format = {
        formatForNavigation(string) {
            let characterArray = this.splitString(string)
            characterArray = this.removeSpacesAtStart(characterArray)
            characterArray = this.capitalizeFirstLetter(characterArray)
            characterArray = this.capitalizeFirstLetterOfWords(characterArray)
            return characterArray.join("")
        },
        formatForQuery(string) {
            let characterArray = this.splitString(string)
            characterArray = this.removeSpacesAtStart(characterArray)
            characterArray = this.capitalizeFirstLetter(characterArray)
            return characterArray.join("")
        },
        splitString(string) {
            let characterArray = string.toLowerCase().split("");
            return characterArray;
        },
        removeSpacesAtStart(characterArray) {
            while (characterArray[0] === " ") {
                characterArray.shift();
            }
            return characterArray;
        },
        capitalizeFirstLetter(characterArray) {
            characterArray[0] = characterArray[0].toUpperCase();
            return characterArray;
        },
        capitalizeFirstLetterOfWords(characterArray) {
            for (let i = 0; i < characterArray.length; i++) {
                if (characterArray[i] === " ") {
                    characterArray[i + 1] = characterArray[i + 1].toUpperCase();
                }
            }
            return characterArray
        }
    }
    var Favourites = {
        favourites: [],
        addToFavourites(gifId) {
            let gifHTML = `class="favourite-gif-div">${$(`#${gifId}`).html()}</div>`
            this.favourites.push(gifHTML)
            localStorage.setItem("favourites", JSON.stringify(this.favourites))
        },
        removeFromFavourites(gifId) {
            this.favourites.splice(parseInt(gifId), 1);
            localStorage.setItem("favourites", JSON.stringify(this.favourites))
        },
        loadFavourites() {
            for (let i = 0; i < JSON.parse(localStorage.getItem("favourites")).length; i++) {
                let gif = `<div id="${i}" ` + JSON.parse(localStorage.getItem("favourites"))[i]
                $("#gif-display").append(gif);
            }
        }
    }
    var Search = {
        terms: ["captain america", "spiderman"],
        addToSearchNav(term) {
            let termForNav = Format.formatForNavigation(term);
            let termForQuery = Format.formatForQuery(term);
            let termID = termForQuery.toLowerCase().split(" ").join("-");
            let navDiv = $("<div>");
            navDiv.attr("class","navigation-div");
            navDiv.attr("id","div-" + termID);
            let deleteButton = $("<a>");
            deleteButton.attr("href", "#");
            deleteButton.attr("class", "delete-search-term");
            deleteButton.attr("data-id", "div-" + termID);
            deleteButton.attr("data-term", term);
            deleteButton.text("X");
            navDiv.append(deleteButton)
            let a = $("<a>");
            a.attr("href", "#");
            a.text(termForNav);
            a.attr("data-query", termForQuery);
            a.attr("id", termID);
            a.attr("class", "navigation-option");
            navDiv.append(a)
            $("#search-terms").prepend(navDiv);
            this.setActiveTerm(termID);
        },
        searchTerm(term) {
            let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + term + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                let results = response.data;
                for (let result of results) {
                    let imageDiv = $("<div>");
                    imageDiv.attr("id", `gif-${gifCount}`);
                    imageDiv.attr("class", "gif-div");
                    gifCount++
                    let image = $("<img>");
                    image.attr("data-still", result.images.fixed_width_still.url);
                    image.attr("data-animate", result.images.fixed_width.url);
                    image.attr("data-state", "still");
                    image.attr("src", result.images.fixed_width_still.url);
                    image.attr("class", "gif");
                    imageDiv.append(image);
                    $("#gif-display").append(imageDiv);
                }
            })
        },
        setActiveTerm(termID) {
            $(".active").attr("class", "navigation-option");
            $(`#${termID}`).attr("class", "navigation-option active");
        },
        writeAllTerms() {
            for (let term of this.terms) {
                this.addToSearchNav(term);
            }
        }
    }

    function initiateSearch() {
        let term = $("#search").val();
        $("#search").val("");
        if (term.length > 0) {
            Search.terms.push(term);
            Search.addToSearchNav(term);
            $("#gif-display").empty();
            Search.searchTerm(Format.formatForQuery(term));
            localStorage.setItem("terms", JSON.stringify(Search.terms));
        }
    }

    $(document).keydown(function(event) {
        if (event.keyCode === 13) {
            initiateSearch()
        }
    })

    $("#search-button").click(function() {
        initiateSearch()
    })
    
    $(document).on("click", ".navigation-option", function() {
        event.preventDefault();
        console.log("click");
        let termID = $(this).attr("id");
        Search.setActiveTerm(termID);
        $("#gif-display").empty();
        if (termID != "favourites") {
            let term = $(this).attr("data-query");
            Search.searchTerm(term);
        }
        else {
            Favourites.loadFavourites();
        }
    })

    $(document).on("click", ".delete-search-term", function() {
        let term = $(this).attr("data-term");
        let termID = $(this).attr("data-id");
        let index = Search.terms.indexOf(term);
        Search.terms.splice(index, 1);
        localStorage.setItem("terms", JSON.stringify(Search.terms));
        $(`#${termID}`).remove();
    })

    $(document).on("click", ".gif", function() {
        if ($(this).attr("data-state") === "still") {
            $(this).attr("data-state", "animate")
            $(this).attr("src", $(this).attr("data-animate"))
        }
        else {
            $(this).attr("data-state", "still")
            $(this).attr("src", $(this).attr("data-still"))
        }
    })

    $(document).on("dblclick", ".gif-div", function() {
        let gifId = $(this).attr("id");
        Favourites.addToFavourites(gifId);
        alert("Added to favourites!")
    })

    $(document).on("dblclick", ".favourite-gif-div", function () {
        let gifId = $(this).attr("id");
        Favourites.removeFromFavourites(gifId);
        alert("Removed from favourites!")
        $("#gif-display").empty();
        Favourites.loadFavourites();
    })

    if (localStorage.getItem("terms")) {
        Search.terms = JSON.parse(localStorage.getItem("terms"));
    }
    if (localStorage.getItem("favourites")) {
        Favourites.favourites = JSON.parse(localStorage.getItem("favourites"));
    }
    Search.writeAllTerms();
    Search.setActiveTerm("favourites");
    if (localStorage.getItem("favourites")) {
        Favourites.loadFavourites()
    }
})