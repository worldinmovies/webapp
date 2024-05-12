import React, { useEffect, useState } from 'react';
import styles from './Admin.module.scss';

const tmdbUrl = import.meta.env.VITE_TMDB_URL === undefined ? '/tmdb' : import.meta.env.VITE_TMDB_URL;
const webappPort = import.meta.env.VITE_WEBAPP_PORT ? `:${import.meta.env.VITE_WEBAPP_PORT}` : '';
const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
const connectToWS = () => {
    const matcher = tmdbUrl.match(/.*(:\d+).*/);
    let value = matcher !== null ? matcher[1] : tmdbUrl;
    console.log(`Connecting to: ${value} based on ${value}`)
    return new WebSocket(`${ws_scheme}://${window.location.hostname}${webappPort}${value}/ws`);
};

interface Status {
    "fetched": string,
    "total": string,
    "percentageDone": number
}
const Admin = () => {
    const [status, setStatus] = useState<Status>();
    const [baseImport, setBaseImport] = useState<string[]>([]);
    const [toggle, setToggle] = useState<string>("tmdb")
    const myRef = React.useRef<HTMLDivElement>(null);

    const handleNewLines = (data: string) => {
        setBaseImport(prevState => [...prevState, data]
            .sort()
            .reverse()
            .slice(0, 1000)
            .reverse());
        if (myRef.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    }

    const doTheStuff = () => {
        try {
            const ws = connectToWS();
            ws.onmessage = (event) => {
                handleNewLines(event.data);
            }
            ws.onerror = (error) => {
                handleNewLines(JSON.stringify(error));
                console.log(error);
            }
            return ws;
        } catch (e) {
            console.error(`Could not connect to tmdb websocket: ${e}`);
            setBaseImport(prevState => [...prevState, formatLog(`Could not connect to tmdb websocket: ${e}`)])
        }
    }
    useEffect(() => {
        const tmdbWs = doTheStuff();

        setBaseImport([]);
        fetch(`${tmdbUrl}/status`)
            .then(response => response.json())
            .then(response => setStatus(response))
            .catch(error => {
                console.error(error);
                setBaseImport(prevState => [...prevState, formatLog(`Call to ${tmdbUrl}/status failed due to ${error}`)])
            })
        return () => {
            tmdbWs?.close();
        };
    }, []);

    // Make timestamp look like backends: 2024-04-03T19:38:20.045935
    const formatLog = (data: string, date = new Date()) => {
        return `${date.toISOString()
            .replace('Z', '000')} - ADMIN\t- "${data}"`
    }

    const triggerImport = (path: string) => {
        fetch(path)
            .then(() => handleNewLines(formatLog(`${path} called successfully`)))
            .catch(error => handleNewLines(formatLog(`Call to ${path} failed due to ${error}`)));
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
                    className={styles.status}>{status ? `Fetched ${status.fetched} out of ${status.total} movies which
                    is ${status.percentageDone.toFixed(2)}%` : "Loading status"}
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
            <div ref={myRef} className={styles.terminal}>
                <div className={styles.content}>
                    {baseImport.map((line, index) => <div key={index}>{line}</div>)}
                </div>
            </div>
        </div>
    )

}

export default Admin;
