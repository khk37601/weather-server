import Router from 'koa-router';
import koaBody from 'koa-body';
import { logger, stream } from '../../logger.js';
import { get, combinedGetUrl, combinedGetASOSUrl } from '../../lib/ajax.js';
import { weatherSKY, weatherShortPTY, weatherKorShortPTY, weatherKorSKY, weatherASOS } from '../../types/weather.js';

const forecastRouter = new Router();
/*
    요청시간  08:10, 11: 10
    POP	강수확률
    PTY	강수형태
    PCP	1시간 강수량
    REH	습도
    SNO	1시간 신적설
    SKY	하늘상태
    TMP	1시간 기온
    TMN	일 최저기온
    TMX	일 최고기온
    UUU	풍속(동서성분)
    VVV	풍속(남북성분)
    WAV	파고
    VEC	풍향
    WSD	풍속

    - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)

    - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
                          (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
    ※ -, null, 0값은 ‘강수없음’
    
    -  신적설(SNO) 범주 및 표시방법(값)
    ※ -, null, 0값은 ‘적설없음’

    { header: { resultCode: '10', resultMsg: '최근 3일 간의 자료만 제공합니다.' } }
*/

forecastRouter.post('/v1/short', koaBody(), async (ctx, next) => {
    const body = ctx.request.body;
    const token = ctx.request.header['authorization']?.split(' ')[1];

    if (!body) {
        ctx.response.status = 400;
        ctx.response.body = '잘못된 요청 구문';
        return;
    }

    if (token !== process.env.API_KEY) {
        ctx.response.status = 403;
        return;
    }

    const pageNo = body?.pageNo ?? 1;
    const numOfRows = body?.numOfRows ?? 15;
    const dataType = body?.dataType ?? 'JSON';

    if (!body.hasOwnProperty('baseDate')) {
        ctx.response.status = 400;
        ctx.response.body = 'basetDate 입력해주세요.';
        return;
    } else if (!body.hasOwnProperty('baseTime')) {
        ctx.response.status = 400;
        ctx.response.body = 'baseTime 입력해주세요.';
        return;
    } else if (!body.hasOwnProperty('nx')) {
        ctx.response.status = 400;
        ctx.response.body = 'nx 입력해주세요.';
        return;
    } else if (!body.hasOwnProperty('ny')) {
        ctx.response.status = 400;
        ctx.response.body = 'ny 입력해주세요.';
        return;
    }
    const url = combinedGetUrl('getVilageFcst', {
        pageNo,
        numOfRows,
        dataType,
        baseDate: body.baseDate,
        baseTime: body.baseTime,
        nx: body.nx,
        ny: body.ny
    });

    const weather = await get(url);
    logger.info(JSON.stringify(weather.data.response));
    if (!weather.data.response.body) {
        ctx.response.status = 400;
        ctx.response.body = weather.data.response.header.resultMsg;
        return;
    }
    const weatherItem = weather.data.response.body.items.item;
    const weatherFilter = weatherItem.filter((x) =>
        x.category === 'SKY' ||
        x.category === 'PTY' ||
        x.category === 'POP' ||
        x.category === 'REH' ||
        x.category === 'TMN' ||
        x.category === 'TMX' ||
        x.category === 'TMP'
    )

    ctx.response.status = 200;
    ctx.response.body = weatherFilter.map((x) => {
        if (x.category === 'SKY') {
            if (x.fcstValue == weatherSKY.sunny) {
                return { weatherState: weatherKorSKY.sunny };
            } else if (x.fcstValue == weatherSKY.cloudy) {
                return { weatherState: weatherKorSKY.cloudy };
            } else if (x.fcstValue == weatherSKY.muddy) {
                return { weatherState: weatherKorSKY.muddy };
            }
        } else if (x.category === 'PTY') {
            if (x.fcstValue == weatherShortPTY.none) {
                return { pty: weatherKorShortPTY.none }
            } else if (x.fcstValue == weatherShortPTY.rain) {
                return { pty: weatherKorShortPTY.rain }
            } else if (x.fcstValue == weatherShortPTY.rainAndSnow) {
                return { pty: weatherKorShortPTY.rainAndSnow }
            } else if (x.fcstValue == weatherShortPTY.snow) {
                return { pty: weatherKorShortPTY.snow }
            } else if (x.fcstValue == weatherShortPTY.shower) {
                return { pty: weatherKorShortPTY.shower }
            }
        } else if (x.category == 'REH') {
            return { humidity: x.fcstValue }
        } else if (x.category === 'POP') {
            return { chanceOfRain: `${x.fcstValue}` }
        } else if (x.category === 'TMN') {
            return { temperatureMin: `${x.fcstValue}` }
        } else if (x.category === 'TMX') {
            return { temperatureMax: `${x.fcstValue}` }
        } else if (x.category === 'TMP') {
            return { time: `${x.fcstDate} ${x.fcstTime}`, temperature: `${x.fcstValue}` }
        }
    });
    await next();
});


forecastRouter.post('/v1/asos', koaBody(), async (ctx, next) => {
    const body = ctx.request.body;
    const token = ctx.request.header['x-api-key'];
    if (!body) {
        ctx.response.status = 400;
        ctx.response.body = '잘못된 요청 구문';
        return;
    }

    if (token !== process.env.API_KEY) {
        ctx.response.status = 403;
        return;
    }
    console.log(body);
    const pageNo = body?.pageNo ?? 1;
    const numOfRows = body?.numOfRows ?? 31;
    const dataType = body?.dataType ?? 'JSON';
    const dataCd = body?.dataCd ?? 'ASOS';
    const dateCd = body?.dateCd ?? 'DAY';

    if (!body.hasOwnProperty('startDt')) {
        ctx.response.status = 400;
        ctx.response.body = 'startDt 입력해주세요.';
        return;
    } else if (!body.hasOwnProperty('endDt')) {
        ctx.response.status = 400;
        ctx.response.body = 'endDt 입력해주세요.';
        return;
    } else if (!body.hasOwnProperty('stnlds')) {
        ctx.response.status = 400;
        ctx.response.body = 'stnlds 입력해주세요.';
        return;
    }

    const url = combinedGetASOSUrl({
        pageNo,
        numOfRows,
        dataType,
        dataCd,
        dateCd,
        startDt: body?.startDt,
        endDt: body?.endDt,
        stnlds: body?.stnlds
    });
    const weatherAsos = await get(url);
    if (!weatherAsos.data.response.body) {
        ctx.response.status = 400;
        ctx.response.body = weatherAsos.data.response.header.resultMsg;
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = weatherAsos.data.response.body.items.item.map((x) => {
        let weather = {
            morning: [],
            afternoon: []
        }

        if (x.iscs === weatherASOS.none){
            weather.morning.push('맑음');
            weather.afternoon.push('맑음');
        } else {
            x.iscs.split('. ').forEach((x) => {
                if (x.replace(/[^0-9-]/g, '') < '1200') {
                    if (x.includes(weatherASOS.rain)){
                        weather.morning.push('비');
                    } else if (x.includes(weatherASOS.minMist)
                        || x.includes(weatherASOS.mist)
                        || x.includes(weatherASOS.fag)
                    ){
                        weather.morning.push('흐림');
                    }
                } else {
                    if (x.includes(weatherASOS.rain)){
                        weather.afternoon.push('비');
                    } else if (x.includes(weatherASOS.minMist)
                        || x.includes(weatherASOS.minMist)
                        || x.includes(weatherASOS.minMist)
                        || x.includes(weatherASOS.fag)
                    ){
                        weather.afternoon.push('흐림');
                    }
                }
                weather.morning.length === 0 && (weather.morning.push('맑음'));
                weather.afternoon.length === 0 && (weather.afternoon.push('맑음'));
            });
        }

        if (weather.morning.filter((x) => {return x === '비'}).length >= 1){
            weather.morning = '비';
        } else {
            const result = {};
            weather.morning.forEach((x) => {
                result[x] = (result[x] || 0) + 1;
            });
            weather.morning = Object.keys(result)[0];
        }

        if (weather.afternoon.filter((x) => {return x === '비'}).length >= 1){
            weather.afternoon = '비';
        } else {
            const result = {};
            weather.afternoon.forEach((x) => {
                result[x] = (result[x] || 0) + 1;
            });
            weather.afternoon = Object.keys(result)[0];
        }
        return (
            {
                location: x.stnNm,
                date: x.tm,
                avgTemperature: x.avgTa,
                avgRelativeHumidity: x.avgRhm,
                rain: x.sumRn,
                weather
            });
    });
    await next();
});



export default forecastRouter;

