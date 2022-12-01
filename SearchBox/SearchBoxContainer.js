import React from 'react'
import { useEffect,useContext } from 'react'
import TmdbContext from "../../context/TmdbContext";
import SearchBox from './SearchBox';
import styled from 'styled-components';
import noImage from '../../assets/images/noImage.png'

const SearchBoxContainer = () => {
    const {getLatestMovies,latestMovies} = useContext(TmdbContext)
    useEffect(()=>{
        getLatestMovies()
    },[])

  return (
    <SearchBoxWrapper bg={latestMovies[0].backdrop_path}><SearchBox /></SearchBoxWrapper>
  )
}

export default SearchBoxContainer

const SearchBoxWrapper= styled.div`
display:flex;
align-items:flex-end;
justify-content:center;
padding:20px;
height:300px;
width:100%;
background-image:${props => props.bg == null ? `url(${noImage})` : `url(https://www.themoviedb.org/t/p/original${props.bg})`};
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
`