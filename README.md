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
- **Foundry:** For blazing fast testing and deployment (moved away from Hardhat for this one!).
- **Chainlink VRF:** To ensure the random winner selection is tamper-proof.
- **Chainlink Automation:** To automatically trigger the winner selection without manual admin input.

**Frontend:**
- **React.js (Vite):** For a fast, responsive UI.
- **Ethers.js (v6):** To connect the website to the blockchain.
- **Tailwind CSS:** For styling (built that dashboard look from scratch!).

## 🌟 Key Features
- **Buy Tickets:** Users can enter the raffle by sending 0.01 Sepolia ETH.
- **Live Updates:** The UI updates the "Players" count and "Prize Pool" in real-time.
- **Verifiably Random:** The winner isn't picked by me—it's picked by Chainlink's random number generator.
- **Automated:** The lottery runs itself. When the timer hits zero, a winner is picked and paid automatically.
- **Wallet History:** Keeps track of your recent transactions locally so you can see your entries.

## 🚀 How to Run Locally

Since this is a full-stack project, you'll need two terminals open.

### Prerequisites
- [Foundry](https://getfoundry.sh/) installed.
- [Node.js](https://nodejs.org/) & NPM installed.
- A customized `.env` file (see below).

### 1. Clone & Setup Backend
```bash
git clone [https://github.com/Sarnav07/foundry-lottery-sepolia.git](https://github.com/Sarnav07/foundry-lottery-sepolia.git)
cd foundry-lottery-sepolia
forge install
2. Deploy Contract (Sepolia)
Make sure you have a .env file with SEPOLIA_RPC_URL and PRIVATE_KEY.

Bash

source .env
forge script script/DeployLottery.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
After deployment, copy the contract address from the terminal.

3. Setup Frontend
Bash

cd frontend
npm install
Open constants.js and replace the contract address with the one you just deployed.

Bash

npm run dev
Visit http://localhost:5173 and connect your MetaMask!

🧠 What I Learned
Building this was a huge learning curve. Here are the biggest takeaways:

Foundry vs Hardhat: I really enjoyed using Solidity for writing deployment scripts instead of JavaScript. It feels much more native.

State Management: syncing the blockchain state (slow) with the React frontend state (fast) was tricky, especially handling "Pending" transactions.

The "0 ETH" Error: I spent a good amount of time debugging why my frontend wasn't fetching data, only to realize I was pointing to the wrong contract address. Lesson learned: always double-check your constants!

🔜 Future Improvements
[ ] Add support for multiple winners (1st, 2nd, 3rd place).

[ ] Allow users to buy multiple tickets in one transaction.

[ ] Deploy to a mainnet (Optimism or Arbitrum).