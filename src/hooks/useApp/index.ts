import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import moviesSlice, { fetchMovies } from "../../data/moviesSlice";
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER } from '../../constants';
import { useState } from "react";

export const useApp = () => {

    const { resetMovies, setNextPage } = moviesSlice.actions;
    const movies = useSelector((state: any) => state.movies);
    const [_, setSearchParams] = useSearchParams();

    const [query, setQuery] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchMovies = (query: string) => {
        navigate('/');
        getSearchResults(query);
    };

    const getSearchResults = (query: string) => {
        if (query !== '') {
            setQuery(query)
            dispatch(resetMovies());
            dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=1`) as any);
            setSearchParams(createSearchParams({ search: query }));
        } else {
            dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=1`) as any);
            setSearchParams();
        }
    };

    const getMovies = () => {
        if (movies.page > 0) {
            if (query) {
                dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=${movies.page}`) as any);
            } else {
                dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${movies.page}`) as any);
            }
        }
    };

    return { searchMovies, query, getMovies }
}