/**
 * Models Index
 * Exports all database models
 */

import Contact from './Contact';
import Card from './Card';
import ContactMethod from './ContactMethod';
import Tag from './Tag';
import Collection from './Collection';

export {Contact, Card, ContactMethod, Tag, Collection};

export const models = [Contact, Card, ContactMethod, Tag, Collection];
