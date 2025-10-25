/**
 * Collection Model
 * Represents a collection of contacts
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, children} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Collection extends Model {
  static table = 'collections';
  static associations: Associations = {
    collection_contacts: {type: 'has_many', foreignKey: 'collection_id'},
  };

  @field('name') name!: string;
  @field('description') description?: string;
  @field('cover_style') coverStyle!: 'mosaic' | 'single' | 'gradient';
  @field('color') color!: string;
  @field('is_auto') isAuto!: boolean;
  @field('sort_order') sortOrder!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('collection_contacts') collectionContacts!: any;

  async getContacts() {
    const collectionContacts = await this.collectionContacts.fetch();
    return Promise.all(collectionContacts.map((cc: any) => cc.contact));
  }

  async getContactCount(): Promise<number> {
    return await this.collectionContacts.fetchCount();
  }

  async addContact(contactId: string, position?: number) {
    const count = await this.getContactCount();

    await this.database.write(async () => {
      await this.collections.get('collection_contacts').create((cc: any) => {
        cc.collection.set(this);
        cc.contact.id = contactId;
        cc.position = position ?? count;
        cc.addedAt = new Date();
      });
    });
  }

  async removeContact(contactId: string) {
    await this.database.write(async () => {
      const cc = await this.collectionContacts
        .extend((query: any) => query.where('contact_id', contactId))
        .fetch();
      if (cc.length > 0) {
        await cc[0].markAsDeleted();
      }
    });
  }
}
