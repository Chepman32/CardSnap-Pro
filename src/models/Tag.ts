/**
 * Tag Model
 * Represents a tag for organizing contacts
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, children} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Tag extends Model {
  static table = 'tags';
  static associations: Associations = {
    contact_tags: {type: 'has_many', foreignKey: 'tag_id'},
  };

  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon?: string;
  @field('usage_count') usageCount!: number;
  @readonly @date('created_at') createdAt!: Date;

  @children('contact_tags') contactTags!: any;

  async incrementUsage() {
    await this.update(tag => {
      tag.usageCount = tag.usageCount + 1;
    });
  }

  async decrementUsage() {
    await this.update(tag => {
      tag.usageCount = Math.max(0, tag.usageCount - 1);
    });
  }

  async getContacts() {
    const contactTags = await this.contactTags.fetch();
    return Promise.all(contactTags.map((ct: any) => ct.contact));
  }
}
