import React, { useEffect, useState } from 'react';
import styles from './DiscoveryPage.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { Loader } from '../components/Loader';

const tmdbUrl = import.meta.env.VITE_TMDB_URL === undefined ? '/tmdb' : import.meta.env.VITE_TMDB_URL;

export interface DiscoveryMovie {
    _id: number,
    imdb_id: string,
    original_title: string,
    overview: string,
    poster_path: string,
    vote_average: number,
    vote_count: number,
    imdb_vote_average: number,
    imdb_vote_count: number
    guessed_country: string
}

const DiscoveryPage = () => {
    const [movies, setMovies] = useState(new Set<DiscoveryMovie>())
    const [fetched, setFetched] = useState<number>(0)

    useEffect(() => {
        fetchData();
    }, []);

    const handleResults = (result: DiscoveryMovie[]) => {
        setFetched(prevState => prevState + Math.ceil(result.length / 10) * 10);
        setMovies(prevState => new Set<DiscoveryMovie>([...prevState, ...result]));
    }

    const fetchData = () => {
        fetch(`${tmdbUrl}/view/random/best/${fetched}?limit=20`, {
            signal: AbortSignal.timeout(20000),
        })
            .then(resp => resp.json())
            .then(response => handleResults(response))
            .catch(error => console.error(error));
    }

    return (
        <div className={styles.container}>
            <h1>Highest Rated Movies From All Around The World</h1>
            <InfiniteScroll
                dataLength={movies.size}
                next={() => fetchData()}
                hasMore={true}
                loader={<Loader/>}
                style={{height: '100vh', overflow: "visible"}}
            >
                <section className={styles.containingSection}>
                    {Array.from(movies)
                        .map((item: DiscoveryMovie) =>
                            <DiscoveryCard movie={item} key={`${item._id}-${Math.floor(Math.random() * (99 - 1 + 1) + 1)}`}/>
                        )}
                </section>
            </InfiniteScroll>
        </div>
    )

};

export default DiscoveryPage;