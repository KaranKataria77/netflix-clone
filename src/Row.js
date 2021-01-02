import React,{ useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css';
import movieTrailer from 'movie-trailer';

const baseURl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchURL, isLargeRow }) {

    const [ movies, setMovies ] = useState([]);
    const [ trailerURl, setTrailerURl ] = useState("");

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(fetchURL)
            // console.log(request.data.results)
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    },[fetchURL])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // 
            autoplay: 1,
        }
    }


    const handleClick = (movie) => {
        if(trailerURl){
            setTrailerURl("")
        }else{
            movieTrailer(movie?.name || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerURl(urlParams.get("v"));
            })
            .catch(err => console.log(err))
        }
        console.log(movie.name)
    }


    return (
        <div className="row">
            <h1>{title}</h1>
            <div className="row__posters">
            {movies.map(movie => (
                    <img key={movie.id} onClick={() => handleClick(movie)} className={`row__poster ${isLargeRow && "row__posterLarge"}`}   
                    src={`${baseURl}${isLargeRow ?  movie.poster_path : movie.backdrop_path}`} alt={movie.name}  />
                ))}
            </div>
            {trailerURl && <YouTube videoId={trailerURl} opts={opts} />}
        </div>
    )
}

export default Row
