// tests/api/inventoryApi.spec.js
const { test, expect } = require('@playwright/test');

test.describe('API Tests - CAI ERP Simulation', () => {

  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('GET inventory returns 200 status', 
    async ({ request }) => {
    const response = await request.get(
      `${baseURL}/posts/1`
    );
    expect(response.status()).toBe(200);
  });

  test('GET inventory response time under 2 seconds',
    async ({ request }) => {
    const startTime = Date.now();
    await request.get(`${baseURL}/posts/1`);
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(2000);
  });

  test('GET inventory returns valid data structure',
    async ({ request }) => {
    const response = await request.get(
      `${baseURL}/posts/1`
    );
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
  });

  test('POST create order returns 201 status',
    async ({ request }) => {
    const response = await request.post(
      `${baseURL}/posts`,
      {
        data: {
          title: 'Production Order ORD-TEST-001',
          body: 'Material: RM-FLOUR-001, Qty: 500',
          userId: 1
        }
      }
    );
    expect(response.status()).toBe(201);
  });

  test('POST create order returns order ID',
    async ({ request }) => {
    const response = await request.post(
      `${baseURL}/posts`,
      {
        data: {
          title: 'Production Order ORD-TEST-002',
          body: 'Material: RM-SUGAR-001, Qty: 250',
          userId: 1
        }
      }
    );
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.id).toBeGreaterThan(0);
  });

  test('GET invalid order returns 404',
    async ({ request }) => {
    const response = await request.get(
      `${baseURL}/posts/999999`
    );
    expect(response.status()).toBe(404);
  });
});