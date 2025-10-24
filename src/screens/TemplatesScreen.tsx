/**
 * Templates Screen
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme';

const TemplatesScreen: React.FC = () => {
  const navigation = useNavigation();
  const {currentColors} = useTheme();

  const templates = [
    {id: '1', name: 'SWOT Analysis', category: 'Business'},
    {id: '2', name: 'Project Planning', category: 'Project Management'},
    {id: '3', name: 'Brainstorming', category: 'Creative'},
    {id: '4', name: 'Study Notes', category: 'Education'},
  ];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentColors.background}]}>
      <View style={[styles.header, {backgroundColor: currentColors.surface}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 24, color: currentColors.text}}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: currentColors.text}]}>Templates</Text>
        <View style={{width: 40}} />
      </View>

      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={[styles.templateCard, {backgroundColor: currentColors.surface}]}>
            <Text style={[styles.templateName, {color: currentColors.text}]}>{item.name}</Text>
            <Text style={[styles.templateCategory, {color: currentColors.textSecondary}]}>
              {item.category}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
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
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 14,
  },
});

export default TemplatesScreen;
