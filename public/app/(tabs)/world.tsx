import { useState, useEffect } from 'react';
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
import { Search, Globe, Map as MapIcon, Navigation, Compass } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card';
import WorldCard from '@/components/world/WorldCard';
import SearchBar from '@/components/common/SearchBar';

export default function WorldScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading world data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const continents = [
    {
      id: 1,
      name: 'Thassilon',
      description: 'Ancient land of rune lords and forgotten magic',
      locations: 12,
      image: 'https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg'
    },
    {
      id: 2,
      name: 'Arcadia',
      description: 'Verdant realm of nature and ancient spirits',
      locations: 8,
      image: 'https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg'
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search world..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color={colors.textLight} />}
          style={{ flex: 1 }}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading world data...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.worldMapContainer}>
            <Card style={styles.worldMapCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/4215113/pexels-photo-4215113.jpeg' }}
                style={styles.worldMapImage}
              />
              <View style={styles.worldMapOverlay}>
                <Text style={[styles.worldMapTitle, { color: '#FFFFFF' }]}>
                  World Map
                </Text>
                <TouchableOpacity 
                  style={[styles.exploreButton, { backgroundColor: colors.accent }]}
                  onPress={() => router.push('/world/map')}
                >
                  <MapIcon size={16} color="#FFFFFF" />
                  <Text style={styles.exploreButtonText}>Explore</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Continents
          </Text>
          
          {continents.map((continent) => (
            <WorldCard
              key={continent.id}
              name={continent.name}
              description={continent.description}
              locationCount={continent.locations}
              image={continent.image}
              onPress={() => router.push(`/world/continent/${continent.id}`)}
            />
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Explore
          </Text>
          
          <View style={styles.exploreGrid}>
            <TouchableOpacity 
              style={[styles.exploreCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/world/cities')}
            >
              <MapIcon size={32} color={colors.primary} />
              <Text style={[styles.exploreCardTitle, { color: colors.text }]}>
                Cities
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exploreCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/world/npcs')}
            >
              <Users size={32} color={colors.primary} />
              <Text style={[styles.exploreCardTitle, { color: colors.text }]}>
                NPCs
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exploreCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/world/quests')}
            >
              <Compass size={32} color={colors.primary} />
              <Text style={[styles.exploreCardTitle, { color: colors.text }]}>
                Quests
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exploreCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/world/items')}
            >
              <Sword size={32} color={colors.primary} />
              <Text style={[styles.exploreCardTitle, { color: colors.text }]}>
                Items
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Exo-Medium',
    fontSize: 16,
    marginTop: 16,
  },
  worldMapContainer: {
    marginBottom: 24,
  },
  worldMapCard: {
    padding: 0,
    overflow: 'hidden',
  },
  worldMapImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  worldMapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  worldMapTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  exploreButtonText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exploreCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exploreCardTitle: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginTop: 8,
  },
});