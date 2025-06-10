# Job CV Manager

Welcome to the Job CV Manager! This application helps you manage and organize job applications and CVs efficiently.

## Installation

To get started with the Job CV Manager, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/divyanshu-bhandari/job-cv-manager.git
    cd job-cv-manager
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env.local` file in the root directory of the project and add the following keys:
    ```plaintext
    GOOGLE_CLIENT_ID=key
    GOOGLE_CLIENT_SECRET=key
    NEXTAUTH_SECRET=key
    NEXTAUTH_URL=http://localhost:8888
    OPENROUTER_API_KEY=key
    FIREBASE_API=key
    ```

    You will need to set up **6** environment variables in total.

4. **Start the development server:**
    ```bash
    npm run dev
    ```

Your application should now be running on `http://localhost:8888`.

Enjoy managing your job applications and CVs with ease!