import React from 'react'
import styles from './CountryCard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Movie } from '../Types';

export const CountryCard = (props: { movie: Movie }) => {
    const navigate = useNavigate();
    const {movie} = props;
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
        <Link to={`/movie/${movie._id}`} key={movie._id ? movie._id : movie.imdb_id}
              className={styles.movieCard}>
            {movie.poster_path ? <img className={styles.poster}
                                     src={posterPath}
                                     alt={movie.en_title}/> : null}
            <div className={styles.movieCardText}>
                <div>{movie.original_title} {movie.release_date ? "(" + movie.release_date.slice(0, 4) + ")" : null}</div>
                {movie.en_title && movie.en_title.trim() !== movie.original_title.trim() ?
                    <div className={styles.englishTitle}>'{movie.en_title}'</div> : null}
                <div>{movie.vote_average.toFixed(1)}</div>
            </div>
        </Link>
    )
}

