//Note :  To better understand please start by reading every function and understanding it  will leave comments like this one from part to part hope its helps
//###############- making the request and setting my data to global scope -###############
let request = new XMLHttpRequest();
request.open("GET", "Json/movies.json", true);
request.send();
let myData;
let titleKey = 0;
let yearKey = 0;
let durationKey = 0;
let lastArrayOfData = []
let numberOfRows = +document.querySelector('#numberOfRows').value; //read number of rows in table that should be created
//###############- Action on response -###############
request.addEventListener('load', async () => {
        let movies = JSON.parse(request.response);
        await show(movies, 0);
        myData = movies //setting the data to global scope to used again without requesting it from json another time bcs the json won't be edited anyway
    }
)
//###############- Search interface -###############
document.querySelector('#searchbar').addEventListener('keyup', () => { //add event to the search input
    let filtered = myData.filter(function (movie) {
        return movie.title.toLowerCase().includes(document.querySelector('#searchbar').value.toLowerCase());
        //filter the array to match the searched value ### toLowerCase was added to make the case-insensitive
    })
    if (filtered.length == 0) { //if statement here to make sure that the value entered match some data if not a sorry message will be projected to the user
        document.querySelector('.error').innerHTML = `We could’t find any matching to "${document.querySelector('#searchbar').value}"`;
    } else {
        document.querySelector('.error').innerHTML = '';
    }
    show(filtered, 0);
    console.log(filtered)

})
//###############- NumberOfRows Select -###############
document.querySelector('#numberOfRows').addEventListener('change', (e) => {
    numberOfRows = +e.target.value;
    show(extract(lastArrayOfData), 0)
})
//###############- Sort interface -###############
document.querySelectorAll('th:not(:first-child,:last-child,:nth-child(6),:nth-child(5))').forEach((th) => {
    th.addEventListener('click', (ev) => {
        document.querySelectorAll('th').forEach((e) => {
            e.classList.remove('descendant');
            e.classList.remove('ascendant');
        })
        if (ev.target.id == 'title') {
            if (titleKey === 0) {
                show(sortDescending(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                titleKey = 1;
            } else {
                show(sortAscendant(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                titleKey = 0;
            }
        } else if (ev.target.id == 'year') {
            if (yearKey === 0) {
                show(sortDescending(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                yearKey = 1;
            } else {
                show(sortAscendant(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                yearKey = 0;
            }
        } else if (ev.target.id == 'duration') {
            if (durationKey === 0) {
                show(sortDescending(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                durationKey = 1;
            } else {
                show(sortAscendant(extract(lastArrayOfData), ev.target.id, ev.target), 0);
                durationKey = 0;
            }
        }
    })
})

//#############- functions -################

//-------------------show function ----------------------
// this is the function responsible for showing the data in page
function show(data, indexOfData) {
    document.querySelector('#tbody').innerHTML = '';
    lastArrayOfData = [];
    let firstIndex = 0;
    let lasIndex = numberOfRows;

    for (let i = 0; i < Math.ceil(data.length / numberOfRows); i++) { // slice the array of data into smaller arrays in which evey on of them represent a page
        if (lasIndex > data.length) { // check if the last index is greater than the array length
            lasIndex = data.length
        }
        lastArrayOfData.push(data.slice(firstIndex, lasIndex));
        lasIndex += numberOfRows;
        firstIndex += numberOfRows;
    }

    for (let i = 0; i < lastArrayOfData[indexOfData].length; i++) {
        let object = lastArrayOfData[indexOfData][i]; //the array given will hav the smaller arrays like we said before, so we need to specify what is th page that we are creating and here comes the indexOfData that represent the page number -1
        let row = document.createElement('tr');
        let poster = document.createElement('td');
        poster.setAttribute('scope', 'row');
        let img = document.createElement("img");
        img.setAttribute('src', object.poster);
        img.style.width = '70px';
        poster.appendChild(img)
        row.appendChild(poster);
        let title = document.createElement('td');
        title.append(object.title);
        row.appendChild(title);
        let year = document.createElement('td');
        year.append(object.year);
        row.appendChild(year);
        let duration = document.createElement('td');
        duration.append(object.duration);
        row.appendChild(duration);
        let director = document.createElement('td');
        director.append(object.director);
        row.appendChild(director);
        let actors = document.createElement('td');
        const actorsList = document.createElement("ul");
        object.actors.forEach(actor => {
            let li = document.createElement('li')
            let p = document.createElement('p');
            p.append(actor.name + "  " + actor.lastname);
            li.append(p)
            let flag = document.createElement("img");
            flag.setAttribute('src', actor.nationality);
            flag.style.marginLeft = "1rem"
            li.append(flag)
            li.classList.add('justify-content-between');
            li.classList.add('pe-5')
            li.classList.add('d-flex');
            actorsList.append(li);
        })
        actors.appendChild(actorsList);
        row.appendChild(actors)
        let festivals = document.createElement('td');
        const festivalList = document.createElement("ul");
        object.festivals.forEach(festival => {
            let li = document.createElement('li')
            let p = document.createElement('p');
            p.append(festival);
            li.append(p)
            festivalList.appendChild(li);
        })
        festivals.appendChild(festivalList);
        row.appendChild(festivals)
        document.querySelector('#tbody').appendChild(row)
    }
    createPages(data, indexOfData);
}

//-------------------------------------------------------
//-------------------Sort functions ----------------------
// this function sort the array given from small to big
function sortAscendant(data, sortingValue, element) {
    element.classList.remove('descendant');
    element.classList.add('ascendant');
    data.sort((a, b) => {
        if (sortingValue == 'year') { //numbers cannot set to lowercase or upper case
            let A = a[sortingValue];
            let B = b[sortingValue];
            return (A > B) ? 1 : (A < B) ? -1 : 0;
        } else {
            let A = a[sortingValue].toLowerCase(); //to make caps and lower cases equal
            let B = b[sortingValue].toLowerCase(); //to make caps and lower cases equal
            return (A > B) ? 1 : (A < B) ? -1 : 0;
        }

    })
    return data;
}

// this function sort the array given from big to small
function sortDescending(data, sortingValue, element) {
    element.classList.add('descendant');
    element.classList.remove('ascendant');
    data.sort((a, b) => {
        if (sortingValue == 'year') { //numbers cannot set to lowercase or upper case
            let A = a[sortingValue];
            let B = b[sortingValue];
            return (A < B) ? 1 : (A > B) ? -1 : 0;
        } else {
            let A = a[sortingValue].toLowerCase(); //to make caps and lower cases equal
            let B = b[sortingValue].toLowerCase(); //to make caps and lower cases equal
            return (A < B) ? 1 : (A > B) ? -1 : 0;
        }

    })
    return data;
}

//------------------------------------------------------------
// this function create the pagination links and add event listeners to every page link to make it possible to surf into the pages
function createPages(data, indexOfData) {
    let numberOfPage = Math.ceil(data.length / numberOfRows); // here we divide the array length by number of rows that we want and then ceil the result to make the number integer
    let pagination = numberOfPage
    let ul = document.createElement('ul');
    ul.classList.add('pagination')
    let previous = document.createElement("li");
    previous.classList.add('page-item');
    let a = document.createElement('a');
    a.classList.add('page-link');
    a.append('Previous')
    if (indexOfData == 0) {
        previous.classList.add('disabled')
    } else { //this statement here is to test the page shown is it the first if so the previous button should be disabled bcs there is no previous page
        a.addEventListener('click', () => {
            show(extract(lastArrayOfData), document.querySelector('#pagination .active').dataset.page - 2); // this is just call to the show  and extract functions
        });
    }
    previous.append(a);
    ul.append(previous);
    for (let i = 0; i < numberOfPage; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        let a = document.createElement('a');
        a.classList.add('page-link');
        a.classList.add('d-none')
        a.append(`${i + 1}/${numberOfPage}`)
        a.setAttribute('data-page',`${i + 1}`)
        li.append(a);
        ul.append(li);
    }
    let next = document.createElement('li');
    next.classList.add('page-item');
    let nextA = document.createElement('a');
    nextA.classList.add('page-link');
    nextA.append('Next')
    next.append(nextA);
    ul.append(next);
    document.querySelector('#pagination').innerHTML = '';
    document.querySelector('#pagination').append(ul);
    document.querySelector(`#pagination li:nth-child(${indexOfData + 2})>a`).classList.add('active')
    document.querySelector(`#pagination li:nth-child(${indexOfData + 2})>a`).classList.remove('d-none')
    if (document.querySelector(`#pagination li:nth-child(${indexOfData + 2}) a`).dataset.page == numberOfPage) {
        document.querySelector('#pagination li:last-child').classList.add('disabled')
    } else {//this statement here is to test the page shown is it the last if so the next button should be disabled bcs there is no next page
        document.querySelector('#pagination li:last-child').addEventListener('click', () => {
            show(extract(lastArrayOfData), +document.querySelector(`#pagination .active`).dataset.page);
        });
    }

}

//-----------------------------------------------------------------
//-------------------Extract function--------------------
// this function is the hero of this algo because we have pagination the las modified array of data is divided into small arrays so before creating the table with the create function this function extract the small arrays into one big array
function extract(arrayToExtract) {
    let extractedArray = [];
    arrayToExtract.forEach(e => {
        e.forEach(e => {
            extractedArray.push(e);
        })
    })
    return extractedArray
}