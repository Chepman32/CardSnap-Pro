/**
 * Card Gallery Organization Screen
 * Tags, collections, and contact organization
 */

import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';

const OrganizationScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'tags' | 'collections' | 'recent'>('tags');

  const tags = [
    {id: '1', name: 'Work', color: Colors.info, count: 24},
    {id: '2', name: 'Conference', color: Colors.success, count: 12},
    {id: '3', name: 'Clients', color: Colors.warning, count: 18},
    {id: '4', name: 'Partners', color: Colors.brandPrimary, count: 8},
  ];

  const collections = [
    {id: '1', name: 'Tech Summit 2024', count: 15},
    {id: '2', name: 'Important Clients', count: 22},
    {id: '3', name: 'Potential Partners', count: 10},
  ];

  const TabButton = ({
    title,
    value,
  }: {
    title: string;
    value: 'tags' | 'collections' | 'recent';
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === value && styles.tabButtonActive]}
      onPress={() => setSelectedTab(value)}>
      <Text
        style={[styles.tabButtonText, selectedTab === value && styles.tabButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organize</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TabButton title="Tags" value="tags" />
        <TabButton title="Collections" value="collections" />
        <TabButton title="Recent" value="recent" />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'tags' && (
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.contentTitle}>All Tags</Text>
              <TouchableOpacity>
                <Icon name="plus" size={24} color={Colors.brandPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.tagCloud}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.tagBubble, {borderColor: tag.color}]}>
                  <Text style={[styles.tagText, {color: tag.color}]}>{tag.name}</Text>
                  <View style={[styles.tagCount, {backgroundColor: tag.color}]}>
                    <Text style={styles.tagCountText}>{tag.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'collections' && (
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.contentTitle}>Collections</Text>
              <TouchableOpacity>
                <Icon name="plus" size={24} color={Colors.brandPrimary} />
              </TouchableOpacity>
            </View>
            {collections.map(collection => (
              <TouchableOpacity key={collection.id} style={styles.collectionCard}>
                <View style={styles.collectionPreview}>
                  <Icon name="folder-multiple" size={32} color={Colors.brandPrimary} />
                </View>
                <View style={styles.collectionInfo}>
                  <Text style={styles.collectionName}>{collection.name}</Text>
                  <Text style={styles.collectionCount}>{collection.count} cards</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.gray400} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === 'recent' && (
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Recent Activity</Text>
            <View style={styles.emptyState}>
              <Icon name="clock-outline" size={80} color={Colors.gray300} />
              <Text style={styles.emptyTitle}>No recent activity</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    paddingTop: Spacing.xl + 20,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadow.small,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: 4,
    ...Shadow.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabButtonActive: {
    backgroundColor: Colors.brandPrimary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    backgroundColor: Colors.white,
    ...Shadow.small,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  tagCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tagCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  collectionPreview: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  collectionCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});

export default OrganizationScreen;
