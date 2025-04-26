import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Moon, Sun, Key, User, Bell, CircleHelp as HelpCircle, FileText, Info } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import SettingsItem from '@/components/settings/SettingsItem';
import SettingsSection from '@/components/settings/SettingsSection';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.profileSection}>
        <View style={[styles.profileIconContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.profileIconText}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.email?.split('@')[0] || 'Adventurer'}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textLight }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.editProfileButton, { borderColor: colors.border }]}
          onPress={() => router.push('/settings/profile')}
        >
          <Text style={[styles.editProfileText, { color: colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <SettingsSection title="App Settings">
        <SettingsItem 
          icon={theme === 'dark' ? <Moon size={22} color={colors.text} /> : <Sun size={22} color={colors.text} />}
          title="Dark Mode"
          right={
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primaryLight }}
              thumbColor={theme === 'dark' ? colors.primary : '#F9FAFB'}
            />
          }
        />
        
        <SettingsItem 
          icon={<Bell size={22} color={colors.text} />}
          title="Notifications"
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : '#F9FAFB'}
            />
          }
        />
        
        <SettingsItem 
          icon={<Key size={22} color={colors.text} />}
          title="API Key Settings"
          onPress={() => router.push('/settings/api-key')}
        />
      </SettingsSection>
      
      <SettingsSection title="Support">
        <SettingsItem 
          icon={<HelpCircle size={22} color={colors.text} />}
          title="Help & Support"
          onPress={() => router.push('/settings/help')}
        />
        
        <SettingsItem 
          icon={<FileText size={22} color={colors.text} />}
          title="Game Rules"
          onPress={() => router.push('/settings/rules')}
        />
        
        <SettingsItem 
          icon={<Info size={22} color={colors.text} />}
          title="About MYTHOSCAPE"
          onPress={() => router.push('/settings/about')}
        />
      </SettingsSection>
      
      <SettingsSection>
        <SettingsItem 
          icon={<LogOut size={22} color={colors.error} />}
          title="Sign Out"
          titleStyle={{ color: colors.error }}
          onPress={handleSignOut}
        />
      </SettingsSection>
      
      <Text style={[styles.versionText, { color: colors.textLight }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    fontFamily: 'Bitter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
  },
  editProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  editProfileText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
  versionText: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});