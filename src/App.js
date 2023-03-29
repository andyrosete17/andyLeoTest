import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import moviesSlice, { fetchMovies } from './data/moviesSlice';
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import YouTubePlayer from './components/YoutubePlayer';
import './app.scss';
import useNearEndScreen from './hooks/useNearEndScreen';
import debounceFn from 'debounce-fn';
import { Modal } from './components/Modal';

const App = () => {
  const movies = useSelector((state) => state.movies);

  const { resetMovies, setNextPage } = moviesSlice.actions;

  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => setOpen(false);

  const closeCard = () => {};

  const { isNearScreen, fromRef } = useNearEndScreen({ once: false });

  const debounceLoadMore = useCallback(
    debounceFn(
      () => {
        dispatch(setNextPage());
      },
      { wait: 200 }
    ),
    [setNextPage]
  );

  useEffect(() => {
    if (isNearScreen) {
      debounceLoadMore();
      getMovies();
    }
  }, [isNearScreen, debounceLoadMore]);

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(resetMovies());
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=1`));
      setSearchParams(createSearchParams({ search: query }));
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=1`));
      setSearchParams();
    }
  };

  const searchMovies = (query) => {
    getSearchResults(query)
  }

  const getMovies = () => {
    if (movies.page > 0) {
      if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${movies.page}`));
      } else {
        dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${movies.page}`));
      }
    }
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(false);
    setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find((vid) => vid.type === 'Trailer');
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        {isOpen && (
          <Modal closeModal={closeModal}>
            {videoKey ? (
              <YouTubePlayer videoKey={videoKey} />
            ) : (
              <div style={{ padding: '30px' }}>
                <h6>no trailer available. Try another movie</h6>
              </div>
            )}
          </Modal>
        )}

        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
      <div id="visor" ref={fromRef}></div>
    </div>
  );
};

export default App;
