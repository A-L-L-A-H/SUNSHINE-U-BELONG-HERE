/**
 * WxContent — Canonical text content entity for Witness graph.
 *
 * pgvector HNSW indexing is applied on the `embedding` column for semantic search.
 */
import { Vertex, fields } from '@moon/orm'

export default class WxContent extends Vertex {
  static _name = 'wx.content'
  static _description = 'Witness Canonical Content'

  source_id = fields.Char({ required: true, index: true, size: 180 })
  passage_id = fields.Char({ index: true, size: 180 })
  derivedFromContentId = fields.Many2one({ comodel: 'wx.content', index: true })
  entityId = fields.Many2one({ comodel: 'wx.entity', index: true })
  content_type = fields.Selection({
    selection: [
      ['scripture', 'Scripture'],
      ['hadith', 'Hadith'],
      ['translation', 'Translation'],
      ['commentary', 'Commentary'],
      ['analysis', 'Analysis'],
    ],
    required: true,
    index: true,
  })
  body = fields.Text({ required: true })
  body_ar = fields.Text()
  language = fields.Char({ default: 'id', size: 10 })
  embedding = fields.Vector({ dim: 768 })
  vector_indexed = fields.Boolean({ default: false })

  static async beforeSave(
    _modelClass: typeof Vertex,
    _env: any,
    values: Record<string, unknown>
  ): Promise<void> {
    const hasEntity = values.entityId || values.entity_id
    const hasPassage = values.passageId || values.passage_id
    if (!hasEntity && !hasPassage) {
      throw new Error('Content must target an entity or passage')
    }
    const textContent = values.body || values.text
    if (textContent && !values.checksum) {
      const { sha256String } = await import('../services/hash.js')
      values.checksum = sha256String(String(textContent))
    }
  }
}
