import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search, Filter, Book } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import CampaignCard from '@/components/campaigns/CampaignCard';
import Card from '@/components/common/Card';
import SearchBar from '@/components/common/SearchBar';

export default function CampaignsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading campaigns
    const timer = setTimeout(() => {
      setCampaigns([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SearchBar
          placeholder="Search campaigns..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color={colors.textLight} />}
        />
        
        <TouchableOpacity 
          style={[styles.filterButton, { borderColor: colors.border }]} 
          onPress={() => {/* Show filters */}}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]} 
          onPress={() => router.push('/campaigns/new')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : campaigns.length > 0 ? (
        <FlatList
          data={filteredCampaigns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CampaignCard
              title={item.title}
              description={item.description}
              players={item.players}
              lastPlayed={item.lastPlayed}
              progress={item.progress}
              image={item.image}
              onPress={() => router.push(`/campaigns/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Card style={styles.emptyCard}>
            <Book size={64} color={colors.textLight} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Campaigns Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Create your first campaign to begin your journey into the world of Pathfinder 2e
            </Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/campaigns/new')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create New Campaign</Text>
            </TouchableOpacity>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Exo-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});