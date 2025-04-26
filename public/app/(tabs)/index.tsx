import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Plus, Sword, FileText, Book, Users, Map } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import ActionCard from '@/components/home/ActionCard';
import RecentCampaignCard from '@/components/home/RecentCampaignCard';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    // Simulate loading recent campaigns
    const timer = setTimeout(() => {
      setRecentCampaigns([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back
        </Text>
        <Text style={[styles.usernameText, { color: colors.primary }]}>
          {user?.email?.split('@')[0] || 'Adventurer'}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <ActionCard 
          title="New Campaign"
          icon={<Plus size={24} color="#FFFFFF" />}
          backgroundColor={colors.primary}
          onPress={() => router.push('/campaigns/new')}
        />
        <ActionCard 
          title="Quick Adventure"
          icon={<Play size={24} color="#FFFFFF" />}
          backgroundColor={colors.accent}
          onPress={() => router.push('/adventure/quick')}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Recent Campaigns
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : recentCampaigns.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentCampaignsScroll}
        >
          {/* Display recent campaigns here */}
          <RecentCampaignCard 
            title="The Crimson Throne"
            lastPlayed="2 days ago"
            progress={75}
            image="https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg"
            onPress={() => router.push('/campaigns/1')}
          />
          <RecentCampaignCard 
            title="Ruins of Azlant"
            lastPlayed="1 week ago"
            progress={45}
            image="https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg"
            onPress={() => router.push('/campaigns/2')}
          />
        </ScrollView>
      ) : (
        <Card style={styles.emptyContainer}>
          <Book size={48} color={colors.textLight} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No recent campaigns
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            Start a new campaign to begin your adventure
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/campaigns/new')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create Campaign</Text>
          </TouchableOpacity>
        </Card>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Quick Actions
      </Text>
      
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.push('/characters')}
        >
          <Users size={24} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: colors.text }]}>
            My Characters
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.push('/world')}
        >
          <Map size={24} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: colors.text }]}>
            Explore World
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.push('/settings')}
        >
          <FileText size={24} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: colors.text }]}>
            Game Rules
          </Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginTop: 8,
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Exo-Regular',
    fontSize: 16,
  },
  usernameText: {
    fontFamily: 'Bitter-Bold',
    fontSize: 28,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  recentCampaignsScroll: {
    paddingBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  createButtonText: {
    fontFamily: 'Exo-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  loadingContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickAction: {
    width: '31%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickActionText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});