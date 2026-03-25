# 📊 Performance Test Report - Categories API

## 📌 Overview

Performance testing dilakukan pada endpoint:

GET /api/categories

Testing menggunakan tool **k6** untuk mengukur performa API dalam kondisi concurrent users.

---

## 🧪 Test Scenario

| Stage     | Duration | Virtual Users (VUs) |
| --------- | -------- | ------------------- |
| Ramp-up   | 10s      | 0 → 50              |
| Load      | 50s      | 50 → 100            |
| Ramp-down | 10s      | 100 → 0             |

**Total Duration:** 70 detik

---

## 🎯 Performance Targets (SLA)

- 95% request ≤ **200 ms**
- Error rate < **5%**

---

## 📈 Test Results

### 🔹 Request Metrics

- Total Requests: **28,588**
- Requests/sec: **~408 req/s**

---

### 🔹 Response Time

| Metric  | Result        | Status     |
| ------- | ------------- | ---------- |
| Average | 156.87 ms     | ✅ OK      |
| Median  | 144.98 ms     | ✅ OK      |
| P90     | 282.01 ms     | ⚠️ Warning |
| **P95** | **296.57 ms** | ❌ FAIL    |
| Max     | 419.49 ms     | ❌ FAIL    |

---

### 🔹 Error Metrics

| Metric     | Result | Status |
| ---------- | ------ | ------ |
| Error Rate | 0%     | ✅ OK  |
| Failed Req | 0      | ✅ OK  |

---

### 🔹 Checks Result

- Total Checks: **114,352**
- Success Rate: **94.70%**
- Failed: **5.29%**

❌ Failure disebabkan oleh:

- Response time > 200ms

---

## ⚠️ Analysis

API menunjukkan:

- Stabil (tidak ada error)
- Rata-rata response cukup cepat

Namun:

> ❌ Tidak memenuhi SLA karena P95 = 296 ms (> 200 ms)

### 🔍 Insight

- Mayoritas request cepat
- Namun saat load tinggi, terjadi peningkatan latency
- Bottleneck muncul pada concurrency tinggi

---

## 🧠 Possible Root Causes

1. Database query belum optimal
2. Tidak ada caching (Redis)
3. Payload response terlalu besar
4. Keterbatasan resource lokal (CPU/RAM)

---

## 🚀 Recommendations

### ✅ 1. Implement Caching (High Priority)

Gunakan Redis untuk menyimpan hasil query categories

```js
const cached = await redis.get("categories");

if (cached) {
  return JSON.parse(cached);
}

const data = await db.query(...);
await redis.set("categories", JSON.stringify(data), "EX", 60);

return data;
✅ 2. Database Optimization
CREATE INDEX idx_parent_id ON categories(parent_id);
✅ 3. Simulasi User Realistis

Tambahkan delay di k6:

sleep(1);
✅ 4. Pagination / Limit Data

Hindari response data terlalu besar

🏁 Conclusion
Aspect	Result
Stability	✅ Good
Throughput	✅ Good (~408 req/s)
Performance	❌ Needs Improvement

👉 API belum memenuhi target performa (P95 ≤ 200ms)
👉 Perlu optimasi pada caching dan database

🔥 Next Steps
Implement Redis cache
Jalankan ulang performance test
Bandingkan hasil sebelum & sesudah optimasi
📎 Notes
Testing dilakukan di environment lokal (localhost)
Hasil bisa berbeda jika dijalankan di server production

---

Kalau mau, saya bisa bantu bikin:
- versi **README yang lebih “jualan” (biar HR tertarik 😎)**
- atau tambah grafik + screenshot biar kelihatan profesional banget 🚀
```
