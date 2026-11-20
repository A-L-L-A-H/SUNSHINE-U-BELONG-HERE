import { SUPERUSER_ID } from './env.js'
import type { IrRbacGrant } from './models/ir-rbac-grant.js'

export type RbacOperation = 'read' | 'write' | 'create' | 'unlink'

export interface RbacContext {
  uid: number
  roles?: number[]
  companyId?: number
  isSuperuser?: boolean
}

export interface ModelPermissionGrant {
  model: string
  roleId: number
  permRead: boolean
  permWrite: boolean
  permCreate: boolean
  permUnlink: boolean
}

/**
 * In-memory permission registry for high-speed sub-millisecond evaluation
 */
const grantRegistry: ModelPermissionGrant[] = [
  // Explicit grants only. Default-deny: unregistered models return false for non-superusers.
  // Operators (roleId 1) must be explicitly granted per-model before access is allowed.
  { model: 'pj.task', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'hd.ticket', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'crm.lead', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'ir.automation', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'wx.source', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'wx.passage', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'wx.content', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'wx.provenance', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'wx.figure', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'wx.tradition', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'vx.user', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
  { model: 'ir.config_parameter', roleId: 1, permRead: true, permWrite: true, permCreate: true, permUnlink: true },
  { model: 'ir.sequence', roleId: 1, permRead: true, permWrite: false, permCreate: false, permUnlink: false },
]

/**
 * Optional DB-backed grant loader. When set, checkModelAccess loads grants
 * from this loader instead of (or in addition to) the in-memory registry.
 * Signature: (modelName: string) => Promise<IrRbacGrant[] | undefined>
 */
export type GrantLoader = (modelName: string) => Promise<IrRbacGrant[] | undefined>

let grantLoader: GrantLoader | undefined

/**
 * Register a database-backed grant loader (e.g. queries ir_rbac_grant table).
 * Replaces any previously registered loader.
 */
export function setGrantLoader(loader: GrantLoader): void {
  grantLoader = loader
}

/**
 * Clear the DB-backed grant loader, falling back to in-memory registry only.
 */
export function clearGrantLoader(): void {
  grantLoader = undefined
}

/**
 * Resolve grants for a model: DB loader first, then in-memory registry fallback.
 */
async function resolveGrants(
  modelName: string,
  roleIds: number[]
): Promise<ModelPermissionGrant[]> {
  const dbGrants = await grantLoader?.(modelName)
  if (dbGrants && dbGrants.length > 0) {
    return dbGrants.map((g) => ({
      model: g.model,
      roleId: g.role_id,
      permRead: g.perm_read,
      permWrite: g.perm_write,
      permCreate: g.perm_create,
      permUnlink: g.perm_unlink,
    }))
  }
  return grantRegistry.filter((g) => g.model === modelName && roleIds.includes(g.roleId))
}

/**
 * Register a security grant for a role and model
 */
export function registerGrant(grant: ModelPermissionGrant): void {
  const existingIdx = grantRegistry.findIndex(
    (g) => g.model === grant.model && g.roleId === grant.roleId
  )
  if (existingIdx >= 0) {
    grantRegistry[existingIdx] = grant
  } else {
    grantRegistry.push(grant)
  }
}

/**
 * Check if the active context has permission to execute an operation on a model
 */
export function checkModelAccess(
  ctx: RbacContext,
  modelName: string,
  operation: RbacOperation
): boolean {
  // Superuser has unconditional access
  if (ctx.uid === SUPERUSER_ID || ctx.isSuperuser) {
    return true
  }

  // System internal operations have access
  if (ctx.uid === 0) {
    return true
  }

  const userRoles = ctx.roles || [1] // Default to standard operator role if not explicitly defined
  const matchingGrants = grantRegistry.filter(
    (g) => g.model === modelName && userRoles.includes(g.roleId)
  )

  // Default-deny: if no explicit grant exists for this model+role, deny access.
  // This prevents privilege escalation on unregistered models.
  if (matchingGrants.length === 0) {
    return false
  }

  return matchingGrants.some((g) => {
    switch (operation) {
      case 'read':
        return g.permRead
      case 'write':
        return g.permWrite
      case 'create':
        return g.permCreate
      case 'unlink':
        return g.permUnlink
      default:
        return false
    }
  })
}

/**
 * Async variant of checkModelAccess that consults the DB-backed grant loader
 * when registered. Falls back to the synchronous in-memory check if no loader.
 */
export async function checkModelAccessAsync(
  ctx: RbacContext,
  modelName: string,
  operation: RbacOperation
): Promise<boolean> {
  // Superuser has unconditional access
  if (ctx.uid === SUPERUSER_ID || ctx.isSuperuser) {
    return true
  }

  // System internal operations have access
  if (ctx.uid === 0) {
    return true
  }

  const userRoles = ctx.roles || [1]
  const grants = await resolveGrants(modelName, userRoles)

  // Default-deny
  if (grants.length === 0) {
    return false
  }

  return grants.some((g) => {
    switch (operation) {
      case 'read':
        return g.permRead
      case 'write':
        return g.permWrite
      case 'create':
        return g.permCreate
      case 'unlink':
        return g.permUnlink
      default:
        return false
    }
  })
}
