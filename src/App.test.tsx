import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test/utils';
import App from './App';
import { useApp, useYoutube } from './hooks';
import { IMovieData } from './models';
import { moviesMock } from './test/movies.mocks';

const initialMoviesState = (): IMovieData => ({
  movies: moviesMock,
  fetchStatus: '',
  page: 0,
  totalPages: 0,
  totalResults: 0,
})

jest.mock('./hooks/useApp');
const mockUseApp = useApp as jest.MockedFunction<typeof useApp>;

jest.mock('./hooks/useYoutube');
const mockUseYoutube = useYoutube as jest.MockedFunction<typeof useYoutube>;

jest.mock('./hooks/useNearEndScreen', () => {
  return {
    ...jest.requireActual('./hooks/useNearEndScreen')
  }
});

describe('App ', () => {
  beforeEach(() => {
    mockUseApp.mockReturnValue({
      getMovies: jest.fn(),
      query: '123',
      searchMovies: jest.fn()
    })

    mockUseYoutube.mockReturnValue({
      closeModal: jest.fn(),
      isOpen: false,
      videoKey: 'tasfds',
      viewTrailer: jest.fn()
    })

  })
  it('renders watch later link', () => {
    renderWithProviders(<App />);
    const linkElement = screen.getByText(/watch later/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('search for movies', async () => {
    const searchMoviesFn = jest.fn();
    mockUseApp.mockReturnValue({
      getMovies: jest.fn(),
      query: '123',
      searchMovies: searchMoviesFn
    })

    renderWithProviders(<App />);
    await userEvent.type(screen.getByTestId('search-movies'), 'Inception');
    expect(searchMoviesFn).toBeCalled();
  });

  it('renders watch later component', async () => {
    renderWithProviders(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/watch later/i));
    expect(screen.getByText(/You have no movies saved to watch later/i)).toBeInTheDocument();
  });

  it('renders starred component', async () => {
    renderWithProviders(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId('nav-starred'));
    expect(screen.getByText(/There are no starred movies/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('starred')).toBeInTheDocument();
    });
  });
});
