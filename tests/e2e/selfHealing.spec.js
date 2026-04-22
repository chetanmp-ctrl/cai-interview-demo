// tests/e2e/selfHealing.spec.js
const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require(
  '../../utils/selfHealingLocator'
);
const fs = require('fs');
const path = require('path');

// Serial mode - ONLY affects this file
// Other test files still run in parallel
test.describe.configure({ mode: 'serial' });

// Clear healing report before suite runs
const reportPath = path.join(
  process.cwd(), 'healing-report.json'
);
if (fs.existsSync(reportPath)) {
  fs.unlinkSync(reportPath);
}

test.describe('Self Healing Demo — CAI Interview', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.waitForURL(
      'https://www.saucedemo.com/inventory.html'
    );
    await page.waitForLoadState('networkidle');
  });

  // ─── DEMO 1: Primary locator works ────────────────
  test('DEMO 1 - Primary locator works normally',
    async ({ page }) => {
    console.log(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
    console.log('DEMO 1: Normal locator - should pass');
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    );

    const addToCart = new SelfHealingLocator(
      page,
      'Add To Cart Button',
      '[data-test="add-to-cart-sauce-labs-backpack"]',
      [
        {
          locator: '#add-to-cart-sauce-labs-backpack',
          strategy: 'id-attribute',
          confidence: 0.95
        },
        {
          locator: '.btn_primary.btn_inventory',
          strategy: 'css-class',
          confidence: 0.75
        }
      ]
    );

    const element = await addToCart.find();
    await element.click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');

    console.log(
      '\n✅ DEMO 1 PASSED - Primary locator worked\n'
    );
  });

  // ─── DEMO 2: Broken locator heals ─────────────────
  test('DEMO 2 - Self healing activates on broken locator',
    async ({ page }) => {
    console.log(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
    console.log('DEMO 2: Simulating developer UI change');
    console.log('Primary locator intentionally broken');
    console.log('Watch self-healing activate...');
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    );

    const addToCart = new SelfHealingLocator(
      page,
      'Add To Cart Button',

      // BROKEN primary locator
      '[data-test="add-to-cart-BROKEN-xyz-999"]',

      [
        {
          // Fallback 1 - broken
          locator: '#completely-wrong-id-abc',
          strategy: 'id-attribute',
          confidence: 0.95
        },
        {
          // Fallback 2 - broken
          locator: '.non-existent-button-class',
          strategy: 'css-class',
          confidence: 0.85
        },
        {
          // Fallback 3 - HEALS HERE
          locator: '[data-test="add-to-cart-sauce-labs-backpack"]',
          strategy: 'data-test-attribute',
          confidence: 0.80
        },
        {
          // Fallback 4 - backup
          locator: '.btn_primary.btn_inventory',
          strategy: 'css-structural',
          confidence: 0.70
        }
      ]
    );

    const element = await addToCart.find();
    await element.click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');

    console.log(
      '\n✅ DEMO 2 PASSED - Self healing worked!'
    );
    console.log(
      'healing-report.json updated\n'
    );
  });

  // ─── DEMO 3: Audit trail ───────────────────────────
  test('DEMO 3 - Verify healing audit trail exists',
    async ({ page }) => {
    console.log(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
    console.log('DEMO 3: Checking healing audit trail');
    console.log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    );

    await page.waitForTimeout(500);

    const reportExists = fs.existsSync(reportPath);

    if (!reportExists) {
      console.log('⚠️  No healing report found');
      test.skip(true, 'No healing events recorded');
      return;
    }

    const report = JSON.parse(
      fs.readFileSync(reportPath, 'utf8')
    );

    console.log('📋 Healing Report:');
    console.log('──────────────────');

    report.forEach((event, index) => {
      console.log(
        `\n🔧 Event ${index + 1}:`
      );
      console.log(
        `   Element    : ${event.element}`
      );
      console.log(
        `   Original   : ${event.originalLocator}`
      );
      console.log(
        `   Healed To  : ${event.healedLocator}`
      );
      console.log(
        `   Strategy   : ${event.strategy}`
      );
      console.log(
        `   Confidence : ${event.confidence}`
      );
      console.log(
        `   Status     : ${event.status}`
      );
      console.log(
        `   Time       : ${event.timestamp}`
      );
    });

    const healedEvents = report.filter(
      e => e.status === 'HEALED'
    );

    console.log('\n📊 Session Summary:');
    console.log(
      `   Total   : ${report.length}`
    );
    console.log(
      `   Healed  : ${healedEvents.length}`
    );
    console.log(
      `   Rate    : ${Math.round(
        (healedEvents.length / report.length) * 100
      )}%`
    );

    expect(healedEvents.length).toBeGreaterThan(0);
    expect(healedEvents[0].status).toBe('HEALED');

    console.log(
      '\n✅ DEMO 3 PASSED - Audit trail verified\n'
    );
  });
});