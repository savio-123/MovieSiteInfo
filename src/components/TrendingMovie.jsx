import React from 'react'
import { useState, useEffect } from "react"
import { getTrending } from "../appwrite"
import Spinner from "./Spinner"
import Moviecard from "./Moviecard"
import '../index.css'



export default function TrendingMovie() {
    const [trending,setTrending] = useState([]);
    const [loadingTrending,setLoadingTrending] = useState(false);
    const [trendingErrorMessage,setTrendingErrorMessage] = useState('');
    useEffect(() => {
        fetchTrendingMovies();
    }, []);
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

  return (
    <div>
    {trending.length > 0 && (
        <section className="trending">
          <h2 className="pl-2 text-white mt-5 mb-8 text-2xl font-dm-sans font-bold">Trending Now</h2>
          {
            loadingTrending && (
              <div className="flex justify-center items-center">
                <Spinner />
                {trendingErrorMessage && (
                  <p className="text-red-500 text-center font-dm-sans font-bold">
                    {trendingErrorMessage}
                  </p>
                )}
              </div>
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
    </div>
      )
}

