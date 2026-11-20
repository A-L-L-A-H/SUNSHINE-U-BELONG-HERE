-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to wx_content
ALTER TABLE IF EXISTS wx_content
  ADD COLUMN IF NOT EXISTS embedding vector(768),
  ADD COLUMN IF NOT EXISTS vector_indexed BOOLEAN DEFAULT FALSE;

-- Add embedding columns to wx_passage
ALTER TABLE IF EXISTS wx_passage
  ADD COLUMN IF NOT EXISTS embedding vector(768),
  ADD COLUMN IF NOT EXISTS vector_indexed BOOLEAN DEFAULT FALSE;

-- HNSW index on wx_content embedding (cosine distance)
CREATE INDEX IF NOT EXISTS idx_wx_content_embedding_hnsw
  ON wx_content USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- HNSW index on wx_passage embedding (cosine distance)
CREATE INDEX IF NOT EXISTS idx_wx_passage_embedding_hnsw
  ON wx_passage USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Analyze tables for query planner
ANALYZE wx_content;
ANALYZE wx_passage;
