import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Test configuration
export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "50s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.05"],
    errors: ["rate<0.05"],
  },
};

// Main test function
export default function () {
  // Make GET Request to categories API
  const response = http.get("http://localhost:3000/api/categories");

  //   Record errors in custom metric
  errorRate.add(response.status !== 200);

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
    "response has body": (r) => r.body.length > 0,
    "content type is JSON": (r) =>
      r.headers["Content-Type"] &&
      r.headers["Content-Type"].includes("application/json"),
  });

  //   Optional : Add small delay between requests to simulate  real user behavior
  //   sleep(1)
}

// Setup function (runs once at the beginning)
export function setup() {
  console.log("Starting performance test for categories API");
  console.log('Target: "localhost:3000/api/categories"');
  console.log("Scenario: 10s ramp-up to 50 VUs, 50s at 100 VUs, 10s ramp-down");
}

// Teardown function (runs once at the end)
export function teardown() {
  console.log("Performance test completed");
}
