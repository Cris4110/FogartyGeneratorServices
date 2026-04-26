import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { faker } from "@faker-js/faker";

const SITE_URL = "http://localhost:5173/userlogin";
const INVOICE_PAGE = "http://localhost:5173/admin/wave-invoice";

const ADMIN_EMAIL = "";
const ADMIN_PASSWORD = "";


const INVOICE_COUNT = 3;

function generateInvoiceData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email()
  };
}

async function runTest() {

  const options = new chrome.Options();
  options.addArguments("--start-maximized");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  const waitTime = 10000;

  try {
    // Login
    await driver.get(SITE_URL);

    await driver.wait(until.elementLocated(By.css("input[type='email']")), waitTime)
      .sendKeys(ADMIN_EMAIL);

    await driver.findElement(By.css("input[type='password']"))
      .sendKeys(ADMIN_PASSWORD);

    await driver.findElement(By.css("button[type='submit']")).click();

 
    // Navagate to admin dashboard
    const adminBtn = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/div/a')),
      waitTime
    );
    await adminBtn.click();

    // Create invoices loop
    for (let i = 1; i <= INVOICE_COUNT; i++) {

      console.log(`Creating invoice ${i}`);

      const data = generateInvoiceData();

      await driver.get(INVOICE_PAGE);

      // Create customer 
      await driver.wait(until.elementLocated(By.name("name")), waitTime)
        .sendKeys(data.name);

      await driver.findElement(By.name("email"))
        .sendKeys(data.email);

      await driver.findElement(By.xpath("//button[contains(., 'Next')]"))
        .click();

      // Create items
      await driver.wait(until.elementLocated(By.xpath("//table")), waitTime);

      // How many items to add
      const itemCount = faker.number.int({ min: 2, max: 3 });

for (let row = 0; row < itemCount; row++) {

  if (row > 0) {
    const addItemBtn = await driver.findElement(
      By.xpath('//*[@id="root"]/div[2]/div/div/button')
    );
    await addItemBtn.click();
    await driver.sleep(500);
  }

  // Get updated rows
  const rows = await driver.findElements(By.xpath("//tbody/tr"));
  const currentRow = rows[row];

  // Select products
  const dropdown = await currentRow.findElement(
    By.xpath(".//div[contains(@class,'MuiSelect')]")
  );
  await dropdown.click();

  const option = await driver.wait(
    until.elementLocated(By.xpath(`(//li)[${(row % 3) + 1}]`)),
    waitTime
  );
  await option.click();

  // Input quantity and price
  const inputs = await currentRow.findElements(
    By.xpath(".//input[@type='number']")
  );

  const qty = faker.number.int({ min: 1, max: 5 });
  const price = faker.number.float({ min: 10, max: 200 }).toFixed(2);

  await inputs[0].clear(); // quantity
  await inputs[0].sendKeys(qty.toString());

  await inputs[1].clear(); // price
  await inputs[1].sendKeys(price.toString());
}

      // Click next button to go to review page
      await driver.findElement(By.xpath("//button[contains(., 'Next')]"))
        .click();

      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Total')]")),
        waitTime
      );
      
      // Submit invoice
      await driver.findElement(
        By.xpath("//button[contains(., 'Create Invoice')]")
      ).click();

      console.log(`Invoice ${i} created with ${itemCount} items`);

      await driver.sleep(1000);
    }

    console.log("All invoices created successfully");

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await driver.quit();
  }
}

runTest();