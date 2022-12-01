
import { createContext, useReducer, useState } from "react";
import tmdbReducer from './TmdbReducer'
const TmdbContext = createContext();

const TMDB_KEY = process.env.REACT_APP_TMDB_KEY;
const URL = 'https://api.themoviedb.org/3/'
const lang = '&language=en-US&page=1';
export const TmdbProvider = ({ children }) => {
    const initialState = {
        movies: [],
        series: [],
        topSeries: [],
        topMovies: [],
        details: [],
        detailsLoading: false,
        loading: false,
        movieAndTvID: '',
        releaseDate: '2022',
        credits: [],
        searchMovies: [],
        searchTV: [],
        searchPeople: [],
        searchLoading: false,
        cast: [],
        actorDetails: [],
        actorLoading: false,
        actorTvCredits: [],
        actorMovieCredits: [],
        creditsLoading: false,
        latestMovies:[],

    }
    const [state, dispatch] = useReducer(tmdbReducer, initialState);


    // Set Loading

    const setLoading = () => {
        dispatch({ type: 'SET_LOADING' })
    }

    const setDetailsLoading = () => {
        dispatch({ type: 'SET_DETAILS_LOADING' })
    }

    const setSearchLoading = () => {
        dispatch({ type: 'SET_SEARCH_LOADING' })
    }
    const setActorDetailsLoading = () => {
        dispatch({ type: 'SET_ACTOR_LOADING' })
    }
    const setCreditsLoading = () => {
        dispatch({ type: 'CREDITS_LOADING' })
    }
    const params = new URLSearchParams({
        api_key: TMDB_KEY,

    })


    //Search

    const getSearch = async (value) => {
        if (value.length > 0) {
            setSearchLoading();

            const resMovies = await fetch(`${URL}search/movie?${params}&language=en-US&query=${value}&page=1`)
            const dataMovies = await resMovies.json()
            const resSeries = await fetch(`${URL}search/tv?${params}&language=en-US&query=${value}&page=1`)
            const dataSeries = await resSeries.json()
            const resPeople = await fetch(`${URL}search/person?${params}&language=en-US&query=${value}&page=1`)
            const dataPeople = await resPeople.json()
            // console.log(dataMovies, dataSeries, dataPeople)
            dispatch({ type: 'GET_SEARCH', searchMovies: dataMovies.results, searchTV: dataSeries.results, searchPeople: dataPeople.results })
        }
    }


    // get popular Movies and Shows
    const getPopular = async () => {
        setLoading();
        const movieResponse = await fetch(`${URL}movie/popular?${params}${lang}`);
        const movieData = await movieResponse.json();
        const tvResponse = await fetch(`${URL}tv/popular?${params}${lang}`);
        const tvData = await tvResponse.json();

        dispatch({
            type: 'POPULAR_SHOWS',
            payload: tvData.results
        })
        dispatch({
            type: 'POPULAR_MOVIES',
            payload: movieData.results
        })
    }
    // get the top movies and shows
    const getTop = async () => {
        setLoading();
        const movieResponse = await fetch(`${URL}movie/top_rated?${params}${lang}`);
        const movieData = await movieResponse.json();
        const tvResponse = await fetch(`${URL}tv/top_rated?${params}${lang}`);
        const tvData = await tvResponse.json();
        dispatch({
            type: 'TOP_SHOWS',
            payload: tvData.results,
        })
        dispatch({
            type: 'TOP_MOVIES',
            payload: movieData.results,
        })
    }

    // get movie and tv credits of an actor

    const getActorCredits = async (id) => {
        setCreditsLoading()
        const movieCredits = await fetch(`${URL}person/${id}/movie_credits?${params}${lang}`);
        const movieCreditsData = await movieCredits.json()

        const tvCredits = await fetch(`${URL}person/${id}/tv_credits?${params}${lang}`);
        const tvCreditsData = await tvCredits.json()
        console.log(tvCreditsData.cast, movieCreditsData.cast);

        dispatch({
            type: 'ACTOR_CREDITS',
            movieCredits: movieCreditsData.cast,
            tvCredits: tvCreditsData.cast,

        })

    }

    // get the latest movie

    const getLatestMovies = async() => {
        const latestMovies= await fetch(`${URL}movie/now_playing?${params}${lang}`);
        const resultLatestMovies= await latestMovies.json()
        console.log(resultLatestMovies)
        dispatch({
            type: 'GET_LATESTMOVIES',
            payload: resultLatestMovies.results
        })
    }



    // get the details of the actor
    const getActorDetails = async (id) => {
        setActorDetailsLoading();
        const actorFetch = await fetch(`${URL}person/${id}?${params}${lang}`);
        const actorDetails = await actorFetch.json();

        dispatch({
            type: 'GET_ACTOR_DETAILS',
            payload: actorDetails
        })
    }

    // get the details of a show, movie or actor
    const getDetails = async (id, channel) => {
        setDetailsLoading();

        const response = await fetch(`${URL}${channel}/${id}?${params}${lang}`);
        const details = await response.json();

        const creditFetch = await fetch(`${URL}${channel}/${id}/credits?${params}${lang}`);
        const credits = await creditFetch.json();

        const airDate = () => { if (details.first_air_date) { return details.first_air_date.slice(0, 4) } else { return '' } }
        const releaseDate = () => { if (details.release_date) { return details.release_date.slice(0, 4) } else { return '' } }

        if (channel === 'tv') {

            dispatch({
                type: 'GET_DETAILS',
                payload: details,
                id: id,
                releaseDate: airDate(),
                credits: null,
                cast: credits.cast
            })
        }

        else {
            if (credits.crew === undefined || credits.crew.length === 0) {
                dispatch({
                    type: 'GET_DETAILS',
                    payload: details,
                    id: id,
                    releaseDate: releaseDate(),
                    credits: 'N/N',
                    cast: credits.cast
                })
            }
            else {
                const dir = credits.crew.find(element => element.job === 'Director').name
                dispatch({
                    type: 'GET_DETAILS',
                    payload: details,
                    id: id,
                    releaseDate: releaseDate(),
                    credits: dir,
                    cast: credits.cast
                })

            }
        }





    }

    return <TmdbContext.Provider value={{ getLatestMovies, latestMovies: state.latestMovies,
        getSearch, getTop, getPopular, getDetails, getActorDetails,
        creditsLoading: state.creditsLoading,
        actorLoading: state.actorLoading, searchMovies: state.searchMovies, cast: state.cast, searchPeople: state.searchPeople, searchTV: state.searchTV, movies: state.movies, loading: state.loading, searchLoading: state.searchLoading, detailsLoading: state.detailsLoading, series: state.series, topSeries: state.topSeries, topMovies: state.topMovies, details: state.details, mandtid: state.movieAndTvID,
        rDate: state.releaseDate, credits: state.credits, actorDetails: state.actorDetails, getActorCredits, actorTvCredits: state.actorTvCredits, actorMovieCredits: state.actorMovieCredits,
    }} >{children}</TmdbContext.Provider>
}


export default TmdbContext;