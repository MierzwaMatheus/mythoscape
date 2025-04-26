import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface TabBarIconProps {
  icon: React.ElementType;
  color: string;
  size: number;
  focused?: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  icon: Icon,
  color,
  size,
  focused = false,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(focused ? 1.1 : 1, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBarIcon;