/**
 * Contact Model
 * Represents a contact in the database
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, children, relation} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Contact extends Model {
  static table = 'contacts';
  static associations: Associations = {
    cards: {type: 'has_many', foreignKey: 'contact_id'},
    contact_methods: {type: 'has_many', foreignKey: 'contact_id'},
    contact_tags: {type: 'has_many', foreignKey: 'contact_id'},
    reminders: {type: 'has_many', foreignKey: 'contact_id'},
    meetings: {type: 'has_many', foreignKey: 'contact_id'},
  };

  @field('first_name') firstName!: string;
  @field('last_name') lastName!: string;
  @field('full_name') fullName!: string;
  @field('company') company?: string;
  @field('job_title') jobTitle?: string;
  @field('notes') notes?: string;
  @field('is_favorite') isFavorite!: boolean;
  @field('times_viewed') timesViewed!: number;
  @date('last_viewed_at') lastViewedAt?: Date;
  @field('avatar_path') avatarPath?: string;
  @field('primary_card_id') primaryCardId?: string;
  @field('source') source!: 'scanned' | 'manual';
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('cards') cards!: any;
  @children('contact_methods') contactMethods!: any;
  @children('contact_tags') contactTags!: any;
  @children('reminders') reminders!: any;
  @children('meetings') meetings!: any;

  async incrementViewCount() {
    await this.update(contact => {
      contact.timesViewed = contact.timesViewed + 1;
      contact.lastViewedAt = new Date();
    });
  }

  async toggleFavorite() {
    await this.update(contact => {
      contact.isFavorite = !contact.isFavorite;
    });
  }

  async getPrimaryCard() {
    if (!this.primaryCardId) return null;
    return await this.collections.get('cards').find(this.primaryCardId);
  }

  async getPhoneNumbers() {
    return await this.contactMethods.extend(
      where('method_type', 'phone')
    ).fetch();
  }

  async getEmails() {
    return await this.contactMethods.extend(
      where('method_type', 'email')
    ).fetch();
  }

  async getTags() {
    const contactTags = await this.contactTags.fetch();
    return Promise.all(contactTags.map((ct: any) => ct.tag));
  }
}

function where(field: string, value: any) {
  return (query: any) => query.where(field, value);
}
