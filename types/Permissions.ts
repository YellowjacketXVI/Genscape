/**
 * Permission Types
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
export interface ContentWarnings {
  [ContentWarningType.SUGGESTIVE]?: boolean | ContentWarningLevel;
  [ContentWarningType.POLITICAL]?: boolean | ContentWarningLevel;
  [ContentWarningType.VIOLENT]?: boolean | ContentWarningLevel;
  [ContentWarningType.NUDITY]?: boolean | ContentWarningLevel;
}

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
export interface PermissionSettings {
  genGuard: boolean | GenGuardLevel;
  datasetReuse: boolean | DatasetReuseOption;
  contentWarnings: ContentWarnings;
  visibility: VisibilityOption;
  approvalType: ApprovalType;
  pricingModel: PricingModel;
}

// Stop (content reuse approval) status
export enum StopStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Stop (content reuse approval) request
export interface StopRequest {
  id: string;
  mediaId: string;
  requesterId: string;
  ownerId: string;
  status: StopStatus;
  requestDate: string;
  responseDate?: string;
  useCase: string;
}
