// utils/selfHealingLocator.js
const fs = require('fs');
const path = require('path');

class SelfHealingLocator {
  constructor(page, elementName, primaryLocator, fallbacks) {
    this.page = page;
    this.elementName = elementName;
    this.primaryLocator = primaryLocator;
    this.fallbacks = fallbacks;
    this.reportPath = path.join(
      process.cwd(),
      'healing-report.json'
    );
  }

  async find() {
    // Try primary locator first
    try {
      const element = this.page.locator(
        this.primaryLocator
      );
      await element.waitFor({ timeout: 3000 });
      console.log(
        `✅ Primary locator found: ${this.elementName}`
      );
      return element;

    } catch {
      console.log(
        `⚠️  Primary locator FAILED for: ${this.elementName}`
      );
      console.log(
        `   Attempted: ${this.primaryLocator}`
      );
      console.log(`   Starting self-healing process...`);
      return await this.heal();
    }
  }

  async heal() {
    for (const fallback of this.fallbacks) {
      try {
        console.log(
          `   Trying ${fallback.strategy}: ${fallback.locator}`
        );
        const element = this.page.locator(
          fallback.locator
        );
        await element.waitFor({ timeout: 2000 });

        // Log healing event
        this.logHealingEvent({
          element: this.elementName,
          originalLocator: this.primaryLocator,
          healedLocator: fallback.locator,
          strategy: fallback.strategy,
          confidence: `${fallback.confidence * 100}%`,
          timestamp: new Date().toISOString(),
          status: 'HEALED'
        });

        console.log(
          `✅ Self-healed using ${fallback.strategy}!`
        );
        console.log(
          `   New locator: ${fallback.locator}`
        );
        console.log(
          `   Confidence: ${fallback.confidence * 100}%`
        );
        return element;

      } catch {
        console.log(
          `   ❌ ${fallback.strategy} failed, trying next...`
        );
        continue;
      }
    }

    // All fallbacks exhausted
    this.logHealingEvent({
      element: this.elementName,
      originalLocator: this.primaryLocator,
      healedLocator: null,
      strategy: 'ALL_FAILED',
      confidence: '0%',
      timestamp: new Date().toISOString(),
      status: 'FAILED'
    });

    throw new Error(
      `❌ Self-healing exhausted all options for "${this.elementName}"`
    );
  }

  logHealingEvent(event) {
    let log = [];
    if (fs.existsSync(this.reportPath)) {
      try {
        log = JSON.parse(
          fs.readFileSync(this.reportPath, 'utf8')
        );
      } catch {
        log = [];
      }
    }
    log.push(event);
    fs.writeFileSync(
      this.reportPath,
      JSON.stringify(log, null, 2)
    );
  }
}

module.exports = { SelfHealingLocator };