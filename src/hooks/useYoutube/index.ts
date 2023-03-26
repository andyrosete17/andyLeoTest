import { useState } from "react";
import { API_KEY, ENDPOINT } from "../../constants";

export const useYoutube = () => {
    const [videoKey, setVideoKey] = useState('');
    const [isOpen, setOpen] = useState(false);

    const viewTrailer = (movie: any) => {
        getMovie(movie.id);
        if (!videoKey) setOpen(false);
        setOpen(true);
    };

    const getMovie = async (id: string) => {
        const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;
        setVideoKey('');
        const videoData = await fetch(URL).then((response) => response.json());

        if (videoData.videos && videoData.videos.results.length) {
            const trailer = videoData.videos.results.find((vid: any) => vid.type === 'Trailer');
            setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
        }
    };

    const closeModal = () => setOpen(false);


    return { isOpen, viewTrailer, closeModal, videoKey }
}