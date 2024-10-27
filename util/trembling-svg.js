import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const TremblingSVG = ({svg}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 50,
            useNativeDriver: true,
          }),
        ])
    ).start();
  }, [shakeAnim]);

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-1deg', '1deg'],
  });

  return (
      <View>
        <Animated.View style={{ transform: [{ rotate: shakeInterpolate }] }}>
          {svg}
        </Animated.View>
      </View>
  );
};

export default TremblingSVG;
