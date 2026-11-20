/**
 * IrRbacGrant — Database-backed role permission grant for a model.
 *
 * Replaces the hardcoded grant registry in rbac-evaluator.ts so permission
 * changes can be managed through data without code deploys.
 */
export interface IrRbacGrant {
  id: number
  model: string
  role_id: number
  perm_read: boolean
  perm_write: boolean
  perm_create: boolean
  perm_unlink: boolean
  created_at: Date
  updated_at: Date
}

export interface RbacGrantInput {
  model: string
  role_id: number
  perm_read?: boolean
  perm_write?: boolean
  perm_create?: boolean
  perm_unlink?: boolean
}
