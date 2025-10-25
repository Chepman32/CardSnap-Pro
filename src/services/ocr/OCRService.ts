/**
 * OCR Service
 * Text recognition and extraction from business cards
 */

import TextRecognition from 'react-native-text-recognition';
import {ExtractedContactData, OCRResult, FieldExtraction} from '../../types';

export class OCRService {
  /**
   * Process image and extract text
   */
  async processImage(imagePath: string): Promise<OCRResult> {
    try {
      const result = await TextRecognition.recognize(imagePath);

      return {
        text: result.map(block => block.text).join('\n'),
        confidence: this.calculateAverageConfidence(result),
        blocks: result.map(block => ({
          text: block.text,
          confidence: 1.0, // TextRecognition doesn't provide confidence
          boundingBox: {
            x: block.bounding.left,
            y: block.bounding.top,
            width: block.bounding.width,
            height: block.bounding.height,
          },
          type: 'unknown',
        })),
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  /**
   * Extract contact information from OCR result
   */
  extractContactData(ocrResult: OCRResult): ExtractedContactData {
    const lines = ocrResult.text.split('\n').filter(line => line.trim());

    return {
      name: this.extractName(lines),
      company: this.extractCompany(lines),
      title: this.extractTitle(lines),
      phones: this.extractPhones(lines),
      emails: this.extractEmails(lines),
      urls: this.extractUrls(lines),
      address: this.extractAddress(lines),
    };
  }

  private calculateAverageConfidence(blocks: any[]): number {
    if (blocks.length === 0) return 0;
    // Since TextRecognition doesn't provide confidence, return a default
    return 0.85;
  }

  private extractName(lines: string[]): FieldExtraction | undefined {
    // Usually the first or largest text is the name
    if (lines.length === 0) return undefined;

    // Try to find name patterns
    const namePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+/;
    for (const line of lines.slice(0, 3)) {
      if (namePattern.test(line)) {
        return {
          value: line,
          confidence: 0.9,
        };
      }
    }

    // Fallback to first line
    return {
      value: lines[0],
      confidence: 0.7,
    };
  }

  private extractCompany(lines: string[]): FieldExtraction | undefined {
    const companyKeywords = ['inc', 'llc', 'ltd', 'corp', 'corporation', 'company', 'group'];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (companyKeywords.some(keyword => lowerLine.includes(keyword))) {
        return {
          value: line,
          confidence: 0.85,
        };
      }
    }

    return undefined;
  }

  private extractTitle(lines: string[]): FieldExtraction | undefined {
    const titleKeywords = [
      'director',
      'manager',
      'ceo',
      'cto',
      'cfo',
      'president',
      'vp',
      'vice president',
      'engineer',
      'developer',
      'designer',
      'analyst',
      'consultant',
      'specialist',
    ];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (titleKeywords.some(keyword => lowerLine.includes(keyword))) {
        return {
          value: line,
          confidence: 0.8,
        };
      }
    }

    return undefined;
  }

  private extractPhones(lines: string[]): FieldExtraction[] {
    const phones: FieldExtraction[] = [];
    const phonePattern = /(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g;

    for (const line of lines) {
      const matches = line.match(phonePattern);
      if (matches) {
        matches.forEach(match => {
          phones.push({
            value: this.normalizePhone(match),
            confidence: 0.95,
          });
        });
      }
    }

    return phones;
  }

  private extractEmails(lines: string[]): FieldExtraction[] {
    const emails: FieldExtraction[] = [];
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    for (const line of lines) {
      const matches = line.match(emailPattern);
      if (matches) {
        matches.forEach(match => {
          emails.push({
            value: match.toLowerCase(),
            confidence: 0.95,
          });
        });
      }
    }

    return emails;
  }

  private extractUrls(lines: string[]): FieldExtraction[] {
    const urls: FieldExtraction[] = [];
    const urlPattern = /(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/g;

    for (const line of lines) {
      const matches = line.match(urlPattern);
      if (matches) {
        matches.forEach(match => {
          // Filter out emails
          if (!match.includes('@')) {
            urls.push({
              value: match.startsWith('http') ? match : `https://${match}`,
              confidence: 0.85,
            });
          }
        });
      }
    }

    return urls;
  }

  private extractAddress(lines: string[]): FieldExtraction | undefined {
    // Look for address patterns (street, city, state, zip)
    const addressPattern = /\d+\s+[A-Za-z\s]+,?\s+[A-Za-z\s]+,?\s+[A-Z]{2}\s+\d{5}/;

    for (const line of lines) {
      if (addressPattern.test(line)) {
        return {
          value: line,
          confidence: 0.75,
        };
      }
    }

    // Look for multi-line addresses
    for (let i = 0; i < lines.length - 1; i++) {
      const combined = `${lines[i]} ${lines[i + 1]}`;
      if (addressPattern.test(combined)) {
        return {
          value: combined,
          confidence: 0.7,
        };
      }
    }

    return undefined;
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return phone;
  }

  /**
   * Complete OCR pipeline: process image and extract data
   */
  async processCard(imagePath: string): Promise<ExtractedContactData> {
    const ocrResult = await this.processImage(imagePath);
    return this.extractContactData(ocrResult);
  }
}

export default new OCRService();
