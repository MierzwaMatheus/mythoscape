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
import { Plus, Search, Filter, Users } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import CharacterCard from '@/components/characters/CharacterCard';
import Card from '@/components/common/Card';
import SearchBar from '@/components/common/SearchBar';

export default function CharactersScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading characters
    const timer = setTimeout(() => {
      setCharacters([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SearchBar
          placeholder="Search characters..."
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
          onPress={() => router.push('/characters/new')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : characters.length > 0 ? (
        <FlatList
          data={filteredCharacters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CharacterCard
              name={item.name}
              ancestry={item.ancestry}
              class={item.class}
              level={item.level}
              image={item.image}
              onPress={() => router.push(`/characters/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Card style={styles.emptyCard}>
            <Users size={64} color={colors.textLight} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Characters Created
            </Text>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Create your first character to embark on an adventure in the world of Pathfinder 2e
            </Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/characters/new')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create New Character</Text>
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