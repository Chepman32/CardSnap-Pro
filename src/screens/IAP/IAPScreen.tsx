/**
 * In-App Purchase (IAP) Screen
 * Premium subscription and lifetime purchase options
 */

import React from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';

const IAPScreen: React.FC = () => {
  const navigation = useNavigation();

  const features = [
    {icon: 'infinity', title: 'Unlimited Card Scans', description: 'Scan as many cards as you need'},
    {icon: 'auto-fix', title: 'Enhanced Text Recognition', description: '99% accurate OCR with 20+ languages'},
    {icon: 'cloud-check', title: 'Automatic Cloud Backup', description: 'Never lose your contacts with iCloud sync'},
    {icon: 'folder-multiple', title: 'Unlimited Tags & Collections', description: 'Organize without limits'},
    {icon: 'file-export', title: 'Advanced Export', description: 'Export to CSV, Excel, PDF, and more'},
    {icon: 'headset', title: 'Priority Support', description: 'Get help within 24 hours'},
  ];

  const pricingPlans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$4.99',
      period: '/month',
      badge: null,
    },
    {
      id: 'annual',
      title: 'Annual',
      price: '$39.99',
      period: '/year',
      badge: 'Best Value',
      savings: 'Save 33%',
    },
    {
      id: 'lifetime',
      title: 'Lifetime',
      price: '$99.99',
      period: 'forever',
      badge: 'One-Time',
    },
  ];

  const [selectedPlan, setSelectedPlan] = React.useState('annual');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.brandPrimary, Colors.brandSecondary]}
        style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Icon name="crown" size={80} color={Colors.premium} />
        <Text style={styles.headerTitle}>Unlock Premium Features</Text>
        <Text style={styles.headerSubtitle}>Get unlimited scans and advanced features</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Features List */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={24} color={Colors.brandPrimary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {pricingPlans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.pricingCard,
                selectedPlan === plan.id && styles.pricingCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}>
              {plan.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}
              <View style={styles.pricingContent}>
                <View>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.period}>{plan.period}</Text>
                  </View>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </View>
                {selectedPlan === plan.id && (
                  <Icon name="check-circle" size={24} color={Colors.brandPrimary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.purchaseButton}>
          <LinearGradient
            colors={[Colors.brandPrimary, Colors.brandSecondary]}
            style={styles.purchaseGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Text style={styles.purchaseButtonText}>Start Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restoreButton}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.xl + 20,
    right: Spacing.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.md,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  featuresSection: {
    padding: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pricingSection: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  pricingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },
  pricingCardSelected: {
    borderColor: Colors.brandPrimary,
    ...Shadow.medium,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: Spacing.md,
    backgroundColor: Colors.premium,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  pricingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  period: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  savingsBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl + 20,
    backgroundColor: Colors.white,
    ...Shadow.large,
  },
  purchaseButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  purchaseGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  restoreButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

export default IAPScreen;
