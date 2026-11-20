import { Vertex } from '../base.js'
import { checkAccessRights, getRecordRulesDomain, AuthorizationError } from '../security.js'
import { applyDomain } from '../domain-query.js'
import { getDb } from '../config.js'
import { tableName, getFieldDefs, toSnakeCase } from './vertex-fields.js'
import type { Ctx } from '../env.js'
import type { FieldDef } from '../fields.js'

export async function processRelationalTuples(
  modelClass: typeof Vertex,
  env: Ctx,
  recordId: number,
  relationalUpdates: Array<{ field: string, def: FieldDef, tuples: any[] }>
) {
  if (relationalUpdates.length === 0) return
  const db = getDb()
  const conn = env.trx || db
  const table = tableName(modelClass)

  for (const update of relationalUpdates) {
    const { def, tuples } = update
    if (def.type === 'many2many' && def.comodel) {
      const Comodel = env.getModel?.(def.comodel)
      if (!Comodel) continue
      const table2 = tableName(Comodel)
      const relTable = (def as any).relation || `${table}_${table2}_rel`
      const col1 = `${table}_id`
      const col2 = `${table2}_id`

      for (const tuple of tuples) {
        if (!Array.isArray(tuple)) continue
        const [cmd, id, vals] = tuple

        if (cmd === 0) {
          const newRec = await Comodel.spawn(Comodel, env, vals)
          await conn(relTable).insert({ [col1]: recordId, [col2]: newRec.id })
        } else if (cmd === 1) {
          await Comodel.morph(Comodel, env, id, vals)
        } else if (cmd === 2) {
          await conn(relTable).where({ [col1]: recordId, [col2]: id }).delete()
          await Comodel.purge(Comodel, env, id)
        } else if (cmd === 3) {
          await checkRecordOperationAccess(Comodel, env, id, 'permRead')
          await conn(relTable).where({ [col1]: recordId, [col2]: id }).delete()
        } else if (cmd === 4) {
          await checkRecordOperationAccess(Comodel, env, id, 'permRead')
          const exists = await conn(relTable).where({ [col1]: recordId, [col2]: id }).first()
          if (!exists) {
            await conn(relTable).insert({ [col1]: recordId, [col2]: id })
          }
        } else if (cmd === 5) {
          const existingLinks = await conn(relTable).where({ [col1]: recordId }).select(col2)
          const existingIds = (existingLinks || []).map((r: any) => r[col2]).filter(Boolean)
          if (existingIds.length > 0) {
            await checkRecordOperationAccess(Comodel, env, existingIds, 'permRead')
          }
          await conn(relTable).where({ [col1]: recordId }).delete()
        } else if (cmd === 6) {
          const ids = Array.isArray(vals) ? vals : []
          const existingLinks = await conn(relTable).where({ [col1]: recordId }).select(col2)
          const existingIds = (existingLinks || []).map((r: any) => r[col2]).filter(Boolean)
          const allAffectedIds = Array.from(new Set([...existingIds, ...ids]))
          if (allAffectedIds.length > 0) {
            await checkRecordOperationAccess(Comodel, env, allAffectedIds, 'permRead')
          }
          await conn(relTable).where({ [col1]: recordId }).delete()
          const inserts = ids.map((targetId: number) => ({ [col1]: recordId, [col2]: targetId }))
          if (inserts.length > 0) {
            await conn(relTable).insert(inserts)
          }
        }
      }
    } else if (def.type === 'one2many' && def.comodel && def.relation) {
      const Comodel = env.getModel?.(def.comodel)
      if (!Comodel) continue
      const fkCol = toSnakeCase(def.relation)

      for (const tuple of tuples) {
        if (!Array.isArray(tuple)) continue
        const [cmd, id, vals] = tuple

        if (cmd === 0) {
          await Comodel.spawn(Comodel, env, { ...vals, [def.relation]: recordId })
        } else if (cmd === 1) {
          await Comodel.morph(Comodel, env, id, vals)
        } else if (cmd === 2) {
          await Comodel.purge(Comodel, env, id)
        } else if (cmd === 3) {
          await Comodel.morph(Comodel, env, id, { [def.relation]: null })
        } else if (cmd === 4) {
          await Comodel.morph(Comodel, env, id, { [def.relation]: recordId })
        } else if (cmd === 5) {
          const childRecs = await Comodel.fetch(Comodel, env, [[def.relation, '=', recordId]])
          const childIds = childRecs.map((r: any) => r.id)
          if (childIds.length > 0) {
            await Comodel.morph(Comodel, env, childIds, { [def.relation]: null })
          }
        } else if (cmd === 6) {
          const childRecs = await Comodel.fetch(Comodel, env, [[def.relation, '=', recordId]])
          const currentIds = new Set(childRecs.map((r: any) => r.id))
          const targetIds = Array.isArray(vals) ? vals : []
          const toUnlink = Array.from(currentIds).filter((cid) => !targetIds.includes(cid))
          if (toUnlink.length > 0) {
            await Comodel.morph(Comodel, env, toUnlink, { [def.relation]: null })
          }
          if (targetIds.length > 0) {
            await Comodel.morph(Comodel, env, targetIds, { [def.relation]: recordId })
          }
        }
      }
    }
  }
}

async function checkRecordOperationAccess(
  modelClass: typeof Vertex,
  env: Ctx,
  ids: number | number[],
  operation: string
) {
  const idArray = Array.isArray(ids) ? ids : [ids]
  if (idArray.length === 0) return

  await checkAccessRights(modelClass, env, operation as any)
  if (env.uid === 1) return

  const ruleDomain = await getRecordRulesDomain(modelClass, env, operation as any)
  if (ruleDomain.length === 0) return

  const table = tableName(modelClass)
  const db = getDb()
  const conn = env.trx || db
  const query = conn(table)

  if (modelClass._inherits && env.getModel) {
    for (const [parentModelName, fkField] of Object.entries(modelClass._inherits)) {
      const ParentModel = env.getModel(parentModelName)
      if (ParentModel) {
        const pt = tableName(ParentModel)
        const pcol = toSnakeCase(fkField)
        query.join(pt, `${table}.${pcol}`, '=', `${pt}.id`)
        const pDefs = getFieldDefs(ParentModel)
      }
    }
  }

  const finalDomain = ['&', ['id', 'in', idArray], ...ruleDomain]
  applyDomain(query, finalDomain, table, {})
  query.select(`${table}.id`)

  const allowedRows = await query
  const allowedIds = new Set(allowedRows.map((r: any) => r.id))

  for (const reqId of idArray) {
    if (!allowedIds.has(reqId)) {
      const opName = operation.replace('perm', '').toLowerCase()
      throw new AuthorizationError(
        'ACCESS_DENIED',
        `Access Denied: Record rule prevents ${modelClass._name} ${opName} on record ${reqId}`
      )
    }
  }
}
