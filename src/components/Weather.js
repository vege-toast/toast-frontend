import 'css/Weather.css';
import axios from "axios";
import useWatchLocation from '../modules/UseCurrentLocation'
import { useRef, useState, useEffect} from 'react';
import { CircularProgress } from '@material-ui/core';

// 날씨 옵션 
const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
    maximumAge: 1000 * 3600 * 24, // 24 hour
}

const Weather = () => {
    const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
    const [ isWeatherLoaded, setIsWeatherLoaded] = useState(false);
    const [ weatherInfo, setWeatherInfo ] = useState({
        main: {
            temp: 10.41,
            feels_like: 263.63,
            temp_min: 263.56,
            temp_max: 267.68,
            pressure: 1022,
            humidity: 41
            },
        icon: "http://openweathermap.org/img/wn/01n@2x.png",
        addr: "서울특별시 중구 회현동1가"
    })
    let loading;
    loading = <div className="loading"><CircularProgress color="secondary"/></div>

    useEffect(() => {
        console.log(isWeatherLoaded)
        if (navigator.geolocation) { // GPS를 지원하면
            console.log(isWeatherLoaded)
            navigator.geolocation.getCurrentPosition((position) => {
            if (!isWeatherLoaded){
                console.log("날씨 확인");
                axios.post(
                    gval.BACK_BASE_URL + '/api/weather', {lat:position.coords.latitude, lon:position.coords.longitude}
                ).then(response => {
                    console.log(response.data);
                    setIsWeatherLoaded(true)
                    setWeatherInfo(response.data);
                }).catch(err => {console.log(err)});
            }
            }, (error) => {
              console.error(error);
            }, {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: Infinity
        });
        } else {
            alert('GPS를 지원하지 않습니다');
        }
    }, [])

    const ftoc = (f) => (parseFloat(f-273)).toFixed();

    return(        
        <section className="weather_box">
            { isWeatherLoaded ? 
            <div>
                <img src={weatherInfo.icon} alt="맑음" width="30" height="30"/>
                <div className="temperature">
                    <span className="blind">섭씨</span>
                        {ftoc(weatherInfo.main.temp)}℃
                    <span className="blind">도</span>
                </div>
                <p>{weatherInfo.addr}</p>
                <p>
                    <span className="blind">최고기온</span>
                    최고기온 : {ftoc(weatherInfo.main.temp_max)}℃
                </p>
                <p>
                    <span className="blind">최저기온</span>
                    최저기온 : {ftoc(weatherInfo.main.temp_min)}℃
                </p>
                <p>습도 : {weatherInfo.main.humidity}</p>
            </div>
            :
            <div>
                {loading}
            </div>    
            }       
        </section>
    )
}

export default Weather;