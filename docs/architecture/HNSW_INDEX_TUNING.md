 # HNSW Index Tuning Guidance (Production pgvector)
 
 Status: **Canonical** for MoonWitness RAG vector search.
 
 ## Current Configuration
 
 The pgvector HNSW indexes are created in migration `001_enable_pgvector_hnsw.sql`:
 
 ```sql
 -- HNSW index on wx_content embedding (cosine distance)
 CREATE INDEX IF NOT EXISTS idx_wx_content_embedding_hnsw
   ON wx_content USING hnsw (embedding vector_cosine_ops)
   WITH (m = 16, ef_construction = 64);
 
 -- HNSW index on wx_passage embedding (cosine distance)
 CREATE INDEX IF NOT EXISTS idx_wx_passage_embedding_hnsw
   ON wx_passage USING hnsw (embedding vector_cosine_ops)
   WITH (m = 16, ef_construction = 64);
 ```
 
 ## Parameter Guide
 
 | Parameter | Current | Description | Recommended Range |
 |---|---|---|---|
 | `m` | 16 | Max connections per layer (affects build time, memory, recall) | 16–48 (higher = better recall, more memory) |
 | `ef_construction` | 64 | Size of dynamic candidate list during build (affects build time, recall) | 64–200 (higher = better recall) |
 | `ef_search` | N/A (runtime) | Size of dynamic candidate list during query (affects latency, recall) | 40–400 (higher = better recall, more latency) |
 
 ## Tuning by Dataset Size
 
 | Dataset Size (vectors) | `m` | `ef_construction` | `ef_search` (query) | Expected Recall @ k=10 |
 +---|---|---|---|---|---|
 + | < 10K | 16 | 64 | 40 | ~0.95 |
 + | 10K–100K | 24 | 100 | 80 | ~0.97 |
 + | 100K–1M | 32 | 128 | 100 | ~0.98 |
 + | > 1M | 48 | 200 | 200 | ~0.99 |
 
 ## Production Recommendations for MoonWitness
 
 Given the expected corpus scale (Quran ~6,236 verses + Hadith ~187K + lexical roots ~1,400 = ~200K vectors):
 
 **Recommended settings:**
 - `m = 24` (balance of memory and recall)
 - `ef_construction = 100` (good recall for 200K vectors)
 - `ef_search = 80` (query-time, set via `SET hnsw.ef_search = 80`)
 
 ## Health Endpoint Diagnostics
 
 The `/health/ready` endpoint now includes vector index diagnostics:
 - Index existence check
 - Index size estimation
 - Sample recall test (k=10 against known passages)
 
 ## Applying New Settings
 
 To change HNSW parameters, create a new migration:
 
 ```sql
 -- Drop existing indexes
 DROP INDEX IF EXISTS idx_wx_content_embedding_hnsw;
 DROP INDEX IF EXISTS idx_wx_passage_embedding_hnsw;
 
 -- Recreate with new parameters
 CREATE INDEX idx_wx_content_embedding_hnsw
   ON wx_content USING hnsw (embedding vector_cosine_ops)
   WITH (m = 24, ef_construction = 100);
 
 CREATE INDEX idx_wx_passage_embedding_hnsw
   ON wx_passage USING hnsw (embedding vector_cosine_ops)
   WITH (m = 24, ef_construction = 100);
 
 -- Set query-time ef_search (session or global)
 ALTER DATABASE moonwitness SET hnsw.ef_search = 80;
 ```
 
 ## Monitoring
 
 - **Recall@k**: Sample 100 known queries weekly; target > 0.95@10
 - **Latency p95**: Target < 100ms for semantic search
 - **Index size**: Monitor via `pg_total_relation_size('idx_wx_content_embedding_hnsw')`
 - **Build time**: Re-indexing 200K vectors at `m=24, ef_construction=100` ~ 2–5 minutes
 
 ## References
 
 - pgvector HNSW: https://github.com/pgvector/pgvector#hnsw
 - AWS pgvector production: https://aws.amazon.com/blogs/database/ann-search-with-pgvector/
 - PostgreSQL pgvector tuning: https://github.com/pgvector/pgvector/blob/main/docs/tuning.md
