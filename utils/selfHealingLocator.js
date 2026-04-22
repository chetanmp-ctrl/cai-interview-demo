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
      process.cwd(), 'healing-report.json'
    );
  }

  async find(timeout = 5000) {
    // Try primary first
    try {
      const element = this.page.locator(this.primaryLocator);
      await element.waitFor({ timeout: 3000 });
      return element;
    } catch {
      console.warn(
        `⚠️  Primary locator failed for "${this.elementName}":
        ${this.primaryLocator}`
      );
      return await this.heal();
    }
  }

  async heal() {
    for (const fallback of this.fallbacks) {
      try {
        const element = this.page.locator(fallback.locator);
        await element.waitFor({ timeout: 2000 });

        this.logHealingEvent({
          element: this.elementName,
          original: this.primaryLocator,
          healed: fallback.locator,
          strategy: fallback.strategy,
          confidence: fallback.confidence,
          timestamp: new Date().toISOString()
        });

        console.log(
          `✅ Self-healed "${this.elementName}" using 
          ${fallback.strategy} 
          (confidence: ${fallback.confidence * 100}%)`
        );
        return element;

      } catch {
        continue;
      }
    }
    throw new Error(
      `❌ Self-healing exhausted all options for 
      "${this.elementName}"`
    );
  }

  logHealingEvent(event) {
    let log = [];
    if (fs.existsSync(this.reportPath)) {
      log = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
    }
    log.push(event);
    fs.writeFileSync(this.reportPath,
      JSON.stringify(log, null, 2)
    );
  }
}

module.exports = { SelfHealingLocator };