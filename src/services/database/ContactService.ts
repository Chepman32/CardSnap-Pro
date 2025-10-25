/**
 * Contact Service
 * CRUD operations for contacts
 */

import {database} from './database';
import {Contact, Card, ContactMethod} from '../../models';
import {Q} from '@nozbe/watermelondb';
import {ExtractedContactData} from '../../types';

export class ContactService {
  private contactsCollection = database.get<Contact>('contacts');
  private cardsCollection = database.get<Card>('cards');
  private contactMethodsCollection = database.get<ContactMethod>('contact_methods');

  async createContact(data: {
    firstName: string;
    lastName: string;
    company?: string;
    jobTitle?: string;
    notes?: string;
    source?: 'scanned' | 'manual';
  }): Promise<Contact> {
    return await database.write(async () => {
      const contact = await this.contactsCollection.create(c => {
        c.firstName = data.firstName;
        c.lastName = data.lastName;
        c.fullName = `${data.firstName} ${data.lastName}`.trim();
        c.company = data.company;
        c.jobTitle = data.jobTitle;
        c.notes = data.notes;
        c.isFavorite = false;
        c.timesViewed = 0;
        c.source = data.source || 'manual';
      });

      return contact;
    });
  }

  async createContactFromOCR(
    extractedData: ExtractedContactData,
    cardImagePath: string,
    thumbnailPath: string,
  ): Promise<Contact> {
    return await database.write(async () => {
      const nameParts = extractedData.name?.value.split(' ') || ['', ''];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Create contact
      const contact = await this.contactsCollection.create(c => {
        c.firstName = firstName;
        c.lastName = lastName;
        c.fullName = extractedData.name?.value || '';
        c.company = extractedData.company?.value;
        c.jobTitle = extractedData.title?.value;
        c.isFavorite = false;
        c.timesViewed = 0;
        c.source = 'scanned';
      });

      // Create card
      const card = await this.cardsCollection.create(c => {
        c.contact.set(contact);
        c.imagePath = cardImagePath;
        c.thumbnailPath = thumbnailPath;
        c.scannedAt = new Date();
        c.ocrProcessed = true;
        c.ocrConfidence = extractedData.name?.confidence || 0;
        c.isPrimary = true;
        c.aspectRatio = 1.75;
        c.fileSize = 0;
      });

      // Set primary card
      await contact.update(c => {
        c.primaryCardId = card.id;
      });

      // Add phone numbers
      for (const phone of extractedData.phones || []) {
        await this.contactMethodsCollection.create(cm => {
          cm.contact.set(contact);
          cm.methodType = 'phone';
          cm.label = 'mobile';
          cm.value = phone.value;
          cm.isPrimary = true;
        });
      }

      // Add emails
      for (const email of extractedData.emails || []) {
        await this.contactMethodsCollection.create(cm => {
          cm.contact.set(contact);
          cm.methodType = 'email';
          cm.label = 'work';
          cm.value = email.value;
          cm.isPrimary = true;
        });
      }

      // Add URLs
      for (const url of extractedData.urls || []) {
        await this.contactMethodsCollection.create(cm => {
          cm.contact.set(contact);
          cm.methodType = 'url';
          cm.label = 'website';
          cm.value = url.value;
          cm.isPrimary = true;
        });
      }

      // Add address
      if (extractedData.address) {
        await this.contactMethodsCollection.create(cm => {
          cm.contact.set(contact);
          cm.methodType = 'address';
          cm.label = 'work';
          cm.value = extractedData.address.value;
          cm.isPrimary = true;
        });
      }

      return contact;
    });
  }

  async updateContact(
    contactId: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      company: string;
      jobTitle: string;
      notes: string;
    }>,
  ): Promise<Contact> {
    const contact = await this.contactsCollection.find(contactId);

    return await database.write(async () => {
      await contact.update(c => {
        if (data.firstName !== undefined) c.firstName = data.firstName;
        if (data.lastName !== undefined) c.lastName = data.lastName;
        if (data.firstName !== undefined || data.lastName !== undefined) {
          c.fullName = `${c.firstName} ${c.lastName}`.trim();
        }
        if (data.company !== undefined) c.company = data.company;
        if (data.jobTitle !== undefined) c.jobTitle = data.jobTitle;
        if (data.notes !== undefined) c.notes = data.notes;
      });
      return contact;
    });
  }

  async deleteContact(contactId: string): Promise<void> {
    const contact = await this.contactsCollection.find(contactId);
    await database.write(async () => {
      // Delete all related data
      const cards = await contact.cards.fetch();
      const contactMethods = await contact.contactMethods.fetch();
      const contactTags = await contact.contactTags.fetch();

      await Promise.all([
        ...cards.map((card: Card) => card.markAsDeleted()),
        ...contactMethods.map((cm: ContactMethod) => cm.markAsDeleted()),
        ...contactTags.map((ct: any) => ct.markAsDeleted()),
      ]);

      // Delete contact
      await contact.markAsDeleted();
    });
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.contactsCollection.query().fetch();
  }

  async getFavoriteContacts(): Promise<Contact[]> {
    return await this.contactsCollection
      .query(Q.where('is_favorite', true))
      .fetch();
  }

  async getRecentContacts(limit: number = 20): Promise<Contact[]> {
    return await this.contactsCollection
      .query(Q.sortBy('created_at', Q.desc), Q.take(limit))
      .fetch();
  }

  async searchContacts(query: string): Promise<Contact[]> {
    return await this.contactsCollection
      .query(
        Q.or(
          Q.where('full_name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
          Q.where('company', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
        ),
      )
      .fetch();
  }

  async toggleFavorite(contactId: string): Promise<Contact> {
    const contact = await this.contactsCollection.find(contactId);
    await contact.toggleFavorite();
    return contact;
  }

  async incrementViewCount(contactId: string): Promise<void> {
    const contact = await this.contactsCollection.find(contactId);
    await contact.incrementViewCount();
  }

  async getContactWithDetails(contactId: string) {
    const contact = await this.contactsCollection.find(contactId);
    const cards = await contact.cards.fetch();
    const phones = await contact.getPhoneNumbers();
    const emails = await contact.getEmails();
    const tags = await contact.getTags();

    return {
      contact,
      cards,
      phones,
      emails,
      tags,
    };
  }
}

export default new ContactService();
