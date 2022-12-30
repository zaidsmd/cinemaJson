//###############- making the request and setting my data to global scope -###############
let request = new XMLHttpRequest();
request.open("GET", "movies.json", true);
request.send();
let myData;
let titleKey = 0;
let yearKey = 0;
let durationKey = 0;
let numberOfRows = 5;
let lastArrayOfData = []
//###############- Action on response -###############
request.addEventListener('load', async () => {
        let movies = JSON.parse(request.response);
        await show(movies, 0);
        myData = movies //setting the data to global scope to used again without requesting it from json another time bcs the json won't be edited anyway
    }
)
//###############- Search -###############
document.querySelector('#searchbar').addEventListener('keyup', () => { //add event to the search input
    let filtered = myData.filter(function (movie) {
        return movie.title.toLowerCase().includes(document.querySelector('#searchbar').value.toLowerCase());
        //filter the array to match the searched value ### toLowerCase was added to make the case-insensitive
    })
    if (filtered.length == 0) { //if statement here to make sure that the value entered match some data if not a sorry message will be projected to the user
        document.querySelector('.error').innerHTML = `We could’t find any matching to "${document.querySelector('#searchbar').value}"`;
    } else {
        document.querySelector('.error').innerHTML = '';
        show(filtered, 0);
    }

})
document.querySelectorAll('th:not(:first-child,:last-child,:nth-child(6),:nth-child(5))').forEach((th) => {
    th.addEventListener('click', (ev) => {
        document.querySelectorAll('th').forEach((e) => {
            e.classList.remove('descendant');
            e.classList.remove('ascendant');
        })
        if (ev.target.id == 'title') {
            if (titleKey === 0) {
                sortDescending(myData, ev.target.id, ev.target);
                show(myData, 0);
                titleKey = 1;
            } else {
                sortAscendant(myData, ev.target.id, ev.target);
                show(myData, 0);
                titleKey = 0;
            }
        } else if (ev.target.id == 'year') {
            if (yearKey === 0) {
                sortDescending(myData, ev.target.id, ev.target);
                show(myData, 0);
                yearKey = 1;
            } else {
                sortAscendant(myData, ev.target.id, ev.target);
                show(myData, 0);
                yearKey = 0;
            }
        } else if (ev.target.id == 'duration') {
            if (durationKey === 0) {
                sortDescending(myData, ev.target.id, ev.target);
                show(myData, 0);
                durationKey = 1;
            } else {
                sortAscendant(myData, ev.target.id, ev.target);
                show(myData, 0);
                durationKey = 0;
            }
        }
    })
})

//#############- functions -################

function show(data, indexOfData) { //nothing much to say here just some basic manipulation
    document.querySelector('#tbody').innerHTML = '';
    lastArrayOfData = [];
    let firstIndex = 0;
    let lasIndex = numberOfRows;

    for (let i = 0; i < Math.ceil(data.length / numberOfRows); i++) {
        if (lasIndex > data.length) {
            lasIndex = data.length
        }
        lastArrayOfData.push(data.slice(firstIndex, lasIndex));
        lasIndex += numberOfRows;
        firstIndex += numberOfRows;
    }

    for (let i = 0; i < lastArrayOfData[indexOfData].length; i++) {
        let object = lastArrayOfData[indexOfData][i];
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
            li.append(actor.name + "  " + actor.lastname);
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
            li.append(festival);
            festivalList.appendChild(li);
        })
        festivals.appendChild(festivalList);
        row.appendChild(festivals)
        document.querySelector('#tbody').appendChild(row)
    }
    if (data[0][0] == null) {
        createPages(data, indexOfData);
    }
}

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
}

function sortDescending(data, sortingValue, element) {
    element.classList.add('descendant');
    element.classList.remove('ascendant');
    console.log(sortingValue)
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
}

function createPages(data, indexOfData) {
    let numberOfPage = Math.ceil(data.length / numberOfRows);
    let ul = document.createElement('ul');
    ul.classList.add('pagination')
    let previous = document.createElement("li");
    previous.classList.add('page-item');
    if (indexOfData == 0) {
        previous.classList.add('disabled')
    } else {
        previous.addEventListener('click', e => {
            show(extract(lastArrayOfData), document.querySelector('#pagination .active').innerHTML - 2);
        });
    }
    let a = document.createElement('a');
    a.classList.add('page-link');
    a.append('Previous')
    previous.append(a);
    ul.append(previous);
    for (let i = 0; i < numberOfPage; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        let a = document.createElement('a');
        a.classList.add('page-link');
        a.append(i + 1)
        a.addEventListener('click', e => {
            show(extract(lastArrayOfData), ((e.target.innerHTML) - 1));
        })
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
    if (document.querySelector(`#pagination li:nth-child(${indexOfData + 2}) a`).innerHTML == numberOfPage) {
        document.querySelector('#pagination li:last-child').classList.add('disabled')
    } else {
        document.querySelector('#pagination li:last-child').addEventListener('click', e => {
            show(extract(lastArrayOfData), +document.querySelector(`#pagination .active`).innerHTML);
        });
    }

}

function extract(arrayToExtract) {
    let extractedArray = [];
    arrayToExtract.forEach(e => {
        e.forEach(e => {
            extractedArray.push(e);
        })
    })
    return extractedArray
}