import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IMovie, IMovieData } from "../models"

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl: string) => {
    const response = await fetch(apiUrl)
    return response.json()
})

const initialMoviesState = (): IMovieData => ({
    movies: [],
    fetchStatus: '',
    page: 0,
    totalPages: 0,
    totalResults: 0,
})
const moviesSlice = createSlice({
    name: 'movies',
    initialState: initialMoviesState(),
    reducers: {
        setNextPage: (state) => {
            state.page = state.page < state.totalPages ? state.page + 1 : state.totalPages;
        },
        resetMovies: () => initialMoviesState()
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.fetchStatus = 'success'
            action.payload.results.forEach((newMovie: IMovie) => {
                if (!state.movies.some((existingMovie) => existingMovie.id === newMovie.id)) {
                    state.movies.push(newMovie);
                }
            });
            state.page = action.payload.page;
            state.totalPages = action.payload.total_pages;
            state.totalResults = action.payload.total_results;

        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
