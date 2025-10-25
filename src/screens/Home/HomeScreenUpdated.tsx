/**
 * Home Screen - Card Gallery (Updated with Real Data)
 * Displays masonry grid of scanned business cards
 */

import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, Shadow, BorderRadius} from '@constants/theme';
import {useContacts} from '@hooks/useContacts';
import {LoadingOverlay} from '@components/ui/LoadingOverlay';
import ContactService from '@services/database/ContactService';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.md * 3) / 2;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {contacts: allContacts, loading, refresh} = useContacts();
  const [contacts, setContacts] = useState(allContacts);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    applyFilter(selectedFilter);
  }, [selectedFilter, allContacts]);

  const applyFilter = async (filter: string) => {
    switch (filter) {
      case 'favorites':
        const favorites = await ContactService.getFavoriteContacts();
        setContacts(favorites);
        break;
      case 'recent':
        const recent = await ContactService.getRecentContacts(20);
        setContacts(recent);
        break;
      default:
        setContacts(allContacts);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const navigateToCamera = () => {
    navigation.navigate('Camera' as never);
  };

  const navigateToContactDetail = (contactId: string) => {
    // Increment view count
    ContactService.incrementViewCount(contactId);
    navigation.navigate('ContactDetail' as never, {contactId} as never);
  };

  const handleToggleFavorite = async (contactId: string, e: any) => {
    e.stopPropagation();
    await ContactService.toggleFavorite(contactId);
    await refresh();
  };

  const renderCard = ({item}: {item: any}) => (
    <Animated.View entering={FadeInDown} style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigateToContactDetail(item.id)}
        style={styles.card}>
        <View style={styles.cardImagePlaceholder}>
          {item.primaryCardId ? (
            <Image
              source={{uri: `file://${item.primaryCardId}`}}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          ) : (
            <Icon name="card-account-details" size={40} color={Colors.gray400} />
          )}
        </View>
        <View style={styles.cardOverlay}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.fullName}
          </Text>
          {item.company && (
            <Text style={styles.cardCompany} numberOfLines={1}>
              {item.company}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={e => handleToggleFavorite(item.id, e)}>
          <Icon
            name={item.isFavorite ? 'star' : 'star-outline'}
            size={16}
            color={item.isFavorite ? Colors.premium : Colors.gray400}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="card-search" size={120} color={Colors.gray300} />
      <Text style={styles.emptyTitle}>No Cards Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the camera button to scan your first business card
      </Text>
      <Icon
        name="arrow-down"
        size={32}
        color={Colors.brandPrimary}
        style={styles.emptyArrow}
      />
    </View>
  );

  const filters = ['all', 'favorites', 'recent'];

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="menu" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>CardSnap Pro</Text>
        <TouchableOpacity style={styles.navButton} onPress={navigateToCamera}>
          <Icon name="plus" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipSelected,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextSelected,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card Grid */}
      <FlashList
        data={contacts}
        renderItem={renderCard}
        estimatedItemSize={CARD_WIDTH * 1.5}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brandPrimary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={navigateToCamera}>
        <LinearGradient
          colors={[Colors.brandPrimary, Colors.brandSecondary]}
          style={styles.fabGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Icon name="camera" size={28} color={Colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {loading && <LoadingOverlay message="Loading contacts..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadow.small,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    marginRight: Spacing.sm,
  },
  filterChipSelected: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextSelected: {
    color: Colors.white,
  },
  gridContent: {
    padding: Spacing.md,
  },
  cardContainer: {
    flex: 1,
    padding: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  cardImagePlaceholder: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOverlay: {
    padding: Spacing.sm,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardCompany: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  favoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 64,
    height: 64,
    borderRadius: 32,
    ...Shadow.large,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  emptyArrow: {
    marginTop: Spacing.lg,
  },
});

export default HomeScreen;
