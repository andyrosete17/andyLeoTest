import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test/utils';
import App from './App';

describe('App ', () => {
  it('renders watch later link', () => {
    renderWithProviders(<App />);
    const linkElement = screen.getByText(/watch later/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('search for movies', async () => {
    renderWithProviders(<App />);
    await userEvent.type(screen.getByTestId('search-movies'), 'Inception');
    await waitFor(() => {
      expect(screen.getAllByText('Inception')[0]).toBeInTheDocument();
    });
    const viewTrailerBtn = screen.getAllByText('View Trailer')[0];
    await userEvent.click(viewTrailerBtn);
    await waitFor(() => {
      expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
    });
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
