# Fogarty Onsite Generator Service Website
<img src="https://github.com/Cris4110/FogartyGeneratorServices/blob/main/public/Fogarty%20Generator%20Service%20Logo%20Design.png" width="400" />
Definition: Fogarty Onsite Generator Service Website is a portal that replaces the clients call and text business, giving the customers the opportunity to schedule appointments, request quotes, make purchase requests, and much more.<br><br>

Purpose: Fogarty Onsite Generator Service primarily runs through a text and call model which leads to many issues. Customers cannot reliably get help with their generator needs through these promotions, which leads to overbooked schedules and potentially missed clients. This is a solution that provides resources to customers and helps reduce reliance on this primary source of contact. By creating this website, customers can view his services, book appointments, read reviews, view available items, and strengthen his independent online presence.


## Built Tools
- **Frontend:** React, TypeScript, MUI Library, Node.js
- **Backend:** MongoDB
- **Other tools**: Firebase, S3, Twilio, Wave Integration
- **Version Control:** GitHub

## Team
- Eduardo Cordon      - cordonpgm@gmail.com
- Cristian Magallon   - cristianmagallon@csus.edu
- Lia Nguyen          - lnguyen9520@gmail.com
- Heer Tandel         - heertandel@csus.edu
- Matthew Collins     - matthewcollins2@csus.edu
- Henry Hill          - henryhill@csus.edu
- Victor Avetisov     - victoravetisov@csus.edu
- Cameron Edwards     - camjam0403@gmail.com

## Table of Contents
- [Installation](#installation)
- [Current Features](#features)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Developer Instructions](#developer-instructions)

## Installation

To set up this project, follow the steps below:

1. Installing Nodejs:
    - Download and install Node.js from [here](https://nodejs.org/en/)
    - Once installed, open your command prompt and confirm the installation by running the commands below. Both of which should print the currently installed version number
    ```bash
    node -v
    npm -v
    ```
2. Clone the repository from GitHub:
    ```bash
    git clone https://github.com/Cris4110/FogartyGeneratorServices.git
    ```
3. Move terminal into FogartyGeneratorServices folder
   ```bash
    cd FogartyGeneratorServices
    ```
4. Install project dependencies
   Note that this may take a few minutes. Type the command below and the installation of all dependecies will begin.
    ```bash
    npm install
    ```

5. Environment Configuration
    Before running the project, you must set up your environment variables. Create a `.env` file in the root directory and add the following keys:
    ```env
    # Database
    MONGO_URI=your_mongodb_connection_string
    
    # Authentication
    JWT_SECRET=your_jwt_secret
    
    # Twilio (SMS)
    TWILIO_ACCOUNT_SID=your_sid
    TWILIO_AUTH_TOKEN=your_token
    TWILIO_PHONE_NUMBER=your_twilio_number
    
    # Firebase
    VITE_FIREBASE_API_KEY=api-key
    VITE_FIREBASE_AUTH_DOMAIN=authdomain
    VITE_FIREBASE_PROJECT_ID=projectid
    VITE_FIREBASE_STORAGE_BUCKET=storagebucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=messagingsenderid
    VITE_FIREBASE_APP_ID=appid
    VITE_FIREBASE_MEASUREMENT_ID=measurementid

    # AWS
    AWS_ACCESS_KEY_ID=access_key_id
    AWS_SECRET_ACCESS_KEY=secret_access_key
    AWS_REGION=region
    AWS_BUCKET=bucket

    # Courier
    COURIER_API_KEY=courier_api_key
    COURIER_SMS_APPOINTMENT_ID=courier_sms_appointment_id
    COURIER_SMS_QUOTE_ID=courier_sms_quote_id
    COURIER_SMS_PARTS_ID=courier_sms_parts_id

    # Wave Integration
    WAVE_TOKEN=your_wave_token
    WAVE_BUSINESS_ID=your_wave_business_id
    WAVE_PRODUCT_ID1=your_wave_product_id1
    WAVE_PRODUCT_ID2=your_wave_product_id2

    #Twilio
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    ADMIN_PHONE=your_admin_phone
    TWILIO_PHONE_NUMBER=your_twilio_phone_number

    # MailTrap
    MAILTRAP_HOST=your_mailtrap_host
    MAILTRAP_PORT=your_mailtrap_port
    MAILTRAP_USER=your_mailtrap_user
    MAILTRAP_PASS=your_mailtrap_pass
    ```  

6. Running the project
    Open two terminals. On each terminal, type the following.
    ```bash
    npm run dev
    npm run server
    ```
7. Opening the project

When ```npm run dev``` begins, a local host link will be given. You can open the link by holding ```Ctrl``` and then clicking the link. This will open the link in your default web browser. 
You can also simply copy and paste the link in any browser you want.

**Important notes**:
You must keep the command prompt window open in order for the website to function correctly. Some assets and features may not load or work properly if closed. 
Keep in mind website does not connect to the server for security purposes. See the **Security** section below for more details.

## Features 
Our platform includes a full set of features designed to give users an easy way to explore services, request quotes, manage their accounts, and purchase products. The system ensures a smooth experience even for visitors who are not logged in, while still offering more advanced options for registered users.

**General Access**
- FAQ Page – Users can browse frequently asked questions for quick help.
- Contact Page – Users can reach out directly for inquiries or support.
- Homepage - Users can view the homepage to easily request appointments, request quotes, and view reviews.

![This is an alt text.](/src/assets/githubsnips/homepage.png " Homepage")

![This is an alt text.](/src/assets/githubsnips/aboutuspage.png "About us page")

**Profile & Account**
- User Registration – Create an account using a simple signup process.
- User Login – Secure login system to access personalized features.

![This is an alt text.](/src/assets/githubsnips/createaccount.png "Create Account page")

**Profile & Account**
- Request Services (Logged-in Users) – Users can request maintenance, repair, or other services.

![This is an alt text.](/src/assets/githubsnips/appointments.png "Appointments page")

Alongside the user facing functionality, we provide a powerful admin dashboard that allows the business to manage inventory, monitor service requests, and maintain the platform efficiently. Both sides work together to support real time operations and ensure accuracy.

**Inventory Management**
- Add new parts or generators.
- Edit existing product details.
- Remove outdated or unavailable inventory.

**Current Stock**
- Users can view all available items in stock.

![This is an alt text.](/src/assets/githubsnips/inventory.png "Current Stock")

**Service Request Management**
- Accept service requests.
- Hold requests for review or follow-up.
- Decline requests when needed.

**Platform Control**
- Keep track of user activity and incoming quote request.
- Manage system data and keep product availability up to date.

![This is an alt text.](/src/assets/githubsnips/admindashboard.png "Admin dashboard")

**Reviews**
- Users can view and create reviews.

**Quotes**
- An account-free system for customers to submit quote requests describing their general needs. These requests will be reviewed by admins to provide a rough cost estimate.

**Wave Integration**
- An account-free system for customers to submit quote requests describing their general needs. These requests will be reviewed by admins to provide a rough cost estimate.

![This is an alt text.](/src/assets/githubsnips/wave.png "wave.png")

## Security
Passwords are hashed and never stored in plaintext. Firebase authentication is used to verify users. 

**Authentication and Authorization**
- Secure registration and login using server-side validation and hashed passwords 
- API keys are used for backend services
- .env files contain confidential information, so do not commit .env files or anything that compromises security

**Role-Based Access Control**
- Only admins have access to change/manage appointments, inventory, and users
- Standard users can request appointments/quotes and purchase parts/generators

## API Documentation

All API responses follow:
```
{
  "success": true,
  "message": "Description",
  "data": {}
}
```
Generator Equipment API response example:
```
{
"_id": "69141edd7a5dc4d8798112fb",
"genID": "GEN-0001",
"name": "Generac Guardian 22kW",
"type": "Standby (Residential, NG/LP)"
}
```


👤 User API
|Method |Endpoint|  Description|    Auth|
|-------|--------|-------------|:-----------:|
|GET    |/api/users |Get all users| Admin|
|GET    |/api/users/:id|    Get single| User|  
|PUT    |/api/users/:id|    Update user|User    |
|DELETE |/api/users/:id|    Delete user|    Admin|


📅 Appointment API
|Method |Endpoint|  Description|    Auth|
|-------|--------|-------------|:-----------:|
|POST   |/api/appointments  |Create appointment request|    User
|GET    |/api/appointments  |Get all pending appointments (old requests older than the configured retention will be deleted automatically)|  Admin
|PUT    |/api/appointments/:id/approve| Approve appointment|    Admin
|PUT    |/api/appointments/:id/deny|    Deny/delete appointment|    Admin
|DELETE |/api/appointments/:id|Remove appointment   |Admin|

**Configuration:**
- Retention period for quotes and appointments is stored in the `pagecontent` collection under the names `quoteRetentionDays` and `appointmentRetentionDays`. Values must be integer days between 30 and 365; the admin interface under "Edit Page Content" lets you update them.


🛠️ Generator API
|Method |Endpoint|  Description|    Auth|
|-------|--------|-------------|:-----------:|
|GET    |/api/generators|   List generator models| User |
|POST   |/api/generators    |Add a generator model| Admin|
|PUT    |/api/generators/:id|   Update generator|   Admin|
|DELETE |/api/generators/:id|   Delete generator|   Admin|


📦 Parts / Inventory API
|Method |Endpoint|  Description|    Auth|
|-------|--------|-------------|:-----------:|
|GET    |/api/parts |Get all parts  |Admin|
|POST   |/api/parts|    Create a new part entry |Admin|
|PUT    |/api/parts/:id|    Update part information |Admin|
|DELETE |/api/parts/:id|    Delete a part|  Admin|


🗄️ Database Schema (MongoDB)


Fogarty Onsite Generator Services uses MongoDB in JSON Format.


👤 Users Collection
```
{
  "_id": "ObjectId",
  "userID": "string",
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "phoneNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipcode": "string"
  },
  "role": "user | admin",
  "createdAt": "Date"
}
```


📅 Appointments Collection
```
{
  "_id": "ObjectId",
  "userID": "string",
  "appointmentTime": "Date",
  "description": "string",
  "generatorModel": "string",
  "serialNumber": "string",
  "status": "pending | approved | denied",
  "address": "string",
  "createdAt": "Date"
}
```


🛠️ Generators Collection
```
{
  "_id": "ObjectId",
  "manufacturer": "string",
  "model": "string",
  "serialRange": "string",
  "fuelType": "string",
  "powerRating": "string",
  "notes": "string"
}
```


📦 Parts Collection
```
{
  "_id": "ObjectId",
  "partName": "string",
  "partNumber": "string",
  "quantity": "number",
  "location": "string",
  "compatibleModels": ["string"]
}
```


🧩 ERD — Entity Relationship Diagram
![This is an alt text.](/src/assets/githubsnips/erd.png "Current ERD")

🧪 API Testing

Test endpoints using:

Insomnia
![This is an alt text.](/src/assets/Insomnia_For_ReadME.png "Insomnia Testing Example")

## Testing
This project utilizes both **Playwright** and **Selenium** for automated testing.

### Playwright Testing
Playwright is used for robust end-to-end testing and verifying user workflows.
Tests are located in the `tests/` folder.

**Running Playwright Tests:**
1. Run all Playwright tests:
    ```bash
    npx playwright test
    ```
2. Run tests with the Playwright UI:
    ```bash
    npx playwright test --ui
    ```

You can also run specific test scripts defined in `package.json`, for example:
```bash
npm run test:appointment
npm run test:quote
npm run test:twilio
```

### Selenium Testing
Systems test environment:

    Node Version - v22.18.0
    Npm Version - v10.9.3
    Selenium webdriver Version - v4.43.0
    Browser - Google Chrome, v147.7727
    ChromeDriver - v147.0.7727.117 
    
Selenium tests are located in the `test` folder. To run the selenium tests do the following:

    Run server using 
        Npm run serve
    Run site using
        Npm run dev
    Run test by doing 
        Node .\test\”insert which file to test”
        
Example:

    Node .\test\Invoice-selenium-test.mjs
    
Results:

![This is an alt text.](/test/Invoice-testing-image.png "Invoice Testing Example")

## Deployment
Hosting is done via Firebase App Hosting. To get started with Deployment, follow the steps below.
1. Create an account with firebase and create a project. https://firebase.google.com/
2. At the navigation table, hover over "Hosting & Serverless," and select "App Hosting."
3. Click on Create Backend.
4. Choose a primary region.
5. Import your GitHub repository.
6. Choose the live branch for deployment and the app root directory.
7. Create a unique ID for your backend. The ID will be placed in front of the project name for the live URL. Can create a custom domain for the URL after setting up app hosting.
8. Input every variable and value from your .env/secrets.
9. Select "Create a new Firebase web app" and click "Finish and Deploy." After a few minutes, the website will be deployed. Check the status by clicking "view."

Firebase will redeploy after commiting changes to the live branch and reroll back to the last successful deployment if the new deployment has failed.
  
## Developer Instructions

### Project Structure
- **Frontend (`/src`)**: Built with React, TypeScript, and Vite. Contains UI components, pages, and assets.
- **Backend (`/`, `/models`, `/routes`, `/controller`)**: Node.js Express server using Mongoose for MongoDB. 

### Available Scripts
You can run the following scripts from the root directory using `npm run <script_name>`:
- `dev`: Starts the Vite development server for the frontend.
- `server`: Starts the Express backend server.
- `build`: Compiles TypeScript and builds the Vite application for production.
- `lint`: Runs ESLint to check for code quality and formatting issues.
- `test:appointment` / `test:quote` / `test:twilio`: Runs specific automated test suites.

### Contribution Guidelines
1. **Branching**: Create a new branch for your feature or bugfix (e.g., `feature/add-new-dashboard` or `bugfix/fix-login-error`).
2. **Linting**: Before committing your code, run `npm run lint` to ensure it meets the project's formatting standards.
3. **Testing**: Run the relevant Playwright or Selenium tests to ensure your changes haven't broken existing functionality. 
4. **Pull Requests**: Submit a PR to the `main` branch with a clear description of the changes made.
