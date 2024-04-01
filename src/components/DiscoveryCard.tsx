import React from 'react'
import styles from './DiscoveryCard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { DiscoveryMovie } from '../movies/DiscoveryPage';

export const DiscoveryCard = (props: { movie: DiscoveryMovie }) => {
    const navigate = useNavigate();

    const {movie} = props;
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
        : 'https://www.lasff.com/uploads/2/6/7/4/26743637/poster-not-available_orig.jpg';

    // Done because you mustn't have nestled links.
    const buttonLink = (e: any) => {
        if (!e.target.href) {
            navigate(`/movie/${movie._id}`)
        }
    }

    return (
        <div onClick={(e) => buttonLink(e)}
                className={styles.movieCard}>
            <img className={styles.poster}
                 src={posterPath}
                 alt={movie.original_title}/>
            <div className={styles.movieCardText}>
                {movie.guessed_countries.map(country =>
                    <Link className={styles.country}
                          to={`/country/${country}`}
                          key={movie._id + country}>{regionNames.of(country)}
                    </Link>
                )}
                <div>{movie.original_title}</div>
                <hr/>
                <div>{movie.overview}</div>
            </div>
        </div>
    )
}

