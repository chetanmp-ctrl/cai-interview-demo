// tests/api/inventoryApi.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Inventory API — CAI ERP', () => {

  const baseURL = process.env.API_BASE_URL ||
    'https://api.caisoft.com';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  };

  test('GET inventory returns correct stock levels',
    async ({ request }) => {
    const response = await request.get(
      `${baseURL}/api/inventory/RM-FLOUR-001`,
      { headers }
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('materialCode');
    expect(body).toHaveProperty('quantity');
    expect(body.quantity).toBeGreaterThan(0);
  });

  test('POST production order creates lot traceability',
    async ({ request }) => {
    const response = await request.post(
      `${baseURL}/api/production-orders`,
      {
        headers,
        data: {
          materialCode: 'RM-FLOUR-001',
          quantity: 500,
          warehouse: 'WH-MAIN'
        }
      }
    );
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.lotNumber).toMatch(/^LOT-\d{6}$/);
    expect(body.status).toBe('Created');
  });

  test('POST order with invalid material returns 400',
    async ({ request }) => {
    const response = await request.post(
      `${baseURL}/api/production-orders`,
      {
        headers,
        data: {
          materialCode: 'INVALID-999',
          quantity: 100
        }
      }
    );
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Material code not found');
  });
});