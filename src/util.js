export class SearchResultItem {
    id = 0;
    title = "";
    image = "";
    imageType = "";
}

export class SearchResult {
    constructor(){

    }
    
    offset = 0;
    number = 0;
    totalResults = 0;

    /**@type {SearchResultItem[]} */
    results = [];
}