import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Builder, By, until } from 'selenium-webdriver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const COURIER_CONFIG = {
    token: process.env.COURIER_API_KEY,
    adminPhone: process.env.ADMIN_PHONE,
};
/* 
    in the terminal, run the test with 'node test/AppointmentRequestAdminText.mjs'
    This tests whether an admin receives an text notification after an appointment request.
*/
async function appointmentRequestAdminEmail() {
    let driver = await new Builder().forBrowser('chrome').build();
    const WAIT = 10000; // ms, how long to wait for the element to be located before throwing an error.
    const runs = 5;
    const times = [];
    let failures = 0;
    const genModel = "genny";
    const serialNum = "123456";
    const description = "testing notifs";
    const id = "testing404nf@gmail.com"; // test email and id
    const password = "SuperCoolUserP@ss?123";

    try {
        // launch the application
        await driver.get("http://localhost:5173");

        // login section
        const signInBtn = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="root"]/header/div/div/div[2]/a')),
        WAIT
        );
        await driver.wait(until.elementIsVisible(signInBtn), WAIT);
        await signInBtn.click();

        const emailEl = await driver.wait(
        until.elementLocated(By.css('input[type="Email"]')),
        WAIT
        );
        await driver.wait(until.elementIsVisible(emailEl), WAIT);
        await emailEl.clear();
        await emailEl.sendKeys(id);

        const passEl = await driver.wait(
        until.elementLocated(By.css('input[type="Password"]')),
        WAIT
        );
        await driver.wait(until.elementIsVisible(passEl), WAIT);
        await passEl.clear();
        await passEl.sendKeys(password);

        const loginBtn = await driver.wait(
        until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')),
        WAIT
        );
        await driver.wait(until.elementIsEnabled(loginBtn), WAIT);
        await loginBtn.click();
        
        await driver.sleep(5000);

        // loop only the appointment request section
        for (let i = 1; i <= runs; i++) {
        const t0 = performance.now();

        try {
            // appointment request section
            const appointBtn = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div[1]/div/div[1]/div[2]/a[1]')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(appointBtn), WAIT);
            await appointBtn.click();
            
            const genModelEl = await driver.wait(
            until.elementLocated(By.css('input[name="generatorModel"]')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(genModelEl), WAIT);
            await genModelEl.clear();
            await genModelEl.sendKeys(genModel);

            const serialEl = await driver.wait(
            until.elementLocated(By.css('input[name="serialNumber"]')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(serialEl), WAIT);
            await serialEl.clear();
            await serialEl.sendKeys(serialNum);

            const descriptionEl = await driver.wait(
            until.elementLocated(By.css('textarea[name="description"]')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(descriptionEl), WAIT);
            await descriptionEl.clear();
            await descriptionEl.sendKeys(description);

            const timeBtn = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/div[1]/div/div[2]/div/div[2]/div/div/div[1]/button')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(timeBtn), WAIT);
            await timeBtn.click();

            const submitBtn = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/div[1]/div/div[1]/form/button')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(submitBtn), WAIT);
            await submitBtn.click();

            await driver.sleep(12000); // wait 12 seconds for text to send

            const isTextDelivered = await verifyTextSent();

            if (isTextDelivered) {
                console.log(`Run ${i}: Text verified in Courier!`);
            } else {
                throw new Error("Text was not found in Courier.");
            }

            const homeBtn = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/header/div/div/div[1]/a[1]')),
            WAIT
            );
            await driver.wait(until.elementIsVisible(homeBtn), WAIT);
            await homeBtn.click();

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

async function verifyTextSent() {
    try {
        // query Courier for messages sent to the admin phone
        const phone = COURIER_CONFIG.adminPhone; 
        const response = await axios.get(
            `https://api.courier.com/messages?recipient=${phone}`,
            {
                headers: {
                    'Authorization': `Bearer ${COURIER_CONFIG.token}`
                }
            }
        );

        const messages = response.data.items;
        if (!messages || messages.length === 0) return false;

        const latest = messages[0];
        const now = Date.now();
        const sentAt = new Date(latest.enqueued).getTime();

        // verify it's recent (last 15 seconds) and not 'CANCELLED' or 'FILTERED'
        const isRecent = (now - sentAt) < 15000;
        const isValidStatus = latest.status !== 'CANCELLED' && latest.status !== 'FILTERED';

        if (isRecent && isValidStatus) {
            console.log(`SMS Verified! Status: ${latest.status} | Sent: ${((now - sentAt)/1000).toFixed(1)}s ago`);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Courier API Error:", error.response?.data || error.message);
        return false;
    }
}

appointmentRequestAdminEmail();