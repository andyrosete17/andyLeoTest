import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import YouTubePlayer from './components/YoutubePlayer';
import './app.scss';
import { Modal } from './components/Modal';
import { useApp, useYoutube, useNearEndScreen } from './hooks';

const App = () => {
  const movies = useSelector((state) => state.movies);
  
  const { searchMovies, getMovies } = useApp();
  const { isOpen, viewTrailer, closeModal, videoKey } = useYoutube();
  const { fromRef } = useNearEndScreen({ once: false });

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header searchMovies={searchMovies} />

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
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} />} />
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
