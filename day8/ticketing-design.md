# TicketHub Design Document

## 1. Requirements
**Functional**
- Browse concerts and events
- View available seats
- Hold seats temporarily
- Purchase tickets securely
- View purchased tickets

**Non-functional**
- Speed: handle thousands of requests per second
- Correctness: no double-booking of seats
- Fairness: first-come, first-served seat allocation
- Reliability: survive traffic spikes
- Security: protect payment and user data

## 2. Estimates
- Registered users: 2 million
- Normal day: 50,000 visitors × 10 pages = 500,000 page views/day (~6 views/sec avg, ~30/sec peak)
- Normal sales: 5,000 tickets/day (~0.06/sec avg)
- Big sale: 200,000 users in 10 minutes = ~333/sec page views; 20,000 seats sold in 600 seconds = ~33/sec purchases

**Comparison:** Big sale traffic is ~500× heavier than normal ticket sales.

## 3. API Endpoints
- `GET /events` — list upcoming events
- `GET /events/{id}/seats` — view seats for an event
- `POST /events/{id}/hold` — hold selected seats (expires after 2 minutes)
- `POST /orders` — pay and confirm tickets
- `GET /users/{id}/orders` — view user’s tickets

## 4. Data Model
Tables:
- **users** (id, name, email, password_hash)
- **events** (id, name, date, venue)
- **seats** (id, event_id, seat_number, status)
- **orders** (id, user_id, event_id, seat_id, payment_status)

Relationships:
- users ↔ orders (1-to-many)
- events ↔ seats (1-to-many)
- orders ↔ seats (many-to-one)

**Preventing double-booking:**  
- `seats.status` has constraint: only one order can reference a seat.  
- Transactions: seat status changes from “available” → “held” → “sold” atomically.  
- If two users try at once, only one transaction commits; the other fails.

## 5. Architecture
Clients → DNS → CDN → Load Balancer
↓
┌───────────┐
│ App Server│ (xN)
└─────┬─────┘
↓
Cache (Redis)
↓
┌───────────────┐
│ Primary DB     │ <── Read Replica
└───────────────┘
↓
Queue → Worker (payments, emails)

Code

**Explanation**
- CDN: serves static pages quickly
- Load balancer: spreads requests
- App servers: stateless API logic
- Cache: speeds up event browsing
- DB: enforces seat constraints
- Read replica: handles browsing load
- Queue + worker: offloads payment confirmation and notifications

**Surviving big sale:**  
Horizontal scaling of app servers, caching seat maps, and strict DB transactions prevent overload and double-booking.

## 6. Trade-offs
- **Strong consistency vs performance:** strict transactions prevent double-booking but add latency.  
- **Cache vs DB reads:** caching seat maps improves speed but risks stale data; must expire quickly.