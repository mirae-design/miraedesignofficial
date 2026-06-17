import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the load test configuration options
export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp-up to 20 virtual users over 30 seconds
        { duration: '1m', target: 20 },  // Stay at 20 virtual users for 1 minute
        { duration: '30s', target: 0 },  // Ramp-down to 0 virtual users over 30 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete under 500ms
        http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
    },
};

export default function () {
    // URL of the local page being tested
    const url = 'http://127.0.0.1:5501/about.html';
    
    // Perform a GET request
    const response = http.get(url);

    // Validate the response
    check(response, {
        'status is 200': (r) => r.status === 200,
        'page load is fast (<200ms)': (r) => r.timings.duration < 200,
    });

    // Pause for 1 second between requests for each virtual user
    sleep(1);
}
