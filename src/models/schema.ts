/**
 * WatermelonDB Schema Definition
 * Defines the database structure for all tables
 */

import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'contacts',
      columns: [
        {name: 'first_name', type: 'string'},
        {name: 'last_name', type: 'string'},
        {name: 'full_name', type: 'string', isIndexed: true},
        {name: 'company', type: 'string', isIndexed: true, isOptional: true},
        {name: 'job_title', type: 'string', isOptional: true},
        {name: 'notes', type: 'string', isOptional: true},
        {name: 'is_favorite', type: 'boolean'},
        {name: 'times_viewed', type: 'number'},
        {name: 'last_viewed_at', type: 'number', isOptional: true},
        {name: 'avatar_path', type: 'string', isOptional: true},
        {name: 'primary_card_id', type: 'string', isOptional: true},
        {name: 'source', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'cards',
      columns: [
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'image_path', type: 'string'},
        {name: 'thumbnail_path', type: 'string'},
        {name: 'scanned_at', type: 'number'},
        {name: 'ocr_processed', type: 'boolean'},
        {name: 'ocr_confidence', type: 'number'},
        {name: 'is_primary', type: 'boolean'},
        {name: 'aspect_ratio', type: 'number'},
        {name: 'file_size', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'contact_methods',
      columns: [
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'method_type', type: 'string'},
        {name: 'label', type: 'string'},
        {name: 'value', type: 'string', isIndexed: true},
        {name: 'is_primary', type: 'boolean'},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'tags',
      columns: [
        {name: 'name', type: 'string', isIndexed: true},
        {name: 'color', type: 'string'},
        {name: 'icon', type: 'string', isOptional: true},
        {name: 'usage_count', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'contact_tags',
      columns: [
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'tag_id', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'collections',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'cover_style', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'is_auto', type: 'boolean'},
        {name: 'sort_order', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'collection_contacts',
      columns: [
        {name: 'collection_id', type: 'string', isIndexed: true},
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'position', type: 'number'},
        {name: 'added_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'reminders',
      columns: [
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'reminder_date', type: 'number'},
        {name: 'message', type: 'string'},
        {name: 'is_completed', type: 'boolean'},
        {name: 'completed_at', type: 'number', isOptional: true},
        {name: 'notification_id', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'meetings',
      columns: [
        {name: 'contact_id', type: 'string', isIndexed: true},
        {name: 'meeting_date', type: 'number'},
        {name: 'title', type: 'string'},
        {name: 'notes', type: 'string', isOptional: true},
        {name: 'calendar_event_id', type: 'string', isOptional: true},
        {name: 'location', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'search_history',
      columns: [
        {name: 'query', type: 'string'},
        {name: 'filters_json', type: 'string'},
        {name: 'result_count', type: 'number'},
        {name: 'timestamp', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'app_settings',
      columns: [
        {name: 'key', type: 'string', isIndexed: true},
        {name: 'value', type: 'string'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
  ],
});
