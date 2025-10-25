/**
 * Card Model
 * Represents a scanned business card
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, relation, immutableRelation} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import Contact from './Contact';

export default class Card extends Model {
  static table = 'cards';
  static associations: Associations = {
    contacts: {type: 'belongs_to', key: 'contact_id'},
  };

  @field('contact_id') contactId!: string;
  @field('image_path') imagePath!: string;
  @field('thumbnail_path') thumbnailPath!: string;
  @date('scanned_at') scannedAt!: Date;
  @field('ocr_processed') ocrProcessed!: boolean;
  @field('ocr_confidence') ocrConfidence!: number;
  @field('is_primary') isPrimary!: boolean;
  @field('aspect_ratio') aspectRatio!: number;
  @field('file_size') fileSize!: number;

  @immutableRelation('contacts', 'contact_id') contact!: Contact;

  async setAsPrimary() {
    const contact = await this.contact.fetch();

    await this.database.write(async () => {
      // Unset other primary cards
      const otherCards = await contact.cards.fetch();
      await Promise.all(
        otherCards.map((card: Card) =>
          card.update(c => {
            c.isPrimary = false;
          })
        )
      );

      // Set this as primary
      await this.update(card => {
        card.isPrimary = true;
      });

      // Update contact's primary card reference
      await contact.update(c => {
        c.primaryCardId = this.id;
      });
    });
  }
}
