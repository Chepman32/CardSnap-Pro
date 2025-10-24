/**
 * Mind Map Editor Screen
 * Main editing interface with canvas, gestures, and node manipulation
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {GestureHandlerRootView, GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {RootStackParamList} from '../navigation/RootNavigator';
import {RootState} from '../store';
import {updateMindMap, addNode} from '../store/slices/mindMapsSlice';
import {useTheme} from '../theme';
import {createDefaultNode} from '../models/Node';
import MindMapCanvas from '../components/mindmap/MindMapCanvas';

type EditorScreenRouteProp = RouteProp<RootStackParamList, 'MindMapEditor'>;
type EditorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MindMapEditor'>;

const MindMapEditorScreen: React.FC = () => {
  const route = useRoute<EditorScreenRouteProp>();
  const navigation = useNavigation<EditorScreenNavigationProp>();
  const dispatch = useDispatch();
  const {currentColors} = useTheme();

  const {mapId} = route.params;
  const mindMap = useSelector((state: RootState) => state.mindMaps.maps[mapId]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(mindMap?.title || '');

  if (!mindMap) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Mind map not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveTitle = () => {
    dispatch(updateMindMap({id: mapId, updates: {title}}));
    setIsEditingTitle(false);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentColors.background}]}>
      {/* Navigation Bar */}
      <View style={[styles.navbar, {backgroundColor: currentColors.surface}]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={{fontSize: 24, color: currentColors.text}}>←</Text>
        </TouchableOpacity>

        {isEditingTitle ? (
          <TextInput
            style={[styles.titleInput, {color: currentColors.text}]}
            value={title}
            onChangeText={setTitle}
            onBlur={handleSaveTitle}
            onSubmitEditing={handleSaveTitle}
            autoFocus
            maxLength={60}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
            <Text style={[styles.title, {color: currentColors.text}]}>{title}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={{fontSize: 20, color: currentColors.text}}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={{fontSize: 20, color: currentColors.text}}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas */}
      <MindMapCanvas mindMap={mindMap} />

      {/* Bottom Toolbar */}
      <View style={[styles.toolbar, {backgroundColor: currentColors.surface}]}>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={{fontSize: 20}}>👁</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={{fontSize: 20}}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={{fontSize: 20}}>🎨</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={{fontSize: 20}}>↻</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={{fontSize: 20}}>🗺</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 16,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  toolButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MindMapEditorScreen;
