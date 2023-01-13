import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const get = async (url) => {
    return axios.get(url, {headers: { "Content-Type": `application/json` }});
}

const combinedGetUrl = (part, queryParams) => {
    let url = `${process.env.K_WEATHER_URL}/${part}`;
    let queryString = `?${encodeURIComponent('serviceKey')}=${process.env.K_WEATHER_KEY}`;
    queryString += `&${encodeURIComponent('pageNo')}=${encodeURIComponent(queryParams.pageNo)} `
    queryString += `&${encodeURIComponent('numOfRows')}=${encodeURIComponent(queryParams.numOfRows)}`
    queryString += `&${encodeURIComponent('dataType')}=${encodeURIComponent(queryParams.dataType)}`
    queryString += `&${encodeURIComponent('base_date')}=${encodeURIComponent(queryParams.baseDate)}`
    queryString += `&${encodeURIComponent('base_time')}=${encodeURIComponent(queryParams.baseTime)}`
    queryString += `&${encodeURIComponent('nx')}=${encodeURIComponent(queryParams.nx)}`
    queryString += `&${encodeURIComponent('ny')}=${encodeURIComponent(queryParams.ny)}`
    return url + queryString;
}

const combinedGetASOSUrl = (queryParams) => {
    let url = `${process.env.ASOS_URL}`;
    let queryString = `?${encodeURIComponent('serviceKey')}=${process.env.ASOS_KEY}`;
    queryString += `&${encodeURIComponent('pageNo')}=${encodeURIComponent(queryParams.pageNo)}`
    queryString += `&${encodeURIComponent('numOfRows')}=${encodeURIComponent(queryParams.numOfRows)}`
    queryString += `&${encodeURIComponent('dataType')}=${encodeURIComponent(queryParams.dataType)}`
    queryString += `&${encodeURIComponent('dataCd')}=${encodeURIComponent(queryParams.dataCd)}`
    queryString += `&${encodeURIComponent('dateCd')}=${encodeURIComponent(queryParams.dateCd)}`
    queryString += `&${encodeURIComponent('startDt')}=${encodeURIComponent(queryParams.startDt)}`
    queryString += `&${encodeURIComponent('endDt')}=${encodeURIComponent(queryParams.endDt)}`
    queryString += `&${encodeURIComponent('stnIds')}=${encodeURIComponent(queryParams.stnlds)}`
    return url + queryString;
}

export { get, combinedGetUrl, combinedGetASOSUrl};