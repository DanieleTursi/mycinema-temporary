const tmdbReducer = (state, action) => {
    switch (action.type) {
        case 'POPULAR_MOVIES':
            return {
                ...state,
                movies: action.payload,
                loading: false
            }
        case 'POPULAR_SHOWS':
            return {
                ...state,
                series: action.payload,
                loading: false
            }
        case 'TOP_SHOWS':
            return {
                ...state,
                topSeries: action.payload,
                loading: false
            }
        case 'TOP_MOVIES':
            return {
                ...state,
                topMovies: action.payload,
                loading: false
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
            }
        case 'SET_DETAILS_LOADING':
            return {
                ...state,
                detailsLoading: true,
            }
        case 'SET_SEARCH_LOADING':
            return {
                ...state,
                searchLoading: true,
            }
        case 'SET_ACTOR_LOADING':
            return {
                ...state,
                actorLoading: true,
            }
        case 'CREDITS_LOADING':
            return {
                ...state,
                creditsLoading: true,
            }
        case 'GET_DETAILS':
            return {
                ...state,
                details: action.payload,
                detailsLoading: false,
                movieAndTvID: action.id,
                releaseDate: action.releaseDate,
                credits: action.credits,
                cast: action.cast
            }

        case 'GET_SEARCH':
            return {
                ...state,
                searchMovies: action.searchMovies,
                searchTV: action.searchTV,
                searchPeople: action.searchPeople,
                searchLoading: false,
            }
        case 'GET_ACTOR_DETAILS':
            return {
                ...state,
                actorDetails: action.payload,
                actorLoading: false,
            }
        case 'GET_LATESTMOVIES':
            return {
                ...state,
                latestMovies: action.payload,
            }
        case 'ACTOR_CREDITS':
            return {
                ...state,
                actorTvCredits: action.tvCredits,
                actorMovieCredits: action.movieCredits,
                creditsLoading: false,
            }
        default:
            return state
    }
}

export default tmdbReducer