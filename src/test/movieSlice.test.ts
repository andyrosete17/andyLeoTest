import moviesSlice, { fetchMovies, } from '../data/moviesSlice'
import { moviesMock } from './movies.mocks'

describe('MovieSlice test', () => {

    const initialState = {
        movies: [],
        fetchStatus: '',
        page: 0,
        totalPages: 0,
        totalResults: 0,
    };

    it('should set loading true while action is pending', () => {
        const action = { type: fetchMovies.pending };
        moviesSlice.reducer(
            {
                movies: [], fetchStatus: '', page: 0, totalPages: 10, totalResults: 200
            }, action);
        expect(action).toEqual({ type: fetchMovies.pending })
    })

    it('should return payload when action is fulfilled', () => {
        const action = {
            type: fetchMovies.fulfilled,
            payload: {
                results: moviesMock,
                page: 2,
                total_pages: 10,
                total_results: 100,
            },
        };

        const newState = moviesSlice.reducer(initialState, action);

        expect(newState.movies).toEqual(action.payload.results);
        expect(newState.page).toEqual(action.payload.page);
        expect(newState.totalPages).toEqual(action.payload.total_pages);
        expect(newState.totalResults).toEqual(action.payload.total_results);
    })


    it('should reset the state when resetMovies action is dispatched', () => {
        const action = moviesSlice.actions.resetMovies;

        const expectedState = {
            movies: [],
            fetchStatus: '',
            page: 0,
            totalPages: 0,
            totalResults: 0,
        };
        const newState = moviesSlice.reducer(initialState, action);
        expect(newState).toEqual(expectedState);
    });

    it('should return the next page based on the current state', () => {
        const action = moviesSlice.actions.setNextPage;
        const updatedState = {
            movies: moviesMock,
            fetchStatus: 'success',
            page: 2,
            totalPages: 14,
            totalResults: 50,
        };

        const newState = moviesSlice.reducer(updatedState, action);
        expect(newState).toEqual({ ...newState, page: 3 });
    });

    it('should return the total page when current page is the last one', () => {
        const action = moviesSlice.actions.setNextPage;
        const updatedState = {
            movies: moviesMock,
            fetchStatus: 'success',
            page: 14,
            totalPages: 14,
            totalResults: 50,
        };

        const newState = moviesSlice.reducer(updatedState, action);
        expect(newState).toEqual({ ...newState, page: newState.totalPages });
    });

    it('should set error when action is rejected', () => {
        const action = { type: fetchMovies.rejected };
        moviesSlice.reducer(
            {
                movies: [], fetchStatus: '', page: 0, totalPages: 10, totalResults: 200
            }, action);
        expect(action).toEqual({ type: fetchMovies.rejected })
    })

    it('should not add duplicate movies when action is fulfilled', () => {
        const action = {
            type: fetchMovies.fulfilled,
            payload: {
                results: [...moviesMock, ...moviesMock],
                page: 2,
                total_pages: 10,
                total_results: 100,
            },
        };

        const expectedState = {
            movies: moviesMock,
            fetchStatus: 'success',
            page: 2,
            totalPages: 10,
            totalResults: 100,
        };
        const newState = moviesSlice.reducer(initialState, action);
        expect(newState).toEqual(expectedState);
    });

})