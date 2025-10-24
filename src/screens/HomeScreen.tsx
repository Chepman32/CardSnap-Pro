/**
 * Home Screen - Mind Map Gallery
 * Displays all mind maps in a masonry grid layout
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {RootState} from '../store';
import {addMindMap, setCurrentMap} from '../store/slices/mindMapsSlice';
import {createDefaultMindMap} from '../models/MindMap';
import {useTheme} from '../theme';
import {RootStackParamList} from '../navigation/RootNavigator';
import MindMapCard from '../components/mindmap/MindMapCard';
import FloatingActionButton from '../components/common/FloatingActionButton';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const {width} = Dimensions.get('window');
const CARD_MARGIN = 16;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / NUM_COLUMNS;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const {currentColors, spacing} = useTheme();
  const mindMaps = useSelector((state: RootState) => state.mindMaps.maps);
  const isPremium = useSelector((state: RootState) => state.user.isPremium);

  const [showFABMenu, setShowFABMenu] = useState(false);

  const mindMapsList = Object.values(mindMaps)
    .filter(map => !map.metadata.isArchived)
    .sort((a, b) => b.modifiedAt - a.modifiedAt);

  const handleCreateMindMap = () => {
    // Check free tier limit
    if (!isPremium && mindMapsList.length >= 10) {
      // Show premium prompt
      navigation.navigate('Premium');
      return;
    }

    const newMindMap = createDefaultMindMap();
    dispatch(addMindMap(newMindMap));
    dispatch(setCurrentMap(newMindMap.id));
    navigation.navigate('MindMapEditor', {mapId: newMindMap.id, isNew: true});
  };

  const handleOpenMindMap = (mapId: string) => {
    dispatch(setCurrentMap(mapId));
    navigation.navigate('MindMapEditor', {mapId});
  };

  const renderMindMapCard = ({item, index}: {item: any; index: number}) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={{width: CARD_WIDTH, margin: CARD_MARGIN / 2}}>
      <MindMapCard mindMap={item} onPress={() => handleOpenMindMap(item.id)} />
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, {color: currentColors.text}]}>
        No mind maps yet
      </Text>
      <Text style={[styles.emptySubtitle, {color: currentColors.textSecondary}]}>
        Create your first thought map
      </Text>
      <TouchableOpacity
        style={[styles.ctaButton, {backgroundColor: '#6B46C1'}]}
        onPress={handleCreateMindMap}>
        <Text style={styles.ctaButtonText}>Start Mapping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentColors.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: currentColors.surface}]}>
        <TouchableOpacity style={styles.avatarButton}>
          <View style={styles.avatar} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: currentColors.text}]}>MindWeave</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={{fontSize: 24, color: currentColors.text}}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Mind Maps Grid */}
      {mindMapsList.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={mindMapsList}
          renderItem={renderMindMapCard}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCreateMindMap} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarButton: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  grid: {
    padding: CARD_MARGIN / 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
