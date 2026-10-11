# SnapShare Scaling Plan

## 📌 Assumptions
- 10 million registered users.
- 10% active daily → 1 million daily active users.
- Each active user uploads 1 photo/day → 1 million uploads/day.
- Each active user views 50 feed pages/day → 50 million feed views/day.
- Average photo size: 2 MB; thumbnail: 50 KB.

## 📊 Load Estimates
- **Uploads per second (average):**  
  1,000,000 photos ÷ 86,400 seconds ≈ 12 uploads/sec.  
  Peak (×5): ~60 uploads/sec.
- **Feed views per second (average):**  
  50,000,000 ÷ 86,400 ≈ 578 views/sec.  
  Peak (×5): ~2,890 views/sec.
- **Storage per year:**  
  1,000,000 × 365 × (2 MB + 0.05 MB) ≈ 747 TB/year.

## ⚖️ Read vs Write
The system is **read‑heavy**: far more feed views than uploads.  
Design must optimize caching, replicas, and CDN delivery for reads.

## 🗄️ Storage Choice
Photos should not be stored inside the relational database — they are large binary objects.  
Instead, store them in **object storage** (e.g., S3, Azure Blob) and keep metadata (user, caption, URL) in the database.

## 🖼️ Architecture Diagram