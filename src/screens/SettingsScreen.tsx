/**
 * Settings Screen
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {currentColors} = useTheme();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentColors.background}]}>
      <View style={[styles.header, {backgroundColor: currentColors.surface}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 24, color: currentColors.text}}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: currentColors.text}]}>Settings</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, {backgroundColor: currentColors.surface}]}>
          <Text style={[styles.sectionTitle, {color: currentColors.text}]}>Account</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={{color: currentColors.text}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={{color: currentColors.text}}>Subscription</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, {backgroundColor: currentColors.surface}]}>
          <Text style={[styles.sectionTitle, {color: currentColors.text}]}>Appearance</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={{color: currentColors.text}}>Theme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
  },
});

export default SettingsScreen;
