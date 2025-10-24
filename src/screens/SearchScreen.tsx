/**
 * Search Screen
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const {currentColors} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentColors.background}]}>
      <View style={[styles.searchBar, {backgroundColor: currentColors.surface}]}>
        <Text style={{fontSize: 20, marginRight: 12}}>🔍</Text>
        <TextInput
          style={[styles.input, {color: currentColors.text}]}
          placeholder="Search mind maps, nodes..."
          placeholderTextColor={currentColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        <Text
          style={{fontSize: 16, color: currentColors.text}}
          onPress={() => navigation.goBack()}>
          Cancel
        </Text>
      </View>

      <View style={styles.results}>
        <Text style={[styles.emptyText, {color: currentColors.textSecondary}]}>
          Start typing to search
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  results: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SearchScreen;
