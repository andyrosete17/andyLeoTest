export interface IMovie {
    id: string,
    title: string,
    poster_path: string,
    overview: string,
    release_date: string
}

export interface IMovieData {
    movies: IMovie[],
    fetchStatus: string,
    page: number,
    totalPages: number,
    totalResults: number,
}