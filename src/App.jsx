import Search from "./components/Search"
import { useState, useEffect } from "react"
import Spinner from "./components/Spinner"
import Moviecard from "./components/Moviecard"
import { useDebounce } from "react-use"
import { getTrending, updateSearchCount } from "./appwrite"

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
  const [trending,setTrending] = useState([]);
  const [loadingTrending,setLoadingTrending] = useState(false);
  const [trendingErrorMessage,setTrendingErrorMessage] = useState('');

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

      setMovies(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };
  const fetchTrendingMovies = async () => {
    setLoadingTrending(true);
    setTrendingErrorMessage('');
    try{
         const movies = await getTrending();
         setTrending(movies);
    }
    catch(error){
      console.error('Error fetching trending movies:', error);
      setTrendingErrorMessage('Error fetching trending movies');
    }
    finally{
      setLoadingTrending(false);
    }
  }
  useEffect(() => {    
    fetchMovies(isDebounced);
  },[isDebounced]);

  useEffect(() => {
    fetchTrendingMovies();
  },[]);

  return (
   <main>
    <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="movies Banner" />
          <h1>
            Find The Latest <span className="text-gradient"> Movies </span> 
            And Let The Weekend Begin
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trending.length > 0 && (
          <section className="trending">
            <h2 className="pl-2 text-white mt-5 mb-8 text-2xl font-dm-sans font-bold">Trending Now</h2>
            {
              loadingTrending && (
                <Spinner />
              )
            }
            <ul>
              {trending.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
            {
              trendingErrorMessage && (
                <p className="text-red-500 text-center font-dm-sans font-bold">
                  {trendingErrorMessage}
                </p>
              )
            }
          </section>
        )}
       

        <section className="all-movies"> 
          <h2 className="pl-2 text-white mt-10 text-2xl font-dm-sans font-bold">🎬Movie List</h2>

          { loading ? (
            <Spinner />
          ):( 
            <ul>
  {movies.map((movie) => (
    <Moviecard 
      key={movie.id} 
      movie={movie} 
      onMovieClick={updateSearchCount}  // pass handler
    />
  ))}
</ul>
          )}

          {
            errorMessage && (
            <p className="text-red-500 text-center font-dm-sans font-bold">
              {errorMessage}
            </p>
          )}
        </section>
      </div>
   </main>
  )
}

export default App