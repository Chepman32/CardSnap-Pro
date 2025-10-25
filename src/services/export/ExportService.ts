/**
 * Export Service
 * Export contacts to various formats
 */

import {Contact} from '../../models';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export class ExportService {
  /**
   * Export contact as vCard (.vcf)
   */
  async exportAsVCard(contact: Contact): Promise<string> {
    const phones = await contact.getPhoneNumbers();
    const emails = await contact.getEmails();

    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `FN:${contact.fullName}\n`;
    vcard += `N:${contact.lastName};${contact.firstName};;;\n`;

    if (contact.company) {
      vcard += `ORG:${contact.company}\n`;
    }

    if (contact.jobTitle) {
      vcard += `TITLE:${contact.jobTitle}\n`;
    }

    for (const phone of phones) {
      const type = (phone as any).label.toUpperCase();
      vcard += `TEL;TYPE=${type}:${(phone as any).value}\n`;
    }

    for (const email of emails) {
      const type = (email as any).label.toUpperCase();
      vcard += `EMAIL;TYPE=${type}:${(email as any).value}\n`;
    }

    if (contact.notes) {
      vcard += `NOTE:${contact.notes.replace(/\n/g, '\\n')}\n`;
    }

    vcard += 'END:VCARD\n';

    return vcard;
  }

  /**
   * Export multiple contacts as vCard bundle
   */
  async exportAsVCardBundle(contacts: Contact[]): Promise<string> {
    const vcards = await Promise.all(contacts.map(c => this.exportAsVCard(c)));
    return vcards.join('\n');
  }

  /**
   * Export contacts as CSV
   */
  async exportAsCSV(contacts: Contact[]): Promise<string> {
    const headers = [
      'First Name',
      'Last Name',
      'Company',
      'Job Title',
      'Email',
      'Phone',
      'Notes',
    ];

    let csv = headers.join(',') + '\n';

    for (const contact of contacts) {
      const phones = await contact.getPhoneNumbers();
      const emails = await contact.getEmails();

      const row = [
        this.escapeCSV(contact.firstName),
        this.escapeCSV(contact.lastName),
        this.escapeCSV(contact.company || ''),
        this.escapeCSV(contact.jobTitle || ''),
        this.escapeCSV(emails.length > 0 ? (emails[0] as any).value : ''),
        this.escapeCSV(phones.length > 0 ? (phones[0] as any).value : ''),
        this.escapeCSV(contact.notes || ''),
      ];

      csv += row.join(',') + '\n';
    }

    return csv;
  }

  /**
   * Export contacts as JSON
   */
  async exportAsJSON(contacts: Contact[]): Promise<string> {
    const data = await Promise.all(
      contacts.map(async contact => {
        const phones = await contact.getPhoneNumbers();
        const emails = await contact.getEmails();
        const tags = await contact.getTags();

        return {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          fullName: contact.fullName,
          company: contact.company,
          jobTitle: contact.jobTitle,
          phones: phones.map((p: any) => ({
            label: p.label,
            value: p.value,
          })),
          emails: emails.map((e: any) => ({
            label: e.label,
            value: e.value,
          })),
          notes: contact.notes,
          isFavorite: contact.isFavorite,
          tags: tags.map((t: any) => t.name),
          createdAt: contact.createdAt.toISOString(),
          updatedAt: contact.updatedAt.toISOString(),
        };
      }),
    );

    return JSON.stringify(data, null, 2);
  }

  /**
   * Save export to file and share
   */
  async saveAndShare(
    content: string,
    filename: string,
    mimeType: string,
  ): Promise<void> {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/CardSnapPro/exports/${filename}`;

      // Ensure directory exists
      await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/CardSnapPro/exports`);

      // Write file
      await RNFS.writeFile(filePath, content, 'utf8');

      // Share
      await Share.open({
        title: 'Export Contacts',
        url: `file://${filePath}`,
        type: mimeType,
        failOnCancel: false,
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.error('Export failed:', error);
        throw error;
      }
    }
  }

  /**
   * Export and share contacts as vCard
   */
  async exportAndShareVCard(contacts: Contact[]): Promise<void> {
    const vcard =
      contacts.length === 1
        ? await this.exportAsVCard(contacts[0])
        : await this.exportAsVCardBundle(contacts);

    const filename =
      contacts.length === 1
        ? `${contacts[0].fullName.replace(/\s+/g, '_')}.vcf`
        : 'contacts_export.vcf';

    await this.saveAndShare(vcard, filename, 'text/vcard');
  }

  /**
   * Export and share contacts as CSV
   */
  async exportAndShareCSV(contacts: Contact[]): Promise<void> {
    const csv = await this.exportAsCSV(contacts);
    await this.saveAndShare(csv, 'contacts_export.csv', 'text/csv');
  }

  /**
   * Export and share contacts as JSON
   */
  async exportAndShareJSON(contacts: Contact[]): Promise<void> {
    const json = await this.exportAsJSON(contacts);
    await this.saveAndShare(json, 'contacts_export.json', 'application/json');
  }

  /**
   * Generate QR code data for contact
   */
  async generateQRData(contact: Contact): Promise<string> {
    // Generate vCard format for QR code
    return await this.exportAsVCard(contact);
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export default new ExportService();
