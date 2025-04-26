import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextStyle,
  ViewStyle 
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showArrow?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  right,
  showArrow = true,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const { colors } = useTheme();
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.container,
        { borderBottomColor: colors.border },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title, 
              { color: colors.text },
              titleStyle
            ]}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text 
              style={[
                styles.subtitle, 
                { color: colors.textLight },
                subtitleStyle
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {right ? (
          right
        ) : (
          onPress && showArrow && (
            <ChevronRight size={20} color={colors.textLight} />
          )
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Exo-Medium',
    fontSize: 16,
  },
  subtitle: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  rightContainer: {
    marginLeft: 16,
  },
});

export default SettingsItem;