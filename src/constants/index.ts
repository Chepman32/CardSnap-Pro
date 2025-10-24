/**
 * MindWeave Constants
 */

export const APP_CONFIG = {
  APP_NAME: 'MindWeave',
  TAGLINE: 'Weave Your Thoughts Into Clarity',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
};

export const LIMITS = {
  FREE_MIND_MAP_LIMIT: 10,
  MAX_NODES_PER_MAP: 1000,
  SOFT_NODE_LIMIT: 500,
  MAX_NODE_TEXT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 60,
  MAX_THEME_NAME_LENGTH: 30,
  MAX_FILE_SIZE_MB: 10,
  UNDO_HISTORY_LIMIT: 50,
};

export const TIMING = {
  SPLASH_DURATION: 3800,
  AUTO_SAVE_DEBOUNCE: 3000,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_MEDIUM: 400,
  ANIMATION_DURATION_LONG: 800,
  DOUBLE_TAP_DELAY: 300,
  LONG_PRESS_DURATION: 500,
};

export const GESTURES = {
  PAN_THRESHOLD: 10,
  SWIPE_VELOCITY_THRESHOLD: 500,
  ZOOM_MIN: 0.25,
  ZOOM_MAX: 3.0,
  SNAP_TO_ANGLE_THRESHOLD: 5,
};

export const CANVAS = {
  VIRTUAL_WIDTH: 10000,
  VIRTUAL_HEIGHT: 10000,
  RENDER_BUFFER: 200,
  GRID_SIZE_MIN: 10,
  GRID_SIZE_MAX: 50,
};

export const NODE_CONFIG = {
  MIN_WIDTH: 80,
  MIN_HEIGHT: 40,
  MAX_WIDTH: 400,
  MAX_HEIGHT: 300,
  PADDING_VERTICAL: 12,
  PADDING_HORIZONTAL: 16,
  ICON_SIZE: 24,
  BADGE_SIZE: 20,
  DEFAULT_BORDER_WIDTH: 1,
  DEFAULT_BORDER_RADIUS: 12,
};

export const CONNECTION_CONFIG = {
  DEFAULT_WIDTH: 2,
  MIN_WIDTH: 1,
  MAX_WIDTH: 8,
  STYLES: ['straight', 'curved', 'stepped', 'organic'] as const,
  ARROW_TYPES: ['none', 'end', 'both', 'start'] as const,
};

export const PREMIUM_FEATURES = {
  UNLIMITED_MAPS: 'unlimited_maps',
  CLOUD_SYNC: 'cloud_sync',
  ADVANCED_EXPORT: 'advanced_export',
  CUSTOM_TEMPLATES: 'custom_templates',
  COLLABORATION: 'collaboration',
  VOICE_NOTES: 'voice_notes',
  DRAWING_TOOLS: 'drawing_tools',
  FILE_ATTACHMENTS: 'file_attachments',
  PREMIUM_THEMES: 'premium_themes',
  CUSTOM_ICONS: 'custom_icons',
  PRIORITY_SUPPORT: 'priority_support',
};

export const IAP_PRODUCTS = {
  MONTHLY: 'com.mindweave.premium.monthly',
  ANNUAL: 'com.mindweave.premium.annual',
  LIFETIME: 'com.mindweave.premium.lifetime',
};

export const STORAGE_KEYS = {
  THEME_MODE: '@mindweave:theme_mode',
  ONBOARDING_COMPLETED: '@mindweave:onboarding_completed',
  PREMIUM_STATUS: '@mindweave:premium_status',
  USER_PREFERENCES: '@mindweave:user_preferences',
  MIND_MAPS: '@mindweave:mind_maps',
  LAST_OPENED_MAP: '@mindweave:last_opened_map',
  ANALYTICS_CONSENT: '@mindweave:analytics_consent',
};

export const ANIMATION_PRESETS = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springGentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 1,
  },
};

export const LAYOUT_TYPES = {
  TREE: 'tree',
  MINDMAP: 'mindmap',
  RADIAL: 'radial',
  ORG_CHART: 'org_chart',
  FORCE_DIRECTED: 'force_directed',
  COMPACT: 'compact',
} as const;

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];
export type ConnectionStyle = typeof CONNECTION_CONFIG.STYLES[number];
export type ArrowType = typeof CONNECTION_CONFIG.ARROW_TYPES[number];
