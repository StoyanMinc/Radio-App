import { useEffect, useRef, useState } from "react";
import { countries, genres } from "../constants";
import { RadioBrowserApi } from "radio-browser-api";
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import defaultImage from '../assets/deafultImage.jpg';

export default function Stations() {
    // const [country, setCountry] = useState<string>('Bulgaria');
    const [genre, setGenre] = useState<string>('all');
    const [stations, setStations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const audioRefs = useRef<HTMLAudioElement[]>([]);

    const setupApi = async (genre: string) => {
        // const api = new RadioBrowserApi('My Radio App');
        const api = new RadioBrowserApi('My Radio App');
        api.setBaseUrl('https://de1.api.radio-browser.info');

        const stations = await api.searchStations({
            language: 'english',
            tag: genre,
            // country: country,
            limit: 30
        });
        console.log(stations);
        return stations;
    };

    useEffect(() => {
        // debugger
        setLoading(true);
        setupApi(genre)
            .then((data) => {
                setStations(data);
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => setLoading(false));
    }, [genre]);

    return (
        <>
            <div className="genreContainer">
                {genres.map((genre, index) => (
                    <span
                        className="genre"
                        onClick={() => setGenre(genre)}
                        key={index}
                    >
                        {genre}
                    </span>
                ))}
            </div>

            <div className="stationsContainer">
                {loading ? (
                    <div className="spinnerContainer">
                        <div className="loader"></div>
                    </div>
                ) : (
                    stations.map((station, index) => (
                        <div
                            key={index}
                            className="stationContainer"
                        >
                            <img
                                src={station.favicon || defaultImage}
                                alt={`${station.name} logo`}
                            />
                            <p className="stationTitle">{station.name}</p>
                            <AudioPlayer
                                ref={(el) => {
                                    if (el && el.audio.current) {
                                        audioRefs.current[index] = el.audio.current;
                                    }
                                }}
                                src={station.urlResolved}
                                showJumpControls={false}
                                showFilledVolume={true}
                                layout="horizontal"
                                autoPlayAfterSrcChange={false}
                                customProgressBarSection={[]}
                                customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
                                onPlay={() => {
                                    audioRefs.current.forEach((ref, i) => {
                                        if (i !== index && ref && !ref.paused) {
                                            ref.pause();
                                        }
                                    });
                                }}
                            />
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
