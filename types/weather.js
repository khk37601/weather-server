const weatherKorSKY = {
    sunny: '맑음',
    cloudy: '구름많음',
    muddy: '흐림'
}

const weatherKorShortPTY = {
    none: '없음',
    rain: '비',
    rainAndSnow: '비/눈',
    snow: '눈',
    shower: '소나기'
}

const weatherSKY = {
    sunny: 1,
    cloudy: 3,
    muddy: 4
};

const weatherShortPTY = {
    none: 0,
    rain: 1,
    rainAndSnow: 2,
    snow: 3,
    shower: 4
};

const weatherSuperShortPTY = {
    none: 0,
    rain: 1,
    rainAndSnow: 2,
    snow: 3,
    raindrop:5,
    raindropFlying: 6,
    snowFlying: 7
};

const weatherASOS = {
    none: '',
    rain: '비',
    snow: '눈',
    shower: '소나기',
    minMist: '연무',
    mist: '박무',
    fag: '안개'
}

export { weatherASOS, weatherSKY, weatherShortPTY, weatherSuperShortPTY, weatherKorSKY, weatherKorShortPTY };