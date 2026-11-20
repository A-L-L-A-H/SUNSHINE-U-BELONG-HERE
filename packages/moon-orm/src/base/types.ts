import type { FieldDef, InferFieldType } from '../fields.js'
import type { Vertex } from '../base.js'

export type ModelFields<M extends typeof Vertex> = {
  [K in keyof InstanceType<M> as InstanceType<M>[K] extends FieldDef<any> ? K : never]: InferFieldType<InstanceType<M>[K]>
}

export type PopulatedRelations<W extends string> = {
  [K in W as `$${K}`]: any
}

export type ModelRecord<M extends typeof Vertex, W extends string = never> = ModelFields<M> & { id: number } & PopulatedRelations<W>

export interface Recordset<M extends typeof Vertex, W extends string = never> {
  [index: number]: ModelRecord<M, W>
}
