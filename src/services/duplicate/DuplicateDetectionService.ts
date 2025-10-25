/**
 * Duplicate Detection Service
 * Detect and handle duplicate contacts
 */

import {Contact} from '../../models';
import {database} from '../database/database';
import {DuplicateMatch} from '../../types';

export class DuplicateDetectionService {
  private contactsCollection = database.get<Contact>('contacts');

  /**
   * Find potential duplicates for a contact
   */
  async findDuplicates(contactData: {
    fullName: string;
    email?: string;
    phone?: string;
    company?: string;
  }): Promise<DuplicateMatch[]> {
    const allContacts = await this.contactsCollection.query().fetch();
    const matches: DuplicateMatch[] = [];

    for (const existingContact of allContacts) {
      const score = await this.calculateSimilarityScore(contactData, existingContact);

      if (score >= 0.7) {
        // 70% similarity threshold
        const matchingFields = await this.getMatchingFields(
          contactData,
          existingContact,
        );
        const differingFields = await this.getDifferingFields(
          contactData,
          existingContact,
        );

        matches.push({
          existingContact,
          newContact: contactData,
          matchScore: score,
          matchingFields,
          differingFields,
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate similarity score between two contacts
   */
  private async calculateSimilarityScore(
    newData: {
      fullName: string;
      email?: string;
      phone?: string;
      company?: string;
    },
    existingContact: Contact,
  ): Promise<number> {
    let totalScore = 0;
    let totalWeight = 0;

    // Name similarity (weight: 40%)
    const nameScore = this.stringSimilarity(
      newData.fullName.toLowerCase(),
      existingContact.fullName.toLowerCase(),
    );
    totalScore += nameScore * 0.4;
    totalWeight += 0.4;

    // Email exact match (weight: 30%)
    if (newData.email) {
      const emails = await existingContact.getEmails();
      const emailMatch = emails.some(
        (e: any) => e.value.toLowerCase() === newData.email?.toLowerCase(),
      );
      totalScore += (emailMatch ? 1.0 : 0.0) * 0.3;
      totalWeight += 0.3;
    }

    // Phone similarity (weight: 20%)
    if (newData.phone) {
      const phones = await existingContact.getPhoneNumbers();
      const phoneMatch = phones.some((p: any) => this.phonesMatch(p.value, newData.phone!));
      totalScore += (phoneMatch ? 1.0 : 0.0) * 0.2;
      totalWeight += 0.2;
    }

    // Company similarity (weight: 10%)
    if (newData.company && existingContact.company) {
      const companyScore = this.stringSimilarity(
        newData.company.toLowerCase(),
        existingContact.company.toLowerCase(),
      );
      totalScore += companyScore * 0.1;
      totalWeight += 0.1;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private stringSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1.0 : 1.0 - distance / maxLength;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Check if two phone numbers match
   */
  private phonesMatch(phone1: string, phone2: string): boolean {
    const clean1 = phone1.replace(/\D/g, '');
    const clean2 = phone2.replace(/\D/g, '');

    // Compare last 10 digits
    return clean1.slice(-10) === clean2.slice(-10);
  }

  /**
   * Get matching fields between contacts
   */
  private async getMatchingFields(
    newData: any,
    existingContact: Contact,
  ): Promise<string[]> {
    const matching: string[] = [];

    if (this.stringSimilarity(newData.fullName, existingContact.fullName) > 0.8) {
      matching.push('name');
    }

    if (newData.email) {
      const emails = await existingContact.getEmails();
      if (emails.some((e: any) => e.value.toLowerCase() === newData.email.toLowerCase())) {
        matching.push('email');
      }
    }

    if (newData.phone) {
      const phones = await existingContact.getPhoneNumbers();
      if (phones.some((p: any) => this.phonesMatch(p.value, newData.phone))) {
        matching.push('phone');
      }
    }

    if (
      newData.company &&
      existingContact.company &&
      this.stringSimilarity(newData.company, existingContact.company) > 0.8
    ) {
      matching.push('company');
    }

    return matching;
  }

  /**
   * Get differing fields between contacts
   */
  private async getDifferingFields(
    newData: any,
    existingContact: Contact,
  ): Promise<string[]> {
    const differing: string[] = [];

    if (this.stringSimilarity(newData.fullName, existingContact.fullName) <= 0.8) {
      differing.push('name');
    }

    if (newData.jobTitle && newData.jobTitle !== existingContact.jobTitle) {
      differing.push('jobTitle');
    }

    return differing;
  }

  /**
   * Merge two contacts
   */
  async mergeContacts(
    keepContactId: string,
    mergeContactId: string,
    options: {
      keepAllPhones?: boolean;
      keepAllEmails?: boolean;
      combineNotes?: boolean;
      keepBothCards?: boolean;
    } = {},
  ): Promise<Contact> {
    const keepContact = await this.contactsCollection.find(keepContactId);
    const mergeContact = await this.contactsCollection.find(mergeContactId);

    await database.write(async () => {
      // Merge contact methods
      if (options.keepAllPhones) {
        const mergePhones = await mergeContact.getPhoneNumbers();
        for (const phone of mergePhones) {
          await (phone as any).update((p: any) => {
            p.contact.set(keepContact);
          });
        }
      }

      if (options.keepAllEmails) {
        const mergeEmails = await mergeContact.getEmails();
        for (const email of mergeEmails) {
          await (email as any).update((e: any) => {
            e.contact.set(keepContact);
          });
        }
      }

      // Combine notes
      if (options.combineNotes && mergeContact.notes) {
        await keepContact.update(c => {
          c.notes = c.notes
            ? `${c.notes}\n\n--- Merged from another contact ---\n${mergeContact.notes}`
            : mergeContact.notes;
        });
      }

      // Move cards
      if (options.keepBothCards) {
        const mergeCards = await mergeContact.cards.fetch();
        for (const card of mergeCards) {
          await card.update(c => {
            c.contact.set(keepContact);
            c.isPrimary = false;
          });
        }
      }

      // Delete merged contact
      await mergeContact.markAsDeleted();
    });

    return keepContact;
  }
}

export default new DuplicateDetectionService();
