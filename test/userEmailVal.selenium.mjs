import { Builder, By, until, Key } from 'selenium-webdriver';
import pkg from "selenium-webdriver/package.json" with { type: "json" };
import dotenv from "dotenv"
import { error } from 'node:console';
dotenv.config();

// in the terminal, run the test with: node test/userEmailVal.selenium.mjs
// make sure to delete the new account after making them by opening firebase and mongo if you don't have access to the email

async function emailVal() {
    let driver = await new Builder().forBrowser('chrome').build();

    const caps = await driver.getCapabilities();
    console.log("Selenium Version:", pkg.version);
    console.log("Browser:", caps.getBrowserName());
    console.log("Browser Version:", caps.getBrowserVersion());
    console.log("ChromeDriver Version:", caps.get("chrome").chromedriverVersion);
    await driver.manage().window().maximize();

    const WAIT = 15000; // ms, how long to wait for the element to be located before throwing an error.
    const DELAY = 50;
    const runs = 1;
    const times = [];
    let failures = 0;

    // Valids (tests edge cases)
    const validName = "Mary Jane";
    const validName2 = "Doe";
    const validID = "deleteTest";
    const validEmail = process.env.REAL_EMAIL2;
    const validPhone = "5557895120";
    const validPass = process.env.REAL_PASSWORD2;
    const validStreet = "12th Ave";
    const validCity = "Site 13";
    const validZip = "98765-1234";

    // Invalids (replace with valid at end)
    const invalidNames = ["", "      ", "J@NE", "Jane  ", "Jane3", "1231"];
    const invalidEmails = ["", "      ", "1231", "abc.example.com", "a@b@c@example.com", "just\"not\"right@example.com", "i.like.underscores@but_they_are_not_allowed_in_this_part"];
    const invalidPhones = ["", "      ", "111", "dwad", "12#", "12345678901"];
    const invalidPass = ["", "      ", "simplePass32"];
    const invalidStreet = ["", "      ", "Aw @ Shasta"];
    const invalidCity = ["", "      ", "New Y@rk"];
    const invalidZip = ["", "      ", "john", "222"];

    async function testFieldsCSS(field, inputs, click) {
        for(const input in inputs) {
            // clear fields
            await (await driver.wait(until.elementLocated(By.css(field)),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
            // send in the invalid inputs
            await (await driver.wait(until.elementLocated(By.css(field)),WAIT)).sendKeys(inputs[input]);    
            await driver.sleep(DELAY);

            // checks to see if invalid inputs are still invalid
            if (await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/form/div[2]/button')),WAIT)).isEnabled() && click) {
                throw new Error("Invalid input passed: " + inputs[input]);
            }
        }
    }

    // Fill with valid inputs first
    async function fillValid() {
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="First Name"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="First Name"]')),WAIT)).sendKeys(validName);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Last Name"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Last Name"]')),WAIT)).sendKeys(validName2);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="User ID"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="User ID"]')),WAIT)).sendKeys("deleteTest");
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Email"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Email"]')),WAIT)).sendKeys(validEmail);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Phone Number"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Phone Number"]')),WAIT)).sendKeys(validPhone);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Password"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Password"]')),WAIT)).sendKeys(validPass);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Street"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="Street"]')),WAIT)).sendKeys(validStreet);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="City"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="City"]')),WAIT)).sendKeys(validCity);
        await driver.sleep(DELAY);

        await (await driver.wait(until.elementLocated(By.css('input[placeholder="ZIP Code"]')),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
        await (await driver.wait(until.elementLocated(By.css('input[placeholder="ZIP Code"]')),WAIT)).sendKeys(validZip);
        await driver.sleep(DELAY);

        // state button
        await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/form/div[1]/div[10]/div/div')),WAIT)).click();
        await driver.sleep(200);
        await (await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[3]/ul/li[5]')),WAIT)).click();
        await driver.sleep(DELAY);
    }


    if (!validEmail || !validPass) {
        throw new Error("Missing TEST_EMAIL or TEST_PASSWORD in .env");
    }
  
    for (let i = 1; i <= runs; i++) {
        try {
            // launch the application
            await driver.get("http://localhost:5173");
            const t0 = performance.now();

            // request account button
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[1]/a[7]')),WAIT)).click();
            await driver.sleep(DELAY);
            await fillValid();
            // invalid inputs
            await testFieldsCSS('input[placeholder="First Name"]', invalidNames, true);
            await testFieldsCSS('input[placeholder="First Name"]', [validName], false);

            await testFieldsCSS('input[placeholder="Last Name"]', invalidNames, true);
            await testFieldsCSS('input[placeholder="Last Name"]', [validName2], false);

            await testFieldsCSS('input[placeholder="Email"]', invalidEmails, true);
            await testFieldsCSS('input[placeholder="Email"]', [validEmail], false);

            await testFieldsCSS('input[placeholder="Phone Number"]', invalidPhones, true);
            await testFieldsCSS('input[placeholder="Phone Number"]', [validPhone], false);

            await testFieldsCSS('input[placeholder="Password"]', invalidPass, true);
            await testFieldsCSS('input[placeholder="Password"]', [validPass], false);

            await testFieldsCSS('input[placeholder="Street"]', invalidStreet, true);
            await testFieldsCSS('input[placeholder="Street"]', [validStreet], false);

            await testFieldsCSS('input[placeholder="City"]', invalidCity, true);
            await testFieldsCSS('input[placeholder="City"]', [validCity], false);

            await testFieldsCSS('input[placeholder="ZIP Code"]', invalidZip, true);
            await testFieldsCSS('input[placeholder="ZIP Code"]', [validZip], false);

            // create account button
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/form/div[2]/button')),WAIT)).click();
            await driver.sleep(5000);

            // go home  
            await driver.get("http://localhost:5173");

            // click request appointment
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/a[1]')),WAIT)).click();

            // click send verification link button
            // check the email for the link
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/button')),WAIT)).click();
            const t1 = performance.now();
            const ms = t1 - t0;
            times.push(ms);
            console.log(`Run ${i}/${runs}: ${ms.toFixed(1)} ms`);
            await driver.sleep(5000);
        } catch(e) {
            failures++;
            console.log(`Run ${i}/${runs}: FAIL -> ${e.message}`);
        } finally {
            await driver.quit();
        }
    }

    if (times.length) {
        const sum = times.reduce((a, b) => a + b, 0);
        const avg = sum / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);

        console.log("\n=== RESULTS ===");
        console.log(`Runs: ${runs}`);
        console.log(`Success: ${times.length}`);
        console.log(`Failures: ${failures}`);
        console.log(`Avg: ${avg.toFixed(1)} ms`);
        console.log(`Min: ${min.toFixed(1)} ms`);
        console.log(`Max: ${max.toFixed(1)} ms`);
    }

}

emailVal();