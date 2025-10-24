/**
 * Premium/IAP Screen
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme';

const PremiumScreen: React.FC = () => {
  const navigation = useNavigation();
  const {currentColors} = useTheme();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#6B46C1'}]}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hero}>Unlock Your Full Potential</Text>
        <Text style={styles.subtitle}>Experience MindWeave Premium</Text>

        <View style={styles.features}>
          <Text style={styles.feature}>✓ Unlimited Mind Maps</Text>
          <Text style={styles.feature}>✓ Cloud Sync</Text>
          <Text style={styles.feature}>✓ Advanced Export</Text>
          <Text style={styles.feature}>✓ Collaboration</Text>
          <Text style={styles.feature}>✓ Premium Themes</Text>
        </View>

        <View style={styles.pricing}>
          <TouchableOpacity style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Monthly</Text>
            <Text style={styles.pricingPrice}>$4.99/mo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.pricingCard, styles.pricingCardHighlight]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST VALUE</Text>
            </View>
            <Text style={styles.pricingTitle}>Annual</Text>
            <Text style={styles.pricingPrice}>$39.99/yr</Text>
            <Text style={styles.pricingSave}>Save 33%</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Lifetime</Text>
            <Text style={styles.pricingPrice}>$99.99</Text>
            <Text style={styles.pricingSave}>One-time payment</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Start Free Trial</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>7 days free, then auto-renews</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  hero: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  pricing: {
    width: '100%',
    marginBottom: 32,
  },
  pricingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  pricingCardHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  badge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B46C1',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pricingSave: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  disclaimer: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});

export default PremiumScreen;
