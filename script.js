let request = new XMLHttpRequest();
request.open("GET", "movies.json", true);
request.send();
let mydata;
request.addEventListener('load', async () => {
    let movies = JSON.parse(request.responseText);
        await movies.forEach((movie)=>{
            show(movie)
        })
     mydata = movies
    }
)
document.querySelector('#searchbar').addEventListener('keyup', ()=>{
    document.querySelector('#tbody').innerHTML = ''
    let filtered = mydata.filter(function (movie) {
        return movie.title.toLowerCase().includes(document.querySelector('#searchbar').value.toLowerCase());
    })
    console.log(filtered)
    filtered.forEach((movie)=>{
        show(movie)
    })
} )
function show(data) {
    let row = document.createElement('tr');
    let poster = document.createElement('td');
    poster.setAttribute('scope', 'row');
    let img = document.createElement("img");
    img.setAttribute('src', data.poster);
    img.style.width = '70px'
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
        li.append(actor.name + actor.lastname);
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