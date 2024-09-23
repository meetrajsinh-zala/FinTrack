# FinTrack
# FinTrack - Personal Finance Tracking Web App

FinTrack is a personal finance tracking web app designed to help users monitor their financial activity, manage transactions, and connect bank accounts using Plaid and Dwolla for seamless financial integration. The app is built with React on the frontend and Django on the backend, ensuring a robust and efficient user experience.

## Features

- **User Authentication**: Secure login and signup using JWT-based authentication.
- **Transaction Management**: Add, view, and track transactions with details such as amount, date, category, and status.
- **Bank Account Integration**: Connect and manage bank accounts via Plaid and Dwolla APIs.
- **Funding Sources**: Create and handle funding sources for connected accounts.
- **Dynamic Dashboard**: View a summary of financial data, including recent transactions and account balances.
- **Pagination**: Load transactions dynamically with the option to load more.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: For styling the app with a utility-first approach.
- **Shadcn**: UI Library

### Backend

- **Django**: A high-level Python web framework.
- **Django Rest Framework (DRF)**: For building RESTful APIs.
- **JWT Authentication**: JSON Web Token-based authentication.
- **SQLite**: Default database for local development.
  
### APIs

- **Plaid**: For bank account linking and financial data aggregation.
- **Dwolla**: For handling funding sources and ACH payments.

## Setup Instructions

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/fintrack.git
    cd fintrack
    ```

2. **Backend Setup (Django)**:
    - Create a virtual environment:
        ```bash
        python -m venv env
        source env/bin/activate   # For Windows: env\Scripts\activate
        ```
    - Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    - Set up environment variables for Django, Plaid, and Dwolla API keys in `.env` file:
        ```
        PLAID_CLIENT_ID=your-client-id
        PLAID_SECRET=your-secret
        DWOLLA_KEY=your-key
        DWOLLA_SECRET=your-secret
        ```
    - Run migrations:
        ```bash
        python manage.py migrate
        ```
    - Start the server:
        ```bash
        python manage.py runserver
        ```

3. **Frontend Setup (React)**:
    - Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    - Install dependencies:
        ```bash
        npm install
        ```
    - Start the React development server:
        ```bash
        npm run dev 
        ```

4. **Database Setup**:
    - Use the default SQLite database or configure another database (e.g., PostgreSQL) in the Django settings.

## Usage

- Register an account and log in to start tracking your finances.
- Connect your bank account via the Plaid integration.
- Manage your transactions, view recent activity, and create funding sources using Dwolla.
