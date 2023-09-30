import * as Location from 'expo-location';
import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import getSunTime from './getSunTime';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const apiKey = '26c67ed58f6cd8d8670df2b48a80a200';

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [airData, setAirData] = useState(null);
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data); // JSON 데이터를 상태에 저장
        // console.log(data.weather[0].main); // 필요에 따라 데이터를 콘솔에 출력할 수 있습니다.
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        setAirData(data); // JSON 데이터를 상태에 저장
        // console.log(data);
      })
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
  }
  useEffect(() => {
    ask();
  }, []);
  const nowTemp = weatherData?.main?.temp.toFixed(1);
  const sys = weatherData?.sys
  const sunsetTime = getSunTime(sys?.sunset);
  const sunriseTime = getSunTime(sys?.sunrise);
  return (
    <View style={styles.container}>
      <View style={styles.RedView}></View>
      <View style={styles.BlueView}>
        <Text style={styles.CityTextStyle}>{city}</Text>
        <View style={styles.weatherMainView}>
          <Image source={{uri: `https://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}} style={styles.image} />
          <Text style={styles.tempText}>{nowTemp}</Text>
          <MaterialCommunityIcons style={styles.tempIcon} name="temperature-celsius" size={48} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#385781'
  },
  RedView: {
    flex: 1, 
    backgroundColor: '#A8A765',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  BlueView: {
    flex: 3,
    backgroundColor: '#385781'
  },
  CityTextStyle: {
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
    fontSize: 30,
  },
  WeatherMainText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  },
  image: {
    width: 150, // 이미지 너비
    height: 150, // 이미지 높이
    left: '25%'
  },
  weatherMainView: {
    flexDirection: 'row'
  },
  tempText: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
    left: '35%',
    marginTop: 40
  },
  tempIcon: {
    left: '40%',
    marginTop: 48
  }
})
