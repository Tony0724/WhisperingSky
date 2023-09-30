import React from "react";

function getSunTime(data) {
    const sunTime = data;
    const sunMilliSeconds = sunTime * 1000;
    const sunData = new Date(sunMilliSeconds);
    let sunHours = sunData.getHours();
    const sunMinutes = sunData.getMinutes();
    const sunSeconds = sunData.getSeconds();
    if(sunHours > 12) {
        sunHours = 'P.M. ' + sunHours % 12;
    }
    const formattedTime = `${sunHours}:${sunMinutes}:${sunSeconds}`;
    return formattedTime;
}

export default getSunTime;