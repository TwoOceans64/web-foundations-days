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

Users/Clients
|
v
DNS
|
v
CDN (static files, cached images)
|
v
Load Balancer
|
┌───────┬───────┐
v       v       v
App 1   App 2   App 3
|       |       |
|       |       |
└───────┴───────┘
|
Cache (Redis)
|
┌───────────────┐
| Primary DB     |<── Read Replica
└───────────────┘
|
Object Storage (photos)
|
Queue → Worker (thumbnails)

Code

## 🛠️ Component Roles
- **DNS:** Resolves snapshare.com to IPs.  
- **CDN:** Serves static assets and cached images close to users.  
- **Load Balancer:** Distributes API requests across app servers.  
- **App Servers:** Stateless logic for uploads, feeds, authentication.  
- **Cache (Redis):** Speeds up feed queries and session lookups.  
- **Primary DB:** Stores metadata (users, follows, photo references).  
- **Read Replica:** Handles heavy read traffic for feeds.  
- **Object Storage:** Stores actual photo files and thumbnails.  
- **Queue + Worker:** Offloads thumbnail generation and other background jobs.

## 📤 Upload Flow
1. User uploads photo via client.  
2. Request hits DNS → CDN → Load Balancer → App Server.  
3. App Server writes metadata to Primary DB.  
4. Photo stored in Object Storage.  
5. App Server enqueues thumbnail job.  
6. Worker consumes job, generates thumbnail, stores in Object Storage.  
7. Feed queries later read metadata from DB and cached results from Redis.

## ⚖️ Trade‑offs
- **CDN vs direct storage:** CDN reduces latency but adds cost and complexity.  
- **Read replicas:** Improve scalability for reads but introduce replication lag, meaning feeds may briefly miss the newest uploads.