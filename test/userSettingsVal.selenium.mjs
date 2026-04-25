import { Builder, By, until, Key } from "selenium-webdriver";
import dotenv from "dotenv"
import { error } from 'node:console';
import { send } from "vite";
dotenv.config();

// in the terminal, run the test with 'node test/userSettingsVal.selenium.mjs'

async function testUserSettingsInputs() {
    let driver = await new Builder().forBrowser("chrome").build(); //specific browser to use, 
    await driver.manage().window().maximize();

    const WAIT = 15000; // ms, how long to wait for the element to be located before throwing an error.
    const DELAY = 50;
    const runs = 1;
    const times = [];
    let failures = 0;

    // Invalids
    const invalidNames = ["", "      ", "J@NE", "Jane  ", "Jane3", "1231"];
    const invalidEmails = ["", "      ", "1231", "abc.example.com", "a@b@c@example.com", "just\"not\"right@example.com", "i.like.underscores@but_they_are_not_allowed_in_this_part"];
    const invalidPhones = ["", "      ", "111", "dwad", "12#", "12345678901"];
    const invalidPass = ["", "      ", "simplePass32"];
    const invalidStreet = ["", "      ", "Aw @ Shasta"];
    const invalidCity = ["", "      ", "New Y@rk"];
    const invalidZip = ["", "      ", "john", "222"];

    // Valids (tests edge cases)
    const validName = "Mary Jane";
    const validName2 = "Doe";
    const validID = "deleteTest";
    const validEmail = process.env.REAL_EMAIL;
    const validEmail2 = process.env.REAL_EMAIL2;
    const validPhone = "5557895120";
    const validPass = process.env.REAL_PASSWORD;
    const validPass2 = process.env.REAL_PASSWORD2;
    const validStreet = "12th Ave";
    const validCity = "Site 13";
    const validZip = "98765-1234";

    if (!validEmail || !validPass || !validEmail2 || !validPass2) {
        throw new Error("Missing TEST_EMAIL or TEST_PASSWORD in .env");
    }

    async function testFieldsCSS(field, inputs, btn, click) {
        for(const input in inputs) {
            // clear fields
            await (await driver.wait(until.elementLocated(By.css(field)),WAIT)).sendKeys(Key.chord(Key.CONTROL,"a", Key.DELETE)); 
            // send in the invalid inputs
            await (await driver.wait(until.elementLocated(By.css(field)),WAIT)).sendKeys(inputs[input]);    
            await driver.sleep(DELAY);

            // checks to see if invalid inputs are still invalid
            if (await (await driver.wait(until.elementLocated(By.xpath(btn)),WAIT)).isEnabled() && click) {
                throw new Error("Invalid input passed: " + inputs[input]);
            }
        }
    }
    
    try {
        for (let i = 1; i <= runs; i++) {
        const t0 = performance.now();

        try {
            // launch the application
            await driver.get("http://localhost:5173");

            // go to login and login to account
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/a')),WAIT)).click();
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.css('input[type="email"]')),WAIT)).sendKeys(validEmail);    // enter email
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.css('input[type="password"]')),WAIT)).sendKeys(validPass);   // enter password
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')),WAIT)).click(); // click login
            await driver.sleep(DELAY*50);    // wait for page to load

            // go to user settings
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/div/div/a')),WAIT)).click();
            await driver.sleep(DELAY);

            // input validation for settings and confirm
            // -------NAME-----------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[1]/div/div[1]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            let confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[1]/div/div[2]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="First Name"]', [validName], confirmBtn, false);
            await testFieldsCSS('input[placeholder="Last Name"]', [validName2], confirmBtn, false);
            await testFieldsCSS('input[placeholder="First Name"]', invalidNames, confirmBtn, true);
            await testFieldsCSS('input[placeholder="First Name"]', [validName], confirmBtn, false); // replace after done testing
            await testFieldsCSS('input[placeholder="Last Name"]', invalidNames, confirmBtn, true);
            await testFieldsCSS('input[placeholder="Last Name"]', [validName2], confirmBtn, false); // replace after done testing
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY);  // Name: updated


            // -----EMAIL--------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[3]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[4]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="Enter Password to confirm changes"]', [validPass], confirmBtn, false);
            await testFieldsCSS('input[placeholder="New Email"]', [validEmail], confirmBtn, false); // if the button is available, it will still fail since it is the same email
            await testFieldsCSS('input[placeholder="New Email"]', invalidEmails, confirmBtn, true);
            await testFieldsCSS('input[placeholder="New Email"]', [validEmail2], confirmBtn, false);    // replace
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY*50);  // Email: link sent


            // -----PHONE-------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[5]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[6]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="Phone Number"]', invalidPhones, confirmBtn, true);
            await testFieldsCSS('input[placeholder="Phone Number"]', [validPhone], confirmBtn, false);
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY);  // Phone: Update

            
            // ------PASSWORD-------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[7]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[8]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="Current Password"]', [validPass2], confirmBtn, false);  // keep cur pass wrong
            await testFieldsCSS('input[placeholder="New Password"]', invalidPass, confirmBtn, true);
            await testFieldsCSS('input[placeholder="Current Password"]', [validPass], confirmBtn, false);   // cur pass right
            await testFieldsCSS('input[placeholder="New Password"]', [validPass2], confirmBtn, false);      // enter new password
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY*50);  // Password: Update
            

            // ----LOGOUT AND LOGIN WITH NEW PASS------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/div/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // go to login and login to account
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/a')),WAIT)).click();
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.css('input[type="email"]')),WAIT)).sendKeys(validEmail);    // enter email
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.css('input[type="password"]')),WAIT)).sendKeys(validPass2);   // enter password
            await driver.sleep(DELAY);
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')),WAIT)).click(); // click login
            await driver.sleep(DELAY*50);    // wait for page to load
            // go to user settings
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/div/div/a')),WAIT)).click();
            await driver.sleep(DELAY);


            // -----ADDRESS----------
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[1]/div/div[9]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[1]/div/div[10]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="Street"]', [validStreet], confirmBtn, false);
            await testFieldsCSS('input[placeholder="City"]', [validCity], confirmBtn, false);
            await testFieldsCSS('input[placeholder="ZIP Code"]', [validZip], confirmBtn, false);
            // state button
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[1]/div/div[10]/div/div[1]/div[3]/div')),WAIT)).click();
            await (await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[3]/ul/li[5]')),WAIT)).click();
            // test invalids
            await testFieldsCSS('input[placeholder="Street"]', invalidStreet, confirmBtn, true);
            await testFieldsCSS('input[placeholder="Street"]', [validStreet], confirmBtn, false); // replace
            await testFieldsCSS('input[placeholder="City"]', invalidCity, confirmBtn, true);
            await testFieldsCSS('input[placeholder="City"]', [validCity], confirmBtn, false); // replace
            await testFieldsCSS('input[placeholder="ZIP Code"]', invalidZip, confirmBtn, true);
            await testFieldsCSS('input[placeholder="ZIP Code"]', [validZip], confirmBtn, false); // replace
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY);  // Address: Update


            // ----REVERT PASSWORD-----
            await (await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[7]/div/div[2]/button')),WAIT)).click();
            await driver.sleep(DELAY);
            // fill with valid first
            confirmBtn = '//*[@id="root"]/div[1]/div/div[1]/div[2]/div/div[8]/div/div[2]/button[2]';
            await testFieldsCSS('input[placeholder="Current Password"]', [validPass2], confirmBtn, false);  // keep cur pass wrong
            await testFieldsCSS('input[placeholder="New Password"]', [validPass], confirmBtn, false);      // enter new password
            await (await driver.wait(until.elementLocated(By.xpath(confirmBtn)),WAIT)).click();
            await driver.sleep(DELAY*50);  // Password: Update 
        
            // // wait 0.5 seconds
            await new Promise(r => setTimeout(r, 5000));
            const t1 = performance.now();
            const ms = t1 - t0;
            times.push(ms);
            console.log(`Run ${i}/${runs}: ${ms.toFixed(1)} ms`);
        } catch (e) {
            failures++;
            console.log(`Run ${i}/${runs}: FAIL -> ${e.message}`);
            }
        }
    } finally {
    await driver.quit();
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


testUserSettingsInputs();