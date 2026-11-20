/**
 * WxPassage — Canonical passage entity for Witness graph.
 *
 * pgvector HNSW indexing is applied on the `embedding` column for semantic search.
 */
import { Vertex, fields } from '@moon/orm'

export default class WxPassage extends Vertex {
  static _name = 'wx.passage'
  static _description = 'Witness Canonical Passage'

  source_id = fields.Char({ required: true, index: true, size: 180 })
  reference = fields.Char({ required: true, index: true, size: 200 })
  parentId = fields.Many2one({ comodel: 'wx.passage', index: true })
  text_ar = fields.Text()
  text_en = fields.Text()
  language = fields.Char({ default: 'id', size: 10 })
  embedding = fields.Vector({ dim: 768 })
  vector_indexed = fields.Boolean({ default: false })
  created_at = fields.DateTime({ autoNowAdd: true })
  updated_at = fields.DateTime({ autoNow: true })

  static async beforeSave(
    modelClass: typeof Vertex,
    env: any,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    const parentId = Number(values.parentId)
    if (!parentId) return
    if (id && parentId === id) throw new Error('A passage cannot be its own parent')
    if (!env.getModel) return
    const Passage = env.getModel(modelClass._name)
    if (!Passage) return
    const [parent] = await (Passage as any).fetch(Passage, env, [['id', '=', parentId]])
    if (parent && Number(parent.scripture_id ?? parent.scriptureId) !== Number(values.scriptureId)) {
      throw new Error('A passage parent must belong to the same scripture')
    }
  }
}
