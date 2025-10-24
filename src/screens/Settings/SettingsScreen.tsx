/**
 * Settings Screen
 * App settings and preferences
 */

import React from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [autoCapture, setAutoCapture] = React.useState(true);
  const [biometricLock, setBiometricLock] = React.useState(false);

  const SettingRow = ({
    icon,
    title,
    value,
    onPress,
    showChevron = true,
  }: {
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <Icon name={icon} size={24} color={Colors.gray600} />
      <Text style={styles.settingTitle}>{title}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showChevron && <Icon name="chevron-right" size={20} color={Colors.gray400} />}
    </TouchableOpacity>
  );

  const SettingRowWithSwitch = ({
    icon,
    title,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <Icon name={icon} size={24} color={Colors.gray600} />
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: Colors.gray300, true: Colors.brandPrimary}}
        thumbColor={Colors.white}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.brandPrimary, Colors.brandSecondary]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="card-account-details" size={64} color={Colors.white} />
          <Text style={styles.appTitle}>CardSnap Pro</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Professional Contact Management</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Premium Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingGroup}>
            <SettingRow
              icon="crown"
              title="Premium Features"
              value="Upgrade"
              onPress={() => navigation.navigate('IAP' as never)}
            />
            <SettingRow icon="receipt" title="Restore Purchases" />
          </View>
        </View>

        {/* Scanning Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanning & OCR</Text>
          <View style={styles.settingGroup}>
            <SettingRowWithSwitch
              icon="camera-timer"
              title="Auto-Capture"
              value={autoCapture}
              onValueChange={setAutoCapture}
            />
            <SettingRow icon="translate" title="OCR Language" value="English" />
            <SettingRow icon="image-filter-hdr" title="Scan Quality" value="High" />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.settingGroup}>
            <SettingRowWithSwitch
              icon="fingerprint"
              title="Biometric Lock"
              value={biometricLock}
              onValueChange={setBiometricLock}
            />
            <SettingRow icon="shield-lock" title="Privacy Policy" />
            <SettingRow icon="file-document" title="Terms of Service" />
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <View style={styles.settingGroup}>
            <SettingRow icon="database" title="Storage Used" value="42 MB" />
            <SettingRow icon="cloud-upload" title="Export All Data" />
            <SettingRow icon="cloud-download" title="Import Contacts" />
          </View>
        </View>

        {/* Support & About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.settingGroup}>
            <SettingRow icon="help-circle" title="Help & Support" />
            <SettingRow icon="star" title="Rate App" />
            <SettingRow icon="share-variant" title="Recommend to Friends" />
            <SettingRow icon="information" title="About CardSnap Pro" />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.md,
  },
  version: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.7,
    marginTop: 4,
  },
  tagline: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  settingGroup: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  settingValue: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SettingsScreen;
