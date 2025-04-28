import { useState, useEffect } from 'react';
import { LayoutChangeEvent, Dimensions } from 'react-native';

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  windowWidth: number;
}

export function useElementPosition() {
  const [position, setPosition] = useState<Position | null>(null);
  const windowWidth = Dimensions.get('window').width;

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setPosition({ x, y, width, height, windowWidth });
  };

  return { position, onLayout };
} 