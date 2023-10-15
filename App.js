import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import getSunTime from './getSunTime';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import { ProgressChart } from "react-native-chart-kit";

const apiKey = '26c67ed58f6cd8d8670df2b48a80a200';

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [airData, setAirData] = useState(null);
  const [weatherType, setWeatherType] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } =
      await Location.getCurrentPositionAsync({ accuracy: 5 });
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        setAirData(data);
      });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    if(location[0].region !== null && location[0].district !== null) {
      setCity(location[0].region + ' ' + location[0].district);
    } else if(location[0].city !== null && location[0].region !== null) {
      setCity(location[0].region + ' ' + location[0].city)
    } else {
      setCity(location[0].country)
    }
  };

  const getWeatherTypes = (id, icon) => {
        if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232)) {
            return {
                icon: "weather-lightning-rainy", 
                type: "천둥비"
            };
        } else if (id >= 210 && id <= 221) {
            return {
                icon: "weather-lightning", 
                type: "벼락"
            };
        } else if ((id >= 300 && id <= 321) || id === 520) {
            return {
                icon: "weather-pouring", 
                type: "소나기"
            };
        } else if ((id >= 500 && id <= 504) || (id >= 521 && id <= 531)) {
            return {
                icon: "weather-rainy", 
                type: "비"
            };
        } else if (id === 511 || id === 600 || id === 601 || (id >= 611 && id <= 613) || id === 620 || id === 621) {
            return {
                icon: "weather-snowy", 
                type: "눈"
            };
        } else if (id === 602 || id === 622) {
            return {
                icon: "weather-snowy-heavy", 
                type: "폭설"
            };
        } else if (id === 615 || id === 616) {
            return {
                icon: "weather-snowy-rainy", 
                type: "눈비"
            };
        } else if (id >= 701 && id <= 771) {
            return {
                icon: "weather-fog", 
                type: "안개"
            };
        } else if (id === 781) {
            return {
                icon: "weather-tornado", 
                type: "폭풍"
            };
        } else if (icon === "01d") {
            return {
                icon: "weather-sunny", 
                type: "맑음"
            };
        } else if (icon === "01n") {
            return {
                icon: "weather-night", 
                type: "맑음"
            };
        } else if (icon === "02d") {
            return {
                icon: "weather-partly-cloudy", 
                type: "조금 흐림"
            };
        } else if (icon === "02n") {
            return {
                icon: "weather-night-partly-cloudy", 
                type: "조금 흐림"
            };
        } else if (id >= 802 && id <= 804) {
            return {
                icon: "weather-cloudy", 
                type: "흐림"
            };
        } else {
            return {
                icon: "alert-box-outline", 
                type: "날씨 정보 오류"
            };
        };
    };

  useEffect(() => {
    ask();
  }, []);

  useEffect(() => {
    const { type, icon } = getWeatherTypes(
      weatherData?.weather[0]?.id,
      weatherData?.weather[0]?.icon
    );
    setWeatherType(type);
    setWeatherIcon(icon);
  }, [weatherData]);

  const nowTemp = weatherData?.main?.temp.toFixed(1);
  const sys = weatherData?.sys;
  const sunsetTime = getSunTime(sys?.sunset);
  const sunriseTime = getSunTime(sys?.sunrise);
  if(!weatherData) {
    return (
      <View style={styles.container}>
        <View style={styles.RedView}></View>
        <ScrollView style={styles.BlueView}>
          <ActivityIndicator size="large" color='white' style={{marginTop: '50%'}} />
        </ScrollView>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.RedView}></View>
      <ScrollView style={styles.BlueView}>
        <Text style={styles.CityTextStyle}>{city}</Text>
        <View style={styles.weatherMainView}>
          <MaterialCommunityIcons
            style={styles.weatherIcon}
            name={weatherIcon}
            size={48}
            color="white"
          />
          <Text style={styles.tempText}>{nowTemp}</Text>
          <MaterialCommunityIcons
            style={styles.tempIcon}
            name="temperature-celsius"
            size={48}
            color="white"
          />
        </View>
        <View style={styles.weatherDesView}>
          <Text style={{ ...styles.weatherDes}}>
            {weatherType}
          </Text>
          <FontAwesome5
            name="temperature-high"
            size={24}
            color="white"
            style={styles.weatherDesicon}
          />
          <Text
            style={{
              ...styles.weatherDes,
              marginLeft: 10,
              fontSize: 27,
            }}
          >
            {weatherData?.main?.temp_max}&#176;C
          </Text>
          <FontAwesome5
            name="temperature-low"
            size={24}
            color="white"
            style={styles.weatherDesicon}
          />
          <Text
            style={{
              ...styles.weatherDes,
              marginLeft: 10,
              fontSize: 27,
            }}
          >
            {weatherData?.main?.temp_min}&#176;C
          </Text>
        </View>
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
        <View style={styles.microdustContainer}>
          <View style={styles.microdustBox}>
          <ProgressChart 
            data={{ data: [airData?.list[0]?.components?.pm10 / 300] }} 
            width={100} 
            height={100} 
            strokeWidth={10} 
            radius={34} 
            chartConfig={{
              backgroundGradientFrom: "#ffffff", 
              backgroundGradientFromOpacity: 0, 
              backgroundGradientTo: "#ffffff", 
              backgroundGradientToOpacity: 0, 
              color: (opacity=1) => {
                  const microdust = airData?.list[0]?.components?.pm10;
                  if (microdust < 25) {
                      return `rgba(160, 248, 194, ${opacity})`;
                  } else if (microdust >= 25 && microdust < 50) {
                      return `rgba(162, 218, 153, ${opacity})`;
                  } else if (microdust >= 50 && microdust < 90) {
                      return `rgba(209, 221, 173, ${opacity})`;
                  } else if (microdust >= 90 && microdust < 180) {
                      return `rgba(240, 193, 164, ${opacity})`;
                  } else {
                      return `rgba(255, 125, 128, ${opacity})`;
                  };
              }
            }} 
            hideLegend={true} 
          />
          <View style={styles.microdustTextContainer}>
            <Text allowFontScaling={false} style={styles.microdustText}>미세먼지</Text>
            <Text allowFontScaling={false} style={styles.microdustText}>{airData?.list[0]?.components?.pm10.toFixed(1)}ppm</Text>
          </View>
          <ProgressChart 
            data={{ data: [airData?.list[0]?.components?.pm2_5 / 300] }} 
            width={100} 
            height={100} 
            strokeWidth={10} 
            radius={34} 
            chartConfig={{
              backgroundGradientFrom: "#ffffff", 
              backgroundGradientFromOpacity: 0, 
              backgroundGradientTo: "#ffffff", 
              backgroundGradientToOpacity: 0, 
              color: (opacity=1) => {
                  const microdust = airData?.list[0]?.components?.pm2_5;
                  if (microdust < 25) {
                      return `rgba(160, 248, 194, ${opacity})`;
                  } else if (microdust >= 25 && microdust < 50) {
                      return `rgba(162, 218, 153, ${opacity})`;
                  } else if (microdust >= 50 && microdust < 90) {
                      return `rgba(209, 221, 173, ${opacity})`;
                  } else if (microdust >= 90 && microdust < 180) {
                      return `rgba(240, 193, 164, ${opacity})`;
                  } else {
                      return `rgba(255, 125, 128, ${opacity})`;
                  };
              }
            }} 
            hideLegend={true} 
          />
          <View style={styles.microdustTextContainer}>
            <Text allowFontScaling={false} style={styles.microdustText}>초미세먼지</Text>
            <Text allowFontScaling={false} style={styles.microdustText}>{airData?.list[0]?.components?.pm2_5.toFixed(1)}ppm</Text>
          </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#385781',
  },
  RedView: {
    flex: 0.5,
    backgroundColor: '#A8A765',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  BlueView: {
    flex: 2,
    backgroundColor: '#385781',
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
    color: 'white',
  },
  weatherMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  tempText: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
    marginLeft: '3%',
  },
  tempIcon: {
    marginTop: 0,
  },
  detailViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  detailWeatherView: {
    width: width - 20,
    height: 160,
    backgroundColor: '#3C6094',
    borderRadius: 15,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  detailItemMainText: {
    color: 'white',
    fontWeight: '700',
  },
  weatherDes: {
    color: 'white',
    fontSize: 25,
    top: -15,
  },
  weatherDesView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  weatherDesicon: {
    marginLeft: 10,
    top: -15
  },
  weatherIcon: {
    marginLeft: '3%',
  },
  microdustBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  microdustContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#3C6094',
    borderRadius: 15,
    width: '92%',
  },
  microdustText: {
    fontSize: 17,
    color: 'white',
  }, 
  microdustTextContainer: {
    marginLeft: -2,
  }
});
