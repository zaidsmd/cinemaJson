//###############- making the request and setting my data to global scope -###############
let request = new XMLHttpRequest();
request.open("GET", "movies.json", true);
request.send();
let myData;
let titleKey = 0;
let yearKey = 0;
let durationKey = 0;
//###############- Action on response -###############
request.addEventListener('load', async () => {
        let movies = JSON.parse(request.response);
        await movies.forEach((movie) => { // await and async is added to make sure that request.response has been received
            show(movie)
        })
        myData = movies //setting the data to global scope to used again without requesting it from json another time bcs the json won't be edited anyway
    }
)
//###############- Search -###############
document.querySelector('#searchbar').addEventListener('keyup', () => { //add event to the search input
    document.querySelector('#tbody').innerHTML = ''; //clear the tbody to insert new array
    let filtered = myData.filter(function (movie) {
        return movie.title.toLowerCase().includes(document.querySelector('#searchbar').value.toLowerCase());
        //filter the array to match the searched value ### toLowerCase was added to make the case-insensitive
    })
    if (filtered.length == 0) { //if statement here to make sure that the value entered match some data if not an sorry message will be projected to the user
        document.querySelector('.error').innerHTML = `We could’t find any matching to "${document.querySelector('#searchbar').value}"`;
    } else {
        document.querySelector('.error').innerHTML = '';
        filtered.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
            show(movie);
        })
    }

})
document.querySelectorAll('th:not(:first-child,:last-child,:nth-child(6),:nth-child(5))').forEach((th) => {
    th.addEventListener('click', (ev) => {
        document.querySelectorAll('th').forEach((e)=>{
            e.classList.remove('descendant');
            e.classList.remove('ascendant');
        })
        if (ev.target.id == 'title') {
            if (titleKey === 0) {
                sortDescending(myData, ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                titleKey = 1;
            } else {
                sortAscendant(myData, ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                titleKey = 0;
            }
        } else if (ev.target.id == 'year') {
            if (yearKey === 0) {
                sortDescending(myData,ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                yearKey = 1;
            } else {
                sortAscendant(myData,ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                yearKey = 0;
            }
        } else if (ev.target.id == 'duration') {
            if (durationKey === 0) {
                sortDescending(myData, ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                durationKey = 1;
            } else {
                sortAscendant(myData, ev.target.id,ev.target);
                myData.forEach((movie) => { // literate into the filtered array and show the data in html table by using show function created below
                    show(movie);
                })
                durationKey = 0;
            }
        }
    })
})
//#############- functions -################
function show(data) { //nothing much to say here just some basic manipulation
    let row = document.createElement('tr');
    let poster = document.createElement('td');
    poster.setAttribute('scope', 'row');
    let img = document.createElement("img");
    img.setAttribute('src', data.poster);
    img.style.width = '70px';
    poster.appendChild(img)
    row.appendChild(poster);
    let title = document.createElement('td');
    title.append(data.title);
    row.appendChild(title);
    let year = document.createElement('td');
    year.append(data.year);
    row.appendChild(year);
    let duration = document.createElement('td');
    duration.append(data.duration);
    row.appendChild(duration);
    let director = document.createElement('td');
    director.append(data.director);
    row.appendChild(director);
    let actors = document.createElement('td');
    const actorsList = document.createElement("ul");
    data.actors.forEach(actor => {
        let li = document.createElement('li')
        li.append(actor.name +"  "+ actor.lastname);
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
    data.festivals.forEach(festival => {
        let li = document.createElement('li')
        li.append(festival);
        festivalList.appendChild(li);
    })
    festivals.appendChild(festivalList);
    row.appendChild(festivals)
    document.querySelector('#tbody').appendChild(row)
}

function sortAscendant(data, sortingValue,element) {
    element.classList.remove('descendant');
    element.classList.add('ascendant');
    document.querySelector('#tbody').innerHTML = '';
    data.sort((a, b) => {
        if (sortingValue =='year'){ //numbers cannot set to lowercase or upper case
            let A = a[sortingValue];
            let B = b[sortingValue];
            return (A > B) ? 1 : (A < B) ? -1 : 0;
        }else {
            let A = a[sortingValue].toLowerCase(); //to make caps and lower cases equal
            let B = b[sortingValue].toLowerCase(); //to make caps and lower cases equal
            return (A > B) ? 1 : (A < B) ? -1 : 0;
        }

    })
}

function sortDescending(data, sortingValue,element) {
    element.classList.add('descendant');
    element.classList.remove('ascendant');
    document.querySelector('#tbody').innerHTML = '';
    console.log(sortingValue)
    data.sort((a, b) => {
        if (sortingValue=='year'){ //numbers cannot set to lowercase or upper case
            let A = a[sortingValue];
            let B = b[sortingValue];
            return (A < B) ? 1 : (A > B) ? -1 : 0;
        }else {
            let A = a[sortingValue].toLowerCase(); //to make caps and lower cases equal
            let B = b[sortingValue].toLowerCase(); //to make caps and lower cases equal
            return (A < B) ? 1 : (A > B) ? -1 : 0;
        }

    })
}
