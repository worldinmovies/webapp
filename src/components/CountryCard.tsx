import React from 'react'
import styles from './CountryCard.module.scss';
import { Link } from 'react-router-dom';
import { Movie } from '../Types';

export const CountryCard = (props: { movie: Movie }) => {
    const {movie} = props;
    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
        : 'https://www.lasff.com/uploads/2/6/7/4/26743637/poster-not-available_orig.jpg';

    const get_release_date = () => {
        return movie.release_date ? ` (${movie.release_date.slice(0, 4)})` : null
    }

    const should_show_eng_title = () => {
        const result = movie.alternative_titles?.titles
            ?.find(title => ['GB', 'US', 'AU'].indexOf(title.iso_3166_1) > -1 &&
                title.title.trim() !== movie.original_title.trim())
        return result !== undefined
    }

    const get_title = () => {
        const alt_title = movie.alternative_titles?.titles
            ?.find(title => ['GB', 'US', 'AU'].indexOf(title.iso_3166_1) > -1 &&
                title.title.trim() !== movie.original_title.trim())
        return alt_title ? <div className={styles.englishTitle}>'{alt_title.title}'</div> : null
    }

    return (
        <Link to={`/movie/${movie._id}`} key={movie._id ? movie._id : movie.imdb_id}
              className={styles.movieCard}>
            {movie.poster_path ? <img className={styles.poster}
                                      src={posterPath}
                                      alt={movie.en_title}/> : null}
            <div className={should_show_eng_title() ? styles.movieCardText_with_eng_title: styles.movieCardText}>
                <div>{`${movie.original_title} ${get_release_date()}`}</div>
                {get_title()}
                <div>{movie.vote_average.toFixed(1)}</div>
                <hr/>
                <div className={styles.overview}>{movie.overview}</div>
            </div>
        </Link>
    )
}

