//###############- making the request and setting my data to global scope -###############
let request = new XMLHttpRequest();
request.open("GET", "movies.json", true);
request.send();
let myData;
let titleKey = 0;
let yearKey = 0;
let durationKey = 0;
let numberOfRows = 5;
//###############- Action on response -###############
request.addEventListener('load', async () => {
        let movies = JSON.parse(request.response);
        await show(movies);
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
        show(filtered);
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
                show(myData);
                titleKey = 1;
            } else {
                sortAscendant(myData,ev.target.id,ev.target);
                show(myData);
                titleKey = 0;
            }
        } else if (ev.target.id == 'year') {
            if (yearKey === 0) {
                sortDescending(myData, ev.target.id,ev.target);
                show(myData);
                yearKey = 1;
            } else {
                sortAscendant(myData,ev.target.id,ev.target);
                show(myData);
                yearKey = 0;
            }
        } else if (ev.target.id == 'duration') {
            if (durationKey === 0) {
                sortDescending(myData, ev.target.id,ev.target);
               show(myData);
                durationKey = 1;
            } else {
                sortAscendant(myData, ev.target.id,ev.target);
                show(myData);
                durationKey = 0;
            }
        }
    })
})
//#############- functions -################

function show(data) { //nothing much to say here just some basic manipulation
    let ArrayOfData = [];
    let firstIndex = 0;
    let lasIndex = 4;
    for (let i = 0; i < Math.ceil(data.length/5) ; i++) {
        (lasIndex>data.length) ? (lasIndex = data.length) : ArrayOfData.push(data.splice(firstIndex,lasIndex));
    }
    for( let i =0 ; i<numberOfRows ; i++){
        let object = data[i];
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
        object.festivals.forEach(festival => {
            let li = document.createElement('li')
            li.append(festival);
            festivalList.appendChild(li);
        })
        festivals.appendChild(festivalList);
        row.appendChild(festivals)
        document.querySelector('#tbody').appendChild(row)
    }
    createPages(data);
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
function createPages(data) {
    let numberOfPage = data.length /numberOfRows;
    let ul = document.createElement('ul');
    ul.classList.add('pagination')
    let previous = document.createElement("li");
    previous.classList.add('page-item');
    let a = document.createElement('a');
    a.classList.add('page-link');
    a.append('Previous')
    previous.append(a);
    ul.append(previous);
    for (let i = 0; i <numberOfPage ; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        let a = document.createElement('a');
        a.classList.add('page-link');
        a.append(i+1)
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
    document.querySelector('#pagination').innerHTML='';
    document.querySelector('#pagination').append(ul);
}