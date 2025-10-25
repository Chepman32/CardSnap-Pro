/**
 * Edit Contact Details Screen (Updated with Real Data Saving)
 * Form for editing/reviewing extracted contact information
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';
import {ExtractedContactData} from '@types/index';
import ContactService from '@services/database/ContactService';
import {LoadingOverlay} from '@components/ui/LoadingOverlay';

const EditContactScreenUpdated: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {contactData, contactId, imagePath, thumbnailPath} = route.params as {
    contactData?: ExtractedContactData;
    contactId?: string;
    imagePath?: string;
    thumbnailPath?: string;
  };

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: contactData?.name?.value.split(' ')[0] || '',
    lastName: contactData?.name?.value.split(' ').slice(1).join(' ') || '',
    company: contactData?.company?.value || '',
    jobTitle: contactData?.title?.value || '',
    phone: contactData?.phones?.[0]?.value || '',
    email: contactData?.emails?.[0]?.value || '',
    website: contactData?.urls?.[0]?.value || '',
    address: contactData?.address?.value || '',
    notes: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (contactId) {
        // Update existing contact
        await ContactService.updateContact(contactId, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          jobTitle: formData.jobTitle,
          notes: formData.notes,
        });
      } else {
        // Create new contact from OCR data
        await ContactService.createContactFromOCR(
          {
            name: {
              value: `${formData.firstName} ${formData.lastName}`.trim(),
              confidence: 0.9,
            },
            company: formData.company
              ? {value: formData.company, confidence: 0.85}
              : undefined,
            title: formData.jobTitle
              ? {value: formData.jobTitle, confidence: 0.8}
              : undefined,
            phones: formData.phone ? [{value: formData.phone, confidence: 0.9}] : [],
            emails: formData.email ? [{value: formData.email, confidence: 0.95}] : [],
            urls: formData.website ? [{value: formData.website, confidence: 0.85}] : [],
            address: formData.address
              ? {value: formData.address, confidence: 0.75}
              : undefined,
          },
          imagePath || '',
          thumbnailPath || '',
        );
      }

      // Navigate to home screen
      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Failed to save contact:', error);
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Discard Changes?', 'Are you sure you want to discard this contact?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Discard',
        onPress: () => navigation.goBack(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Contact</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveButton, saving && styles.disabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="First Name *"
                value={formData.firstName}
                onChangeText={text => updateField('firstName', text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={text => updateField('lastName', text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="briefcase" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={formData.jobTitle}
                onChangeText={text => updateField('jobTitle', text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="office-building" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Company"
                value={formData.company}
                onChangeText={text => updateField('company', text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Methods</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phone}
                onChangeText={text => updateField('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={text => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="web" size={20} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Website"
                value={formData.website}
                onChangeText={text => updateField('website', text)}
                keyboardType="url"
                autoCapitalize="none"
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.fieldGroup}>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Icon
                name="note-text"
                size={20}
                color={Colors.gray500}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add notes about this contact..."
                value={formData.notes}
                onChangeText={text => updateField('notes', text)}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.discardButton} onPress={handleCancel}>
          <Text style={styles.discardButtonText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButtonLarge}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonLargeText}>
            {saving ? 'Saving...' : 'Save Contact'}
          </Text>
        </TouchableOpacity>
      </View>

      {saving && <LoadingOverlay message="Saving contact..." />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xl + 20,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadow.small,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.brandPrimary,
  },
  disabled: {
    opacity: 0.5,
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
  fieldGroup: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  bottomSpacing: {
    height: 100,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl + 20,
    backgroundColor: Colors.white,
    ...Shadow.medium,
  },
  discardButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButtonLarge: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
  },
  saveButtonLargeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default EditContactScreenUpdated;
