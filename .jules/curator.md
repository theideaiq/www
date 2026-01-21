## 2024-02-12 - Service Logic Relocation
Structure: Move external service integrations from `src/lib/` to `src/services/`.
Rule: `src/lib` is for generic utilities (string manipulation, formatting). `src/services` is for domain-specific business logic and external API integrations (YouTube, Products, etc.).
