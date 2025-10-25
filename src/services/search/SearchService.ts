/**
 * Search Service
 * Advanced search with fuzzy matching using Fuse.js
 */

import Fuse from 'fuse.js';
import {Contact} from '../../models';
import {database} from '../database/database';
import {Q} from '@nozbe/watermelondb';
import {SearchFilters} from '../../types';

export class SearchService {
  private contactsCollection = database.get<Contact>('contacts');

  /**
   * Search contacts with fuzzy matching
   */
  async searchContacts(query: string, filters?: SearchFilters): Promise<Contact[]> {
    // Get all contacts or filtered contacts
    let contacts = await this.getFilteredContacts(filters);

    if (!query || query.trim().length === 0) {
      return contacts;
    }

    // Prepare data for Fuse.js
    const contactData = await Promise.all(
      contacts.map(async contact => {
        const phones = await contact.getPhoneNumbers();
        const emails = await contact.getEmails();

        return {
          contact,
          searchableText: {
            fullName: contact.fullName,
            firstName: contact.firstName,
            lastName: contact.lastName,
            company: contact.company || '',
            jobTitle: contact.jobTitle || '',
            phones: phones.map((p: any) => p.value).join(' '),
            emails: emails.map((e: any) => p.value).join(' '),
            notes: contact.notes || '',
          },
        };
      }),
    );

    // Configure Fuse.js
    const fuse = new Fuse(contactData, {
      keys: [
        {name: 'searchableText.fullName', weight: 2},
        {name: 'searchableText.firstName', weight: 1.5},
        {name: 'searchableText.lastName', weight: 1.5},
        {name: 'searchableText.company', weight: 1.2},
        {name: 'searchableText.jobTitle', weight: 0.8},
        {name: 'searchableText.phones', weight: 1.0},
        {name: 'searchableText.emails', weight: 1.0},
        {name: 'searchableText.notes', weight: 0.5},
      ],
      threshold: 0.3,
      distance: 100,
      includeScore: true,
      useExtendedSearch: true,
    });

    // Perform search
    const results = fuse.search(query);

    // Return sorted results
    return results.map(result => result.item.contact);
  }

  /**
   * Get contacts with filters applied
   */
  private async getFilteredContacts(filters?: SearchFilters): Promise<Contact[]> {
    if (!filters) {
      return await this.contactsCollection.query().fetch();
    }

    const conditions: any[] = [];

    if (filters.isFavorite) {
      conditions.push(Q.where('is_favorite', true));
    }

    if (filters.companies && filters.companies.length > 0) {
      conditions.push(Q.where('company', Q.oneOf(filters.companies)));
    }

    if (filters.dateRange) {
      conditions.push(
        Q.where('created_at', Q.gte(filters.dateRange.start)),
        Q.where('created_at', Q.lte(filters.dateRange.end)),
      );
    }

    if (conditions.length === 0) {
      return await this.contactsCollection.query().fetch();
    }

    return await this.contactsCollection.query(...conditions).fetch();
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    const contacts = await this.contactsCollection
      .query(
        Q.or(
          Q.where('full_name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
          Q.where('company', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
        ),
        Q.take(limit),
      )
      .fetch();

    const suggestions: string[] = [];

    for (const contact of contacts) {
      if (contact.fullName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(contact.fullName);
      } else if (
        contact.company &&
        contact.company.toLowerCase().includes(query.toLowerCase())
      ) {
        suggestions.push(contact.company);
      }
    }

    return [...new Set(suggestions)].slice(0, limit);
  }

  /**
   * Get all unique companies
   */
  async getAllCompanies(): Promise<string[]> {
    const contacts = await this.contactsCollection.query().fetch();
    const companies = contacts
      .map(c => c.company)
      .filter((c): c is string => c !== null && c !== undefined && c.trim().length > 0);

    return [...new Set(companies)].sort();
  }

  /**
   * Save search to history
   */
  async saveSearchHistory(
    query: string,
    filters: SearchFilters | null,
    resultCount: number,
  ): Promise<void> {
    await database.write(async () => {
      await database.get('search_history').create((search: any) => {
        search.query = query;
        search.filtersJson = JSON.stringify(filters || {});
        search.resultCount = resultCount;
        search.timestamp = new Date();
      });
    });
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(limit: number = 10): Promise<any[]> {
    return await database
      .get('search_history')
      .query(Q.sortBy('timestamp', Q.desc), Q.take(limit))
      .fetch();
  }

  /**
   * Clear search history
   */
  async clearSearchHistory(): Promise<void> {
    await database.write(async () => {
      const searches = await database.get('search_history').query().fetch();
      await Promise.all(searches.map(s => s.markAsDeleted()));
    });
  }
}

export default new SearchService();
