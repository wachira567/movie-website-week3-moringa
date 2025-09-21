const baseURL = "http://localhost:3000/films";

const movieList = document.getElementById("movie-list");
const ticketsLeft = document.getElementById("tickets-left");
const poster = document.getElementById("movie-poster");
const details = document.getElementById("movie-details");
const buyBtn = document.getElementById("buy-ticket");
const title = document.getElementById("movie-title");

let currentMovie = null; // movie being shown

fetch(baseURL)
  .then((res) => res.json())
  .then((movies) => {
    showMovieList(movies); // put all movie names in the left column or row1
    showMovie(movies[0]); // automatically show the first movie
  });

//Shows all movie names in the list
function showMovieList(movies) {
  movies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title; // name of the movie
    li.addEventListener("click", () => showMovie(movie)); // wshows details when clicked
    movieList.appendChild(li);
  });
}

//Show details of one movie
function showMovie(movie) {
  currentMovie = movie; // active movie
  poster.src = movie.poster;
  title.textContent = movie.title;
  details.textContent = `${movie.description} Runtime: ${movie.runtime}min | Showtime: ${movie.showtime}`;
  showTickets();
}

//Show how many tickets are left
function showTickets() {
  const available = currentMovie.capacity - currentMovie.tickets_sold;
  ticketsLeft.textContent = `Tickets Left: ${available}`;
  buyBtn.textContent = available > 0 ? "Buy Ticket" : "Sold Out";
}

//When user clicks "Buy Ticket"
buyBtn.addEventListener("click", () => {
  const available = currentMovie.capacity - currentMovie.tickets_sold;

  if (available > 0) {
    //sell one ticket
    currentMovie.tickets_sold++;

    //save the new ticket count to server
    fetch(`${baseURL}/${currentMovie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold }),
    })
      .then((res) => res.json())
      .then((updatedMovie) => {
        currentMovie = updatedMovie; //update with server’s data
        showTickets();
      });
  }
});
