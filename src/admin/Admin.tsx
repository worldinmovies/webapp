import React, { useEffect, useState } from 'react';
import styles from './Admin.module.scss';

const tmdbUrl = import.meta.env.VITE_TMDB_URL === undefined ? '/tmdb' : import.meta.env.VITE_TMDB_URL;
const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";

const Admin = () => {
    const [status, setStatus] = useState({"fetched": 0, "total": 0, "percentageDone": 0});
    const [baseImport, setBaseImport] = useState<string[]>([]);
    const [toggle, setToggle] = useState<string>("tmdb")

    useEffect(() => {
        fetch(`${tmdbUrl}/status`)
            .then(response => response.json())
            .then(response => setStatus(response))
            .catch(error => console.error(error))
        const matcher = tmdbUrl.match(/:\/\/(.+)/);
        const value = matcher !== null ? matcher[1] : tmdbUrl;
        const ws = new WebSocket(`${ws_scheme}://${value}/ws`);
        setBaseImport([]);
        ws.onmessage = (event) => {
            setBaseImport(prevState => [...prevState, event.data]);
        }
        ws.onerror = (error) => {
            console.log(error)
        }
    }, [toggle]);

    const triggerImport = (path: string) => {
        fetch(path)
            .then(() => setBaseImport(prevState => [...prevState, `${path} called successfully`]))
            .catch(error => setBaseImport(prevState => [...prevState, `Call to ${path} failed due to ${error}`]));
    }

    const handleClick = (newState: string) => {
        setToggle(newState)
    }

    return (
        <div className={styles.container}>
            <div className={styles.toggle}>
                <h2 onClick={() => handleClick('tmdb')}
                    className={toggle === 'tmdb' ? styles.activeToggle : styles.inactiveToggle}>TMDB</h2>
                <h2 onClick={() => handleClick('imdb')}
                    className={toggle === 'imdb' ? styles.activeToggle : styles.inactiveToggle}>IMDB</h2>
            </div>
            <div>
                <div
                    className={styles.status}>Fetched {status.fetched} out of {status.total} movies which
                    is {status.percentageDone}%
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={toggle === 'tmdb' ? styles.show : styles.hide}>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/base')}>Import TMDB Base
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/tmdb/data')}>Import TMDB
                        Data
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/tmdb/languages')}>Import
                        TMDB
                        Languages
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/tmdb/genres')}>Import
                        TMDB
                        Genres
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/tmdb/countries')}>Import
                        TMDB
                        Countries
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/tmdb/changes')}>Import
                        TMDB
                        Changes
                    </button>
                </div>
                <div className={toggle === 'imdb' ? styles.show : styles.hide}>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/imdb/ratings')}>Import
                        IMDB
                        Ratings
                    </button>
                    <button className="button" onClick={() => triggerImport(tmdbUrl + '/import/imdb/titles')}>Import
                        IMDB
                        Titles
                    </button>
                </div>
            </div>
            <div className={styles.terminal}>
                <div className={styles.content}>
                    {baseImport.map((line, index) => <p key={index}>{line}</p>)}
                </div>
            </div>
        </div>
    )

}

export default Admin;
