/**
 * Permission Utilities - Handle content permissions, licensing, and moderation
 */

// Content warning types
export enum ContentWarningType {
  SUGGESTIVE = 'suggestive',
  POLITICAL = 'political',
  VIOLENT = 'violent',
  NUDITY = 'nudity',
}

// Content warning levels
export enum ContentWarningLevel {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  STRONG = 'strong',
}

// Content warnings
export type ContentWarnings = {
  [ContentWarningType.SUGGESTIVE]?: boolean | ContentWarningLevel;
  [ContentWarningType.POLITICAL]?: boolean | ContentWarningLevel;
  [ContentWarningType.VIOLENT]?: boolean | ContentWarningLevel;
  [ContentWarningType.NUDITY]?: boolean | ContentWarningLevel;
};

// Dataset reuse options
export enum DatasetReuseOption {
  ALLOW = 'allow',
  DENY = 'deny',
  REQUIRE_APPROVAL = 'require_approval',
}

// GenGuard protection levels
export enum GenGuardLevel {
  NONE = 'none',
  BASIC = 'basic',
  STANDARD = 'standard',
  MAXIMUM = 'maximum',
}

// Visibility options
export enum VisibilityOption {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

// Approval types
export enum ApprovalType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

// Pricing models
export enum PricingModel {
  FREE = 'free',
  PAID_10 = 'paid10',
  PAID_20 = 'paid20',
  PAID_30 = 'paid30',
}

// Permission settings
export type PermissionSettings = {
  genGuard: boolean | GenGuardLevel;
  datasetReuse: boolean | DatasetReuseOption;
  contentWarnings: ContentWarnings;
  visibility: VisibilityOption;
  approvalType: ApprovalType;
  pricingModel: PricingModel;
};

// Default permission settings
export const DEFAULT_PERMISSIONS: PermissionSettings = {
  genGuard: false,
  datasetReuse: false,
  contentWarnings: {
    [ContentWarningType.SUGGESTIVE]: false,
    [ContentWarningType.POLITICAL]: false,
    [ContentWarningType.VIOLENT]: false,
    [ContentWarningType.NUDITY]: false,
  },
  visibility: VisibilityOption.PRIVATE,
  approvalType: ApprovalType.AUTO,
  pricingModel: PricingModel.FREE,
};

/**
 * Check if content has any warnings
 */
export const hasContentWarnings = (contentWarnings: ContentWarnings): boolean => {
  return Object.values(contentWarnings).some(value => 
    value === true || 
    (typeof value === 'string' && value !== ContentWarningLevel.NONE)
  );
};

/**
 * Get content warning level as string
 */
export const getContentWarningLevelString = (
  contentWarnings: ContentWarnings
): string => {
  if (!hasContentWarnings(contentWarnings)) {
    return 'None';
  }
  
  const warningCount = Object.values(contentWarnings).filter(value => 
    value === true || 
    (typeof value === 'string' && value !== ContentWarningLevel.NONE)
  ).length;
  
  const hasStrongWarning = Object.values(contentWarnings).some(
    value => value === ContentWarningLevel.STRONG
  );
  
  if (hasStrongWarning) {
    return 'Strong';
  }
  
  const hasModerateWarning = Object.values(contentWarnings).some(
    value => value === ContentWarningLevel.MODERATE
  );
  
  if (hasModerateWarning) {
    return 'Moderate';
  }
  
  return warningCount > 2 ? 'Moderate' : 'Mild';
};

/**
 * Check if content is suitable for the user's strictness setting
 */
export const isContentSuitableForStrictness = (
  contentWarnings: ContentWarnings,
  strictness: 'open' | 'moderate' | 'strict'
): boolean => {
  if (strictness === 'open') {
    return true;
  }
  
  if (strictness === 'strict') {
    return !hasContentWarnings(contentWarnings);
  }
  
  // For 'moderate' strictness
  const hasStrongWarning = Object.values(contentWarnings).some(
    value => value === ContentWarningLevel.STRONG
  );
  
  return !hasStrongWarning;
};

/**
 * Get GenGuard protection level as string
 */
export const getGenGuardLevelString = (
  genGuard: boolean | GenGuardLevel
): string => {
  if (genGuard === false) {
    return 'None';
  }
  
  if (genGuard === true) {
    return 'Standard';
  }
  
  return genGuard.charAt(0).toUpperCase() + genGuard.slice(1);
};

/**
 * Get dataset reuse option as string
 */
export const getDatasetReuseString = (
  datasetReuse: boolean | DatasetReuseOption
): string => {
  if (datasetReuse === false) {
    return 'Not Allowed';
  }
  
  if (datasetReuse === true) {
    return 'Allowed';
  }
  
  switch (datasetReuse) {
    case DatasetReuseOption.ALLOW:
      return 'Allowed';
    case DatasetReuseOption.DENY:
      return 'Not Allowed';
    case DatasetReuseOption.REQUIRE_APPROVAL:
      return 'Requires Approval';
    default:
      return 'Unknown';
  }
};

/**
 * Get visibility option as string
 */
export const getVisibilityString = (visibility: VisibilityOption): string => {
  switch (visibility) {
    case VisibilityOption.PUBLIC:
      return 'Public';
    case VisibilityOption.PRIVATE:
      return 'Private';
    case VisibilityOption.UNLISTED:
      return 'Unlisted';
    default:
      return 'Unknown';
  }
};

/**
 * Get approval type as string
 */
export const getApprovalTypeString = (approvalType: ApprovalType): string => {
  switch (approvalType) {
    case ApprovalType.AUTO:
      return 'Automatic';
    case ApprovalType.MANUAL:
      return 'Manual';
    default:
      return 'Unknown';
  }
};

/**
 * Get pricing model as string
 */
export const getPricingModelString = (pricingModel: PricingModel): string => {
  switch (pricingModel) {
    case PricingModel.FREE:
      return 'Free';
    case PricingModel.PAID_10:
      return '$10';
    case PricingModel.PAID_20:
      return '$20';
    case PricingModel.PAID_30:
      return '$30';
    default:
      return 'Unknown';
  }
};

/**
 * Check if a stop (content reuse approval) is required
 */
export const isStopRequired = (
  datasetReuse: boolean | DatasetReuseOption
): boolean => {
  return datasetReuse === DatasetReuseOption.REQUIRE_APPROVAL;
};

/**
 * Check if a user has permission to use content
 */
export const hasPermissionToUseContent = (
  permissions: PermissionSettings,
  userRole: 'owner' | 'admin' | 'user'
): boolean => {
  // Owners and admins always have permission
  if (userRole === 'owner' || userRole === 'admin') {
    return true;
  }
  
  // Check if content is public
  if (permissions.visibility !== VisibilityOption.PUBLIC) {
    return false;
  }
  
  // Check if content is free or user has purchased it
  // This would require additional logic to check if user has purchased
  return permissions.pricingModel === PricingModel.FREE;
};

/**
 * Filter prompt based on strictness and permissions
 */
export const filterPrompt = (
  prompt: string,
  strictness: 'open' | 'moderate' | 'strict'
): { filteredPrompt: string; wasFiltered: boolean } => {
  if (strictness === 'open') {
    return { filteredPrompt: prompt, wasFiltered: false };
  }
  
  // Define banned terms based on strictness
  const bannedTerms = strictness === 'strict' 
    ? [...STRICT_BANNED_TERMS, ...MODERATE_BANNED_TERMS]
    : MODERATE_BANNED_TERMS;
  
  let filteredPrompt = prompt;
  let wasFiltered = false;
  
  // Replace banned terms with asterisks
  bannedTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    if (regex.test(filteredPrompt)) {
      filteredPrompt = filteredPrompt.replace(regex, '*'.repeat(term.length));
      wasFiltered = true;
    }
  });
  
  return { filteredPrompt, wasFiltered };
};

// Banned terms for moderate strictness
const MODERATE_BANNED_TERMS: string[] = [
  // This would be a list of terms to filter in moderate mode
  // Placeholder for actual implementation
];

// Additional banned terms for strict strictness
const STRICT_BANNED_TERMS: string[] = [
  // This would be a list of additional terms to filter in strict mode
  // Placeholder for actual implementation
];
