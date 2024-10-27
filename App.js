import { SafeAreaView, Text, View } from "react-native";
import tailwind from "tailwind-rn";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {useAssets} from "expo-asset";
import RequestLocationPermissions
  from "./components/RequestLocationPermissions";

export default function App() {

  const [location, setLocation] = useState(null);
  const [locationError, setlocationError] = useState(null);
  const [assets, error] = useAssets([require('./assets/icons/pointer.svg')]);

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setlocationError(true);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setLocation(location);
  }

  useEffect(() => {
    requestLocationAccess()
    .then(console.log)
    .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={tailwind("flex-1 items-center justify-center")}>
      {locationError ? (<RequestLocationPermissions />) : (
          <View style={tailwind("bg-blue-500 px-5 py-3 rounded-full")}>
            <Text style={tailwind("text-white font-semibold text-lg")}>
              Hello Tailwind 👋
            </Text>
          </View>
      )}
    </SafeAreaView>
  );
}
