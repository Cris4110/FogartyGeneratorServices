# FogartyGeneratorServices

## Description
This website is Senior Project By CSUS Sacramento students for A client.

## Built Tools
- **Frontend:** React, TypeScript, MUI Library, Node.js
- **Backend:** MongoDB
- **Version Control:** GitHub

## Installation

To set up this project do the following:

1. Installing Nodejs:
    - Download and install Nodejs from [here](https://nodejs.org/en/)
    - Verify the installation by running the following command in the terminal:
    ```bash
    node -v
    npm -v
    ```
2. Clone the repository from GitHub:
    ```bash
    git clone [https://github.com/Cris4110/FogartyGeneratorServices.git]
    npm install
    ```
3. Run code with Nodejs:
    ```bash
    npm run dev
    ```
## Current features 
Our platform includes a full set of features designed to give users an easy way to explore services, request quotes, manage their accounts, and purchase products. The system ensures a smooth experience even for visitors who are not logged in, while still offering more advanced options for registered users.

**General Access**
- FAQ Page – Users can browse frequently asked questions for quick help.
- Contact Page – Users can reach out directly for inquiries or support.
- Request a Free Quote (No Login Needed) – Visitors can submit a quote request even without creating an account.

**Profile & Account**
- User Registration – Create an account using a simple signup process.
- User Login – Secure login system to access personalized features.
- Profile Settings – Logged-in users can update personal details through the settings page.

**Profile & Account**
- Request Services (Logged-in Users) – Users can request maintenance, repair, or other services.
- Buy Generators & Parts On-Hand – A dedicated page to browse available generators and parts currently in stock.
- Track Requests (Optional) – Users can follow the status of their submitted service requests.

Alongside the user facing functionality, we provide a powerful admin dashboard that allows the business to manage inventory, monitor service requests, and maintain the platform efficiently. Both sides work together to support real time operations and ensure accuracy.

**Inventory Management**
- Add new parts or generators.
- Edit existing product details.
- Remove outdated or unavailable inventory.

**Service Request Management**
- Accept service requests.
- Hold requests for review or follow-up.
- Decline requests when needed.

**Platform Control**
- Keep track of user activity and incoming quote request.
- Manage system data and keep product availability up to date.

## Security
Passwords are hashed and never stored in plaintext. Authentication is handled by our backend, and multi-factor authentication (MFA) provides an additional security layer during login.

**Authentication and Authorization**
- Secure registration and login using server-side validation and hashed passwords 
- Multi-factor authorization (MFA) will also be implemented for logging in and account recovery (Future Development)
- Login tokens expire after 12 hours
- API keys are used for backend services
- .env files contain confidential information, so do not commit .env files or anything that compromises security

**Role-Based Access Control**
- There is a separate login page specifically for admins
- Only admins have access to change/manage appointments, inventory, and users
- Standard users can request appointments/quotes and purchase parts/generators
