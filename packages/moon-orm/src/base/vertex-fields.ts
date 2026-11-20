import { Vertex } from '../base.js'
import { fields } from '../fields.js'

export function getFieldDefs(modelClass: typeof Vertex): Record<string, import('../fields.js').FieldDef> {
  const instance = new (modelClass as any)()
  const defs: Record<string, import('../fields.js').FieldDef> = {}
  for (const [key, value] of Object.entries(instance)) {
    if (isFieldDef(value)) {
      defs[key] = value as import('../fields.js').FieldDef
    }
  }

  if ((modelClass as any)._softDelete && !defs.deletedAt) {
    defs.deletedAt = fields.DateTime({ index: true })
  }

  return defs
}

export function tableName(modelClass: typeof Vertex): string {
  return modelClass._name
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/\./g, '_')
    .replace(/^_/, '')
}

export function validateData(modelClass: typeof Vertex, vals: Record<string, unknown>) {
  const fieldDefs = getFieldDefs(modelClass)
  for (const [k, v] of Object.entries(vals)) {
    const snakeKey = toSnakeCase(k)
    const camelKey = Object.keys(fieldDefs).find((f) => f === k || toSnakeCase(f) === snakeKey)
    if (!camelKey) continue

    const def = fieldDefs[camelKey]
    if (!def) continue

    if (v === null || v === undefined) {
      if (def.required) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' is required.`)
      }
      continue
    }

    if (def.type === 'char' || def.type === 'text') {
      const strVal = String(v)
      if (def.min !== undefined && strVal.length < def.min) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at least ${def.min} characters.`)
      }
      if (def.max !== undefined && strVal.length > def.max) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at most ${def.max} characters.`)
      }
      if (def.pattern && !def.pattern.test(strVal)) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' does not match required format.`)
      }
    }

    if (def.type === 'integer' || def.type === 'float') {
      const numVal = Number(v)
      if (def.min !== undefined && numVal < def.min) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at least ${def.min}.`)
      }
      if (def.max !== undefined && numVal > def.max) {
        throw new Error(`Validation Error: Field '${camelKey}' on '${modelClass._name}' must be at most ${def.max}.`)
      }
    }

    if (def.validate) {
      const res = def.validate(v)
      if (res !== true) {
        throw new Error(`Validation Error: ${typeof res === 'string' ? res : `Field '${camelKey}' is invalid.`}`)
      }
    }
  }
}

export function splitVals(modelClass: typeof Vertex, vals: Record<string, unknown>) {
  const fieldDefs = getFieldDefs(modelClass)
  const sqlVals: Record<string, unknown> = {}
  const relationalUpdates: Array<{ field: string, def: import('../fields.js').FieldDef, tuples: any[] }> = []

  for (const [k, v] of Object.entries(vals)) {
    if (k === 'id') continue
    const snake = toSnakeCase(k)
    const camelKey = Object.keys(fieldDefs).find((f) => f === k || toSnakeCase(f) === snake)
    if (camelKey) {
      const def = fieldDefs[camelKey]
      if (def && (def.type === 'many2many' || def.type === 'one2many')) {
        if (Array.isArray(v) && v.length > 0 && Array.isArray(v[0])) {
          relationalUpdates.push({ field: camelKey, def, tuples: v })
        }
        continue
      }
      if (def && def.type === 'many2one' && typeof v === 'object' && v !== null) {
        sqlVals[k] = (v as any).id ?? null
        continue
      }
    }
    sqlVals[k] = v
  }
  return { sqlVals, relationalUpdates }
}

export function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
}

export function isFieldDef(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as import('../fields.js').FieldDef).type === 'string'
  )
}
