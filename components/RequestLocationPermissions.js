import { Text, View, Button } from "react-native";
import tailwind from "tailwind-rn";
import {useAssets} from "expo-asset";
import TremblingSVG from "../util/trembling-svg";
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';

export default function RequestLocationPermissions() {
  const [assets, error] = useAssets([require('../assets/icons/pointer.svg')]);
  const errorMsg = `
    We need your permission to access location data to provide accurate weather information for 
    your area. \nPlease enable location permissions in your device settings and try again.
  `;

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {(assets && assets.length > 0) &&
            <TremblingSVG
                svg={<Image
                    source={assets[0]} style={{ width: 200, height: 200 }} />}
            />

        }
        <View style={tailwind("bg-yellow-500 px-5 mx-5 py-3 rounded-lg")}>
          <Text style={tailwind("text-white font-semibold text-sm ml-3"
              + " text-center")}>
            {errorMsg}
          </Text>
          <Button
              type="button"
              onPress={() => Linking.openSettings()
              }
              title={'Enable location permissions'}/>
        </View>
      </View>
  )
}
