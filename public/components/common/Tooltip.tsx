import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useElementPosition } from '@/hooks/useElementPosition';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const { colors } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const { position: elementPosition, onLayout } = useElementPosition();

  const onTooltipLayout = (event: LayoutChangeEvent) => {
    setTooltipWidth(event.nativeEvent.layout.width);
  };

  const getPositionStyles = () => {
    if (!elementPosition) return {};

    const { x, width, windowWidth } = elementPosition;
    const elementCenter = x + width / 2;
    const tooltipHalfWidth = tooltipWidth / 2;
    
    // Verifica se o tooltip vai ultrapassar as bordas
    const exceedsLeft = elementCenter - tooltipHalfWidth < 0;
    const exceedsRight = elementCenter + tooltipHalfWidth > windowWidth;

    let translateX = -50; // Porcentagem padrão para centralizar
    let left = '50%';
    let arrowLeft = '50%';

    if (exceedsLeft) {
      translateX = 0;
      left = 0;
      arrowLeft = `${elementCenter}px`;
    } else if (exceedsRight) {
      translateX = -100;
      left = '100%';
      arrowLeft = `${windowWidth - elementCenter}px`;
    }

    switch (position) {
      case 'bottom':
        return {
          tooltip: {
            top: '100%',
            marginTop: 8,
            left,
            transform: [{ translateX }],
          },
          arrow: {
            top: -5,
            left: arrowLeft,
            marginLeft: -5,
            borderBottomWidth: 5,
            borderTopWidth: 0,
            borderBottomColor: colors.cardBackground,
          }
        };
      case 'left':
        return {
          tooltip: {
            right: '100%',
            top: '50%',
            transform: [{ translateY: -50 }, { translateX: -8 }],
          },
          arrow: {
            right: -5,
            top: '50%',
            marginTop: -5,
            borderLeftWidth: 5,
            borderRightWidth: 0,
            borderLeftColor: colors.cardBackground,
          }
        };
      case 'right':
        return {
          tooltip: {
            left: '100%',
            top: '50%',
            transform: [{ translateY: -50 }, { translateX: 8 }],
          },
          arrow: {
            left: -5,
            top: '50%',
            marginTop: -5,
            borderRightWidth: 5,
            borderLeftWidth: 0,
            borderRightColor: colors.cardBackground,
          }
        };
      default: // top
        return {
          tooltip: {
            bottom: '100%',
            marginBottom: 8,
            left,
            transform: [{ translateX }],
          },
          arrow: {
            bottom: -5,
            left: arrowLeft,
            marginLeft: -5,
            borderTopWidth: 5,
            borderBottomWidth: 0,
            borderTopColor: colors.cardBackground,
          }
        };
    }
  };

  const positionStyles = getPositionStyles();

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </View>
      
      {showTooltip && (
        <View 
          style={[styles.tooltip, positionStyles.tooltip, { backgroundColor: colors.cardBackground }]}
          onLayout={onTooltipLayout}
        >
          <View style={[styles.arrow, positionStyles.arrow]} />
          <Text style={[styles.tooltipText, { color: colors.text }]}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    padding: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  arrow: {
    position: 'absolute',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
}); 