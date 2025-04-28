export interface PermissionDefinition {
  resource: string;
  action: string;
  subResource?: string;
  description: string;
  category?: string;
  isSystem?: boolean;
  implications?: string[];
}
