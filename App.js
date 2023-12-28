import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, Image, Dimensions, View } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import getSunTime from './getSunTime';

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [weatherData, setWeatherData] = useState(null);
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';
  const apiKey = '26c67ed58f6cd8d8670df2b48a80a200';
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false)
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      setWeatherData(data);
    })
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    if (location[0].region !== null && location[0].district !== null) {
      setCity(location[0].region + ' ' + location[0].district);
    } else if (location[0].city !== null && location[0].region !== null) {
      setCity(location[0].region + ' ' + location[0].city)
    } else {
      setCity(location[0].country)
    }
  }
  useEffect(() => {
    ask();
  }, [])
  const sys = weatherData?.sys;
  const sunsetTime = getSunTime(sys?.sunset);
  const sunriseTime = getSunTime(sys?.sunrise);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.CityCurrentStyle}>(현재 위치)</Text>
      <Text style={styles.CityTextStyle}>{city}</Text>
      <Text style={styles.weatherMainDes}>{weatherData?.weather[0]?.description}</Text>
      <Image source={{uri: `https://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}} style={{width: 200, height: 200, left: '25%'}} />
      <Text style={styles.tempText}>{weatherData?.main?.temp.toFixed(1)}&#176;C</Text>
      <Text style={styles.tempHighless}>최고 {weatherData?.main?.temp_max.toFixed(1)}&#176;C / 최저 {weatherData?.main?.temp_min.toFixed(1)}&#176;C</Text>
      <View style={styles.detailViewContainer}>
          <View style={styles.detailWeatherView}>
            <View style={styles.row}>
              <View style={styles.detailItem}>
                <FontAwesome5
                  name="temperature-high"
                  size={24}
                  color="white"
                />
                <Text style={styles.detailItemMainText}>체감온도</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.main?.feels_like}
                  <MaterialCommunityIcons
                    style={styles.tempIcon}
                    name="temperature-celsius"
                    size={15}
                    color="white"
                  />
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="air-humidifier"
                  size={24}
                  color="white"
                />
                <Text style={styles.detailItemMainText}>습도</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.main?.humidity}%
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="sunrise" size={24} color="white" />
                <Text style={styles.detailItemMainText}>일출시간</Text>
                <Text style={styles.detailItemMainText}>{sunriseTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="sunset" size={24} color="white" />
                <Text style={styles.detailItemMainText}>일몰시간</Text>
                <Text style={styles.detailItemMainText}>{sunsetTime}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.detailItem}>
                <Feather name="wind" size={24} color="white" />
                <Text style={styles.detailItemMainText}>풍속</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.wind?.speed}m/s
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="weather-cloudy-arrow-right"
                  size={24}
                  color="white"
                />
                <Text style={styles.detailItemMainText}>풍향</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.wind?.deg}&#176;
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="weather-fog"
                  size={24}
                  color="white"
                />
                <Text style={styles.detailItemMainText}>흐림정도</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.clouds?.all}%
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="arrow-collapse-down"
                  size={24}
                  color="white"
                />
                <Text style={styles.detailItemMainText}>기압</Text>
                <Text style={styles.detailItemMainText}>
                  {weatherData?.main?.pressure}hPa
                </Text>
              </View>
            </View>
          </View>
        </View>
    </ScrollView>
  )
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#227BCE",
  },
  CityCurrentStyle: {
    textAlign: "center",
    marginTop: 20,
    color: "white",
    fontSize: 17,
  },
  CityTextStyle: {
    textAlign: "center",
    marginTop: 10,
    color: "white",
    fontSize: 30,
  },
  weatherMainDes: {
    textAlign: "center",
    marginTop: 10,
    color: "white",
    fontSize: 19
  },
  tempText: {
    textAlign: "center",
    marginTop: 18,
    color: "white",
    fontSize: 35
  },
  tempHighless: {
    textAlign: "center",
    marginTop: 17,
    color: "white",
    fontSize: 18
  },
  detailViewContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  detailWeatherView: {
    width: width - 20,
    height: 160,
    backgroundColor: "#3C6094",
    borderRadius: 15,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  detailItemMainText: {
    color: "white",
    fontWeight: "700",
  },
})