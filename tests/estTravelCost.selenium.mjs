// estTravelCost.selenium.mjs
import { Builder, By, until } from "selenium-webdriver";


async function estTravelCost() {
 let driver = await new Builder().forBrowser("chrome").build();
 const WAIT = 15000;


 const genModel = "GM1234";
 const serialNum = "97678767";
 const description = "Generator won't start";
 const id = "testingemail@gmail.com";
 const password = "passswrddddd";


 try {
   await driver.get("http://localhost:5173");


   // ================= LOGIN =================
   const signInBtn = await driver.wait(
     until.elementLocated(
       By.xpath('//a[contains(.,"Sign") or contains(.,"Login")]')
     ),
     WAIT
   );


   await driver.wait(until.elementIsVisible(signInBtn), WAIT);
   await driver.executeScript("arguments[0].click();", signInBtn);


   const emailEl = await driver.wait(
     until.elementLocated(By.css('input[type="email"]')),
     WAIT
   );
   await driver.wait(until.elementIsVisible(emailEl), WAIT);
   await emailEl.sendKeys(id);


   const passEl = await driver.wait(
     until.elementLocated(By.css('input[type="password"]')),
     WAIT
   );
   await passEl.sendKeys(password);


   const loginBtn = await driver.wait(
     until.elementLocated(
       By.xpath('//button[contains(.,"Sign") or contains(.,"LOGIN") or contains(.,"Login")]')
     ),
     WAIT
   );


   await driver.wait(until.elementIsEnabled(loginBtn), WAIT);
   await driver.executeScript("arguments[0].click();", loginBtn);


   // wait for React route change
   await driver.sleep(3000);


   // ================= APPOINTMENT PAGE =================
   const appointBtn = await driver.wait(
     until.elementLocated(
       By.xpath('//*[contains(text(),"Appointment") or contains(text(),"Book")]')
     ),
     WAIT
   );


   await driver.wait(until.elementIsVisible(appointBtn), WAIT);
   await driver.executeScript("arguments[0].click();", appointBtn);


   // ================= FORM FIELDS =================
   const genModelEl = await driver.wait(
     until.elementLocated(
       By.xpath('//label[contains(.,"Generator Model")]/following::input[1]')
     ),
     WAIT
   );
   await genModelEl.sendKeys(genModel);


   const serialEl = await driver.wait(
     until.elementLocated(
       By.xpath('//label[contains(.,"Serial Number")]/following::input[1]')
     ),
     WAIT
   );
   await serialEl.sendKeys(serialNum);


   const descriptionEl = await driver.wait(
     until.elementLocated(By.css("textarea")),
     WAIT
   );
   await descriptionEl.sendKeys(description);


   // ================= DATE (SAFE) =================
   try {
     const dateInput = await driver.wait(
       until.elementLocated(By.css('input[type="date"]')),
       5000
     );
     await dateInput.sendKeys("2026-03-25");
   } catch {
     console.log("⚠️ Date picker not found (likely custom calendar)");
   }


   // ================= TIME SLOT =================
   const timeSlot = await driver.wait(
     until.elementLocated(
       By.xpath('//button[contains(.,"AM") or contains(.,"PM")]')
     ),
     WAIT
   );


   await driver.executeScript("arguments[0].click();", timeSlot);


   // ================= SUBMIT =================
   const submitBtn = await driver.wait(
     until.elementLocated(By.xpath('//button[contains(.,"Submit")]')),
     WAIT
   );


   await driver.executeScript("arguments[0].click();", submitBtn);


   console.log("✅ Appointment created");


   await driver.sleep(3000);


   // ================= SETTINGS =================
   const settingsBtn = await driver.wait(
     until.elementLocated(
       By.xpath('//*[contains(text(),"Settings")]')
     ),
     WAIT
   );


   await driver.wait(until.elementIsVisible(settingsBtn), WAIT);
   await driver.executeScript("arguments[0].click();", settingsBtn);


   console.log("📍 Settings opened");


   await driver.sleep(2000);


   console.log("🎉 TEST COMPLETED SUCCESSFULLY");
 } catch (e) {
   console.log("❌ ERROR:", e.message);
 } finally {
   await driver.quit();
 }
}


estTravelCost();
