import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import Moviecard from "./components/Moviecard";
import TrendingMovie from "./components/TrendingMovie";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import { useState, useEffect, use } from "react";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = { method:'GET', headers:{ accept:'application/json', Authorization:`Bearer ${API_KEY}` } };

const MovieList = ({ searchTerm, setSearchTerm }) => {
  const [movies,setMovies] = useState([]);
  const [loading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const [isDebounced,setIsDebounced] = useState(false);

  useDebounce(() => setIsDebounced(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');
    try {
      const movieURL = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(movieURL, API_OPTIONS);
      if(!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(isDebounced); }, [isDebounced]);
  useEffect(() => {
    const handlePopState = () => {
      setSearchTerm("");       // clear search
      fetchMovies("");         // reload default movies
    };
  
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      {!searchTerm && <TrendingMovie />}
      <section className="all-movies">
        <h2 className="pl-2 text-white mt-10 text-2xl font-dm-sans font-bold">🎬Movie List</h2>
        {loading ? <Spinner /> :
          errorMessage ? <p className="text-red-500 text-center font-dm-sans font-bold">{errorMessage}</p> :
          movies.length === 0 ? <p className="text-white text-center font-dm-sans font-bold">No movies found</p> :
          <ul>{movies.map(movie => (
            <Moviecard key={movie.id} movie={movie} onMovieClick={() => updateSearchCount(movie)} />
          ))}</ul>
        }
      </section>
    </>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
          <div className="flex justify-center items-center gap-3 mt-5 w-full max-w-3xl mx-auto">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <button
              onClick={handleHome}
              className="bg-gradient-to-r from-[#D6C7FF] to-[#4704f3] text-white px-8 mt-10 rounded-lg h-[52px] xs:h-[56px] sm:h-[56px] font-semibold"
            >
              🏠 Home
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<MovieList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;