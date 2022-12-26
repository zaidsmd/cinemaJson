let request = new XMLHttpRequest();
request.responseType = 'json'
request.open("GET", "movies.json", true);
request.send();
request.addEventListener('load', ()=> {
            const movies = request.response;
            console.log(movies);
    }
)
