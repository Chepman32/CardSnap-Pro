/**
 * Services Index
 * Exports all services for easy importing
 */

// Database
export {database} from './database/database';
export {default as ContactService} from './database/ContactService';

// OCR
export {default as OCRService} from './ocr/OCRService';

// Image
export {default as ImageService} from './image/ImageService';

// Export
export {default as ExportService} from './export/ExportService';

// Search
export {default as SearchService} from './search/SearchService';

// Duplicate Detection
export {default as DuplicateDetectionService} from './duplicate/DuplicateDetectionService';
