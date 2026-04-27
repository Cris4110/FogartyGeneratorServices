import selenium from "selenium-webdriver";
const { Builder, By, until } = selenium;

const CONFIG = {
  url: "http://localhost:5173",
  credentials: {
    id: "testingemail@gmail.com",
    password: "passswrddddd",
  },
  targetName: "name",
  targetStatus: "Completed",
  WAIT: 20000,
  SLEEP: {
    short: 1000,
    medium: 3000,
  },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

async function waitAndClick(driver, locator, wait, label = "") {
  const el = await driver.wait(until.elementLocated(locator), wait);
  await driver.wait(until.elementIsVisible(el), wait);

  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);

  await driver.actions({ bridge: true })
    .move({ origin: el })
    .click()
    .perform();

  if (label) console.log(`✅ Clicked: ${label}`);
  return el;
}

async function waitAndType(driver, locator, text, wait) {
  const el = await driver.wait(until.elementLocated(locator), wait);
  await driver.wait(until.elementIsVisible(el), wait);
  await el.clear();
  await el.sendKeys(text);
  return el;
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

async function login(driver, { id, password }, wait) {
  await waitAndClick(
    driver,
    By.xpath('//*[@id="root"]/header/div/div/div[2]/a'),
    wait,
    "Sign In button"
  );

  await waitAndType(driver, By.css('input[type="Email"]'), id, wait);
  await waitAndType(driver, By.css('input[type="Password"]'), password, wait);

  await waitAndClick(
    driver,
    By.xpath('//*[@id="root"]/main/div/form/button'),
    wait,
    "Login button"
  );

  console.log("🔐 Logged in successfully");
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

async function navigateToPartsRequests(driver, wait, sleep) {
  await driver.sleep(sleep.medium);

  await waitAndClick(driver, By.xpath('//*[contains(text(),"Admin")]'), wait, "Admin Dashboard");
  await waitAndClick(driver, By.xpath('//*[contains(text(),"Incoming Requests")]'), wait, "Incoming Requests");
  await driver.sleep(sleep.short);
  await waitAndClick(driver, By.xpath('//*[contains(text(),"Parts Request")]'), wait, "Parts Request list");

  console.log("📍 Navigated to Parts Request list");
  await driver.sleep(sleep.medium);
}

// ─── FIND ROW ────────────────────────────────────────────────────────────────

async function findTargetRow(driver, targetName) {
  const rows = await driver.findElements(
    By.xpath("//tr | //div[contains(@class,'MuiDataGrid-row')]")
  );

  console.log(`📋 Rows found: ${rows.length}`);

  for (const row of rows) {
    const text = await row.getText();
    if (text.includes(targetName)) {
      console.log(`🎯 Found row for: ${targetName}`);
      return row;
    }
  }

  console.warn(`⚠️ "${targetName}" not found — using last row`);
  return rows[rows.length - 1];
}

// ─── FIXED MUI DROPDOWN ─────────────────────────────────────────────────────

async function markAsStatus(driver, row, wait, sleep, statusText) {
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", row);
  await driver.sleep(sleep.short);

  // open dropdown (IMPORTANT FIX: actions click instead of JS click)
  const dropdown = await row.findElement(
    By.xpath('.//div[contains(@class,"MuiSelect-select")]')
  );

  await driver.actions({ bridge: true })
    .move({ origin: dropdown })
    .click()
    .perform();

  console.log("⬇️ Dropdown opened");

  // wait for MUI listbox (stable selector)
  const menu = await driver.wait(
    until.elementLocated(By.css('ul[role="listbox"]')),
    wait
  );

  await driver.wait(until.elementIsVisible(menu), wait);

  const options = await menu.findElements(By.css('li[role="option"]'));

  console.log(`🔍 Options found: ${options.length}`);

  let targetOption = null;

  for (const opt of options) {
    const text = (await opt.getText()).trim();
    console.log(`  option: "${text}"`);

    if (text === statusText) {
      targetOption = opt;
      break;
    }
  }

  if (!targetOption) {
    throw new Error(`Option "${statusText}" not found`);
  }

  await driver.actions({ bridge: true })
    .move({ origin: targetOption })
    .click()
    .perform();

  console.log(`✅ Marked as ${statusText}`);

  await driver.sleep(sleep.medium);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function adminParts() {
  const driver = await new Builder().forBrowser("chrome").build();
  const { WAIT, SLEEP, url, credentials, targetName, targetStatus } = CONFIG;

  try {
    await driver.get(url);

    await login(driver, credentials, WAIT);
    await navigateToPartsRequests(driver, WAIT, SLEEP);

    const targetRow = await findTargetRow(driver, targetName);
    await markAsStatus(driver, targetRow, WAIT, SLEEP, targetStatus);

    console.log("🎉 PARTS REQUEST FLOW COMPLETE");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await driver.quit();
  }
}

adminParts();