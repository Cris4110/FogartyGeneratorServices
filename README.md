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
## Security
Passwords are hashed and never stored in plaintext. Authentication is handled by our backend, and multi-factor authentication (MFA) provides an additional security layer during login.

**Authentication and Authorization**
- Secure registration and login using server-side validation and hashed passwords 
- Multi-factor authorization (MFA) will also be implemented for logging in and account recovery (Future Development)
- Login tokens expire after 12 hours

**Role-Based Access Control**
    - There is a separate login page specifically for admins
    - Only admins have access to change/manage appointments, inventory, and users
    - Standard users can request appointments/quotes and purchase parts/generators

- API keys are used for backend services
- .env files contain confidential information, so do not commit .env files or anything that compromises security