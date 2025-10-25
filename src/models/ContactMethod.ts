/**
 * ContactMethod Model
 * Represents phone, email, URL, or address for a contact
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, relation, immutableRelation} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import Contact from './Contact';

export default class ContactMethod extends Model {
  static table = 'contact_methods';
  static associations: Associations = {
    contacts: {type: 'belongs_to', key: 'contact_id'},
  };

  @field('contact_id') contactId!: string;
  @field('method_type') methodType!: 'phone' | 'email' | 'url' | 'address';
  @field('label') label!: string;
  @field('value') value!: string;
  @field('is_primary') isPrimary!: boolean;
  @date('created_at') createdAt!: Date;

  @immutableRelation('contacts', 'contact_id') contact!: Contact;

  async setAsPrimary() {
    const contact = await this.contact.fetch();

    await this.database.write(async () => {
      // Unset other primary methods of same type
      const otherMethods = await contact.contactMethods
        .extend((query: any) => query.where('method_type', this.methodType))
        .fetch();

      await Promise.all(
        otherMethods.map((method: ContactMethod) =>
          method.update(m => {
            m.isPrimary = false;
          })
        )
      );

      // Set this as primary
      await this.update(method => {
        method.isPrimary = true;
      });
    });
  }
}
