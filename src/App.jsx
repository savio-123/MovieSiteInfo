import Search from "./components/Search"
import { useState, useEffect } from "react"
import Spinner from "./components/Spinner"
import Moviecard from "./components/Moviecard"
import TrendingMovie from "./components/TrendingMovie"
import { useDebounce } from "react-use"
import { updateSearchCount } from "./appwrite"

// import new function

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}
const App = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movies,setMovies] = useState([]);
  const [loading,setLoading] = useState(false);
  const [isDebounced,setIsDebounced] = useState(false);// NEW

  useDebounce(() => setIsDebounced(searchTerm),1000,[searchTerm]);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');
    try { 
      const movie = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(movie, API_OPTIONS);

      if(!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'An error occurred');
        setMovies([]);
        return;
      }

      setMovies(data.results || 'No movies found');

    } catch(error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {    
    fetchMovies(isDebounced);
  },[isDebounced]);

  return (
   <main>
    <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="movies Banner" />
          <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold text-center">
  Find The Latest <span className="text-gradient"> Movies </span>
  <span className="block mt-2">And Let The Weekend Begin</span>
</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <TrendingMovie />
        <section className="all-movies">
  <h2 className="pl-2 text-white mt-10 text-2xl font-dm-sans font-bold">🎬Movie List</h2>

  {loading ? (
    <Spinner />
  ) : errorMessage ? (
    <p className="text-red-500 text-center font-dm-sans font-bold">
      {errorMessage}
    </p>
  ) : movies.length === 0 ? (
    <p className="text-white text-center font-dm-sans font-bold">
      No movies found
    </p>
  ) : (
    <ul>
      {movies.map((movie) => (
        <Moviecard
          key={movie.id}
          movie={movie}
          onMovieClick={() => updateSearchCount(movie)}
        />
      ))}
    </ul>
  )}
</section>

      </div>
   </main>
  )
}

export default App