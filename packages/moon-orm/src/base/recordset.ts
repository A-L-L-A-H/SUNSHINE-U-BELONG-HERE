import type { Ctx } from '../env.js'
import { Vertex } from './vertex-core.js'
import type { ModelRecord } from './types.js'

export class Recordset<M extends typeof Vertex, W extends string = never> {
  modelClass: M
  env: Ctx
  records: ModelRecord<M, W>[]

  constructor(modelClass: M, env: Ctx, records: ModelRecord<M, W>[]) {
    this.modelClass = modelClass
    this.env = env
    this.records = records

    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          const row = target.records[Number(prop)] as any
          if (!row) return undefined

          return new Proxy(row, {
            get(rowTarget, rowProp) {
              if (typeof rowProp === 'string') {
                if (rowProp in rowTarget) return rowTarget[rowProp]
                const snake = rowProp.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
                if (snake in rowTarget) return rowTarget[snake]
              }
              return rowTarget[rowProp]
            }
          })
        }
        return Reflect.get(target, prop)
      }
    })
  }

  [Symbol.iterator]() {
    return this.records[Symbol.iterator]()
  }

  get length() {
    return this.records.length
  }

  toJSON() {
    return this.records.map((r: any) => {
      const proxy = new Proxy(r, {
        get(rowTarget, rowProp) {
          if (typeof rowProp === 'string') {
            if (rowProp in rowTarget) return rowTarget[rowProp]
            const snake = rowProp.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
            if (snake in rowTarget) return rowTarget[snake]
          }
          return rowTarget[rowProp]
        }
      })
      return r
    })
  }

  map<U>(fn: (item: ModelRecord<M, W>, index: number) => U): U[] {
    return this.records.map(fn)
  }

  forEach(fn: (item: ModelRecord<M, W>, index: number) => void): void {
    this.records.forEach(fn)
  }

  mapped<K extends keyof ModelRecord<M, W>>(field: K): ModelRecord<M, W>[K][] {
    return this.records.map(r => r[field])
  }

  filtered(predicate: (r: ModelRecord<M>) => boolean): Recordset<M> {
    return new Recordset(this.modelClass, this.env, this.records.filter(predicate))
  }

  async morph(vals: Partial<ModelRecord<M>>): Promise<boolean> {
    const ids = this.records.map((r: any) => r.id)
    if (ids.length === 0) return true
    return (this.modelClass as any).morph(this.modelClass, this.env, ids, vals)
  }

  async purge(): Promise<boolean> {
    const ids = this.records.map((r: any) => r.id)
    if (ids.length === 0) return true
    return (this.modelClass as any).purge(this.modelClass, this.env, ids)
  }

}
