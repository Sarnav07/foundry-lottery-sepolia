check out the web : https://foundry-lottery-sepolia-jv4w.vercel.app/



# 🎰 Decentralized Lottery (Sepolia)

## 👋 About This Project
Hi! This is **my very first full-stack dApp**. 

I built this project to bridge the gap between writing Smart Contracts and actually interacting with them on a frontend. I wanted to move beyond simple "Hello World" tutorials and build a system that handles real logic, money (ETH), and randomness.

The core idea is simple: **A fully decentralized lottery.**
Users enter by paying a ticket price. After a set time, the contract automatically picks a winner using verifiable randomness and sends them the entire prize pool. No admin, no rigging, just code.

## 🛠️ Tech Stack
I used a modern stack to build this, focusing on speed and security.

**Backend (Smart Contracts):**
- **Solidity:** The core logic.
- **Foundry:** For blazing fast testing and deployment.
- **Chainlink VRF:** To ensure the random winner selection is tamper-proof.
- **Chainlink Automation:** To automatically trigger the winner selection without manual admin input.

**Frontend:**
- **React.js (Vite):** For a fast, responsive UI.
- **Ethers.js (v6):** To connect the website to the blockchain.
- **Tailwind CSS:** For styling (built the dashboard look from scratch!).

---

## 🚀 How to Run This Project Locally

Since this is a Web3 project, you can run the entire thing on your local machine and interact with the **Sepolia Testnet**.

### Prerequisites
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Foundry](https://getfoundry.sh/) (for smart contracts)
* [MetaMask](https://metamask.io/) browser extension

### Step 1: Clone the Repository
```bash
git clone [https://github.com/Sarnav07/foundry-lottery-sepolia.git](https://github.com/Sarnav07/foundry-lottery-sepolia.git)
cd foundry-lottery-sepolia
Step 2: Setup the Smart Contract
Install Dependencies:

Bash

forge install
Setup Environment Variables: Create a .env file in the root folder and add your Sepolia RPC URL and Private Key:

Code snippet

SEPOLIA_RPC_URL=[https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY](https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY)
PRIVATE_KEY=your_private_key_here
Deploy to Sepolia: Run this command to deploy the contract to the testnet:

Bash

source .env
forge script script/DeployLottery.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
🚨 IMPORTANT: Copy the Contract Address from the terminal output after deployment. You will need it for the next step.

Step 3: Setup the Frontend
Navigate to the frontend folder:

Bash

cd frontend
npm install
Connect the Frontend to Your Contract:

Open src/constants.js (or App.jsx depending on where you saved it).

Find the variable contractAddresses.

Paste your new Contract Address inside the entry for Sepolia (11155111).

Start the Website:

Bash

npm run dev
Step 4: Play!
Open your browser and go to http://localhost:5173.

Connect your MetaMask wallet (make sure you are on the Sepolia Network).

Click "Buy Ticket" to send a transaction!

🧠 What I Learned
Building this was a huge learning curve. Here are the biggest takeaways:

Foundry vs Hardhat: I really enjoyed using Solidity for writing deployment scripts instead of JavaScript. It feels much more native.

State Management: Syncing the blockchain state (slow) with the React frontend state (fast) was tricky, especially handling "Pending" transactions.

The "0 ETH" Error: I spent a good amount of time debugging why my frontend wasn't fetching data, only to realize I was pointing to the wrong contract address. Lesson learned: always double-check your constants!

🔜 Future Improvements
[ ] Add support for multiple winners (1st, 2nd, 3rd place).

[ ] Allow users to buy multiple tickets in one transaction.

[ ] Deploy the frontend to Vercel/IPFS.

Built with ❤️ by Sarnav. If you spot any bugs, feel free to open an issue—I'm still learning!
