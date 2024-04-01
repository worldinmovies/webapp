import React from "react";
import styles from './Header.module.scss';
import {adminIcon, homeIcon, importMoviesIcon, worldMapIcon} from "./Svgs";
import { Link } from 'react-router-dom';
import MyMoviesMap from './movies/MyMoviesMap';

const menuButton = () => {
    return <div id={"menu"} className={styles.subnav}>
        <label className={styles.hamb} htmlFor="side-menu"><span className={styles.hambLine}></span></label>
        <label className={styles.button} htmlFor="side-menu">
            <label htmlFor="side-menu">Menu</label>
        </label>
    </div>;
}

const adminButton = () => {
    return <a href={"/admin"} className={styles.button}>
        {adminIcon()}
        Admin
    </a>
}

const importMoviesButton = () => {
    return <a href={"/import"} className={styles.button}>
        {importMoviesIcon()}
        Import Movies
    </a>
}

/**
const search = () => {
    return <div className={`${styles.search} ${styles.button}`}>
        {searchIcon()}
        <span className={styles.input} role="textbox" contentEditable>
        </span>
    </div>;
}
 **/

const worldMapButton = () => {
    return <a href={"/map"} className={`${styles.worldmap} ${styles.button}`}>
        {worldMapIcon()}
        World Map
    </a>
}

const homeButton = () => {
    return <a href={"/"} className={`${styles.button} ${styles.home}`}>
        {homeIcon()}
        The World in Movies
    </a>
}

const aboutUsButton = () => {
    return <a href={"/about-us"} className={`${styles.button}`}>
        About us
    </a>
}


const Header = () => {
    return (
        <header>
            <div className={styles.leftheaders}>
                <input className={styles.sideMenu} type="checkbox" id="side-menu"/>
                {menuButton()}
                {homeButton()}
                <nav className={styles.nav}>
                    {worldMapButton()}
                    <div className={styles.subnavContent}>
                        {importMoviesButton()}
                        {adminButton()}
                        {aboutUsButton()}
                    </div>
                </nav>
            </div>
            <div className={styles.rightHeaders}>
                {/*search()*/}
            </div>
        </header>
    );
}

export default Header;