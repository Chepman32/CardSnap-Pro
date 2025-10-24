/**
 * Contact Detail View Screen
 * Displays complete contact information with interaction options
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';

const ContactDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {contactId} = route.params as {contactId: string};

  // Mock contact data
  const contact = {
    id: contactId,
    fullName: 'John Doe',
    jobTitle: 'Marketing Director',
    company: 'Acme Corporation',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@acme.com',
    website: 'www.acme.com',
    isFavorite: false,
  };

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${contact.website}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.brandPrimary, Colors.brandSecondary]}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="dots-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contact.fullName
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </View>
          <Text style={styles.name}>{contact.fullName}</Text>
          <Text style={styles.title}>{contact.jobTitle}</Text>
          <Text style={styles.company}>{contact.company}</Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <View style={[styles.actionIcon, {backgroundColor: Colors.info + '20'}]}>
            <Icon name="phone" size={24} color={Colors.info} />
          </View>
          <Text style={styles.actionLabel}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <View
            style={[styles.actionIcon, {backgroundColor: Colors.brandPrimary + '20'}]}>
            <Icon name="email" size={24} color={Colors.brandPrimary} />
          </View>
          <Text style={styles.actionLabel}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View
            style={[styles.actionIcon, {backgroundColor: Colors.success + '20'}]}>
            <Icon name="message" size={24} color={Colors.success} />
          </View>
          <Text style={styles.actionLabel}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View
            style={[styles.actionIcon, {backgroundColor: Colors.warning + '20'}]}>
            <Icon name="directions" size={24} color={Colors.warning} />
          </View>
          <Text style={styles.actionLabel}>Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Icon name="phone" size={22} color={Colors.gray500} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>mobile</Text>
                <Text style={styles.infoValue}>{contact.phone}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.gray400} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
              <Icon name="email" size={22} color={Colors.gray500} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>work</Text>
                <Text style={styles.infoValue}>{contact.email}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.gray400} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoRow} onPress={handleWebsite}>
              <Icon name="web" size={22} color={Colors.gray500} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>website</Text>
                <Text style={styles.infoValue}>{contact.website}</Text>
              </View>
              <Icon name="link" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Favorite Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon
          name={contact.isFavorite ? 'star' : 'star-outline'}
          size={28}
          color={contact.isFavorite ? Colors.premium : Colors.gray500}
        />
      </TouchableOpacity>
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
    paddingBottom: Spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.xl + 20,
    left: Spacing.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: Spacing.xl + 20,
    right: Spacing.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  company: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: -Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadow.medium,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  infoContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ContactDetailScreen;
