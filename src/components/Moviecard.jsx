import React, { useState } from 'react';
import Spinner from './Spinner';

const API_KEY = '5f7f317b6f88b060ddd490280037b2de' ; // make sure this is a v3 key
const API_BASE_URL = 'https://api.themoviedb.org/3';

const Moviecard = ({ movie, onMovieClick }) => {
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const handleClick = async () => {
    if (onMovieClick) onMovieClick(movie);  // ✅ increment search count
    setLoadingTrailer(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
      );
      if (!response.ok) throw new Error('Failed to fetch trailer');

      const data = await response.json();
      const trailer = data.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );

      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        alert('Trailer not available');
      }
    } catch (error) {
      console.error(error);
      alert('Error loading trailer');
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <div className="movie-card cursor-pointer relative" onClick={handleClick}>
      {loadingTrailer && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-2xl">
          <Spinner />
        </div>
      )}
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/No-Poster.png'}
        alt={movie.title}
        className={loadingTrailer ? 'opacity-50' : ''}
      />
      <div className="mt-4">
        <h3 className="text-white">{movie.title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="star" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{movie.original_language}</p>
          <span>•</span>
          <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Moviecard;
