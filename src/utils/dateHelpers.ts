/**
 * Date Helper Utilities
 * Functions for date formatting and manipulation
 */

import {format, formatDistanceToNow, differenceInDays} from 'date-fns';

export const formatDate = (timestamp: number, formatString = 'MMM dd, yyyy'): string => {
  return format(new Date(timestamp), formatString);
};

export const formatDateTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'MMM dd, yyyy h:mm a');
};

export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), {addSuffix: true});
};

export const isToday = (timestamp: number): boolean => {
  const today = new Date();
  const date = new Date(timestamp);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (timestamp: number): boolean => {
  const diff = differenceInDays(new Date(), new Date(timestamp));
  return diff === 1;
};

export const getTimeAgo = (timestamp: number): string => {
  if (isToday(timestamp)) {
    return 'Today';
  }
  if (isYesterday(timestamp)) {
    return 'Yesterday';
  }
  const diff = differenceInDays(new Date(), new Date(timestamp));
  if (diff < 7) {
    return `${diff} days ago`;
  }
  return formatDate(timestamp);
};
