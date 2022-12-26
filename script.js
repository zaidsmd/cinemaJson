let request = new XMLHttpRequest();
request.open("GET", "movies.json", true);
request.send();
request.addEventListener('load', async ()=> {
             let movies =  JSON.parse(request.responseText);
            await movies.forEach( (movie)=>{
                console.log(movie)
            } )
    }
)