import { SafeAreaView, Text, View, ActivityIndicator } from "react-native";
import tailwind from "tailwind-rn";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {useAssets} from "expo-asset";
import RequestLocationPermissions from "./components/RequestLocationPermissions";
import axios from "axios";

export default function App() {

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [preferredUnits, setPreferredUnits] = useState('metric');
  const [assets, _] = useAssets([require('./assets/icons/pointer.svg')]);

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError({errorType: 'location', errorCode: 400});
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location && location?.coords) {
      const latLng = {lat: location.coords.latitude, lng: location.coords.longitude}
      setLocation(latLng);
      return latLng
    }
    return null;
  }

  const fetchWeatherData = async ({location}) => {
    try {
      console.log(process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY)
      const weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
      const response = await axios.get(weatherApi, {
        params: {
          lat: location.lat,
          lon: location.lng,
          appid: process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY,
          units: preferredUnits,
        },
      });
      setWeatherData(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError({
        errorType: 'WEATHER_ERROR',
        errorCode: 500
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialiseData = async () => {
      try {
        const latLng = await requestLocationAccess()
        if (latLng) {
          await fetchWeatherData({location: latLng})
        }
      } catch (err) {
        console.error(err);
      }
    }

    initialiseData().then();
  }, []);

  return (
    <SafeAreaView style={tailwind("")}>
      {locationError
          ? (<View style={tailwind("flex-1 items-center justify-center")}>
              <RequestLocationPermissions />
            </View>
          ) : loading ? (
              <View>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
          ) : weatherData && (
              <View style={tailwind("p-5 py-10")}>
                <View style={tailwind("bg-gray-200 px-5 py-3 rounded-lg")}>
                  <Text>City: {weatherData.name}</Text>
                  <Text>Temperature: {weatherData?.main?.temp}°C</Text>
                  <Text>Weather: {weatherData?.weather[0]?.description}</Text>
                </View>
              </View>
          )
      }
    </SafeAreaView>
  );
}
