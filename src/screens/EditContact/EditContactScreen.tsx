/**
 * Edit Contact Details Screen
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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Spacing, BorderRadius, Shadow} from '@constants/theme';
import {ExtractedContactData, Contact} from '@types/index';

const EditContactScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {contactData, contactId, imagePath} = route.params as {
    contactData?: ExtractedContactData;
    contactId?: string;
    imagePath?: string;
  };

  const [formData, setFormData] = useState({
    firstName: contactData?.name?.value.split(' ')[0] || '',
    lastName: contactData?.name?.value.split(' ').slice(1).join(' ') || '',
    company: contactData?.company?.value || '',
    jobTitle: contactData?.title?.value || '',
    phone: contactData?.phones?.[0]?.value || '',
    email: contactData?.emails?.[0]?.value || '',
    website: contactData?.urls?.[0]?.value || '',
    notes: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSave = async () => {
    // Save contact to database
    // Navigate to contact detail
    navigation.navigate('Main' as never);
  };

  const handleCancel = () => {
    navigation.goBack();
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
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
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
                placeholder="First Name"
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
        <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
          <Text style={styles.saveButtonLargeText}>Save Contact</Text>
        </TouchableOpacity>
      </View>
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

export default EditContactScreen;
