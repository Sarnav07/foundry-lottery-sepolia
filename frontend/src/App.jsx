import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';
import { 
  LayoutDashboard, Gamepad2, Users, BarChart3, User, HelpCircle, 
  Wallet, Ticket, Trophy, ArrowRight, Bitcoin, Timer,
  Loader2, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

function App() {
  // --- BLOCKCHAIN STATE ---
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0x00...");
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState("0.00");

  // --- CONNECT & DATA FETCHING ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await _provider.getSigner();
        const chainId = "11155111"; // Or derive it dynamically
        const lotteryAddress = CONTRACT_ADDRESS[chainId][0];
        const lottery = new ethers.Contract(lotteryAddress, CONTRACT_ABI, signer);
        
        setProvider(_provider);
        setContract(lottery);
        const address = await signer.getAddress();
        setAccount(address);
        
        // Get user balance for the "Wallet" card
        const bal = await _provider.getBalance(address);
        setUserBalance(ethers.formatEther(bal));
        
        updateUI(lottery);
      } catch (error) {
        console.error("Connection Error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateUI = async (contractInstance) => {
    try {
      const fee = await contractInstance.getEntranceFee();
      const players = await contractInstance.getNumberOfPlayers();
      const winner = await contractInstance.getRecentWinner();

      setEntranceFee(ethers.formatEther(fee));
      setNumPlayers(players.toString());
      setRecentWinner(winner);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // --- ACTIONS ---
  const enterLottery = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.enterLottery({ value: ethers.parseEther(entranceFee) });
      await tx.wait();
      updateUI(contract);
      alert("Success! You have entered the raffle.");
    } catch (error) {
      console.error(error);
      alert("Transaction Failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const pickWinner = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.pickWinner(); 
      await tx.wait();
      updateUI(contract);
      alert("Winner Picked!");
    } catch (error) {
      console.error(error);
      alert("Error picking winner (Owner only?)");
    } finally {
      setIsLoading(false);
    }
  };

  // --- AUTO-CONNECT EFFECT ---
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnection();

    if(window.ethereum) {
      window.ethereum.on('accountsChanged', connectWallet);
    }
  }, []);

  // --- UI RENDER ---
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* 1. SIDEBAR (Left Panel) */}
      <aside className="w-64 bg-white hidden md:flex flex-col border-r border-gray-100">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400"></div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Decentralized<br/>Lottery</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Gamepad2 size={20}/>} label="Games" />
          <NavItem icon={<Users size={20}/>} label="Syndicates" />
          <NavItem icon={<BarChart3 size={20}/>} label="Results" />
          <NavItem icon={<User size={20}/>} label="Profile" />
          <NavItem icon={<HelpCircle size={20}/>} label="Support" />
        </nav>

        <div className="p-8 text-xs text-gray-400">
          Smart Contract Details <br/> Privacy Policy
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white">
        
        {/* TOP BAR: Mobile Header & Connect Button */}
        <header className="flex justify-between items-center mb-8 relative z-50">
          {/* Spacer to push button to the right */}
          <div></div> 
          
          <div className="flex gap-4">
            {!account ? (
              <button 
                onClick={connectWallet} 
                className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
              >
                Connect Wallet
              </button>
            ) : (
              <div 
                className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full cursor-pointer group hover:bg-red-50 transition-colors border border-transparent hover:border-red-100" 
                onClick={() => setAccount(null)}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-red-500 transition-colors"></div>
                <span className="text-sm font-semibold group-hover:hidden text-slate-700">
                  {account.substring(0,6)}...{account.substring(account.length-4)}
                </span>
                <span className="text-sm font-bold text-red-500 hidden group-hover:block">
                  Disconnect
                </span>
              </div>
            )}
          </div>    
        </header>

        {/* HERO SECTION */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-900 to-blue-600 text-white p-10 md:p-16 mb-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>

          <h3 className="text-blue-200 mb-2 font-medium">Current Prize Pool</h3>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tighter drop-shadow-lg">
            {(parseFloat(numPlayers) * parseFloat(entranceFee)).toFixed(3)} ETH
          </h1>

          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-center">
               <span className="block text-2xl font-bold">00</span>
               <span className="text-xs text-blue-200">Hours</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="text-center">
               <span className="block text-2xl font-bold">46</span>
               <span className="text-xs text-blue-200">Mins</span>
            </div>
             <span className="text-2xl font-bold">:</span>
            <div className="text-center">
               <span className="block text-2xl font-bold">22</span>
               <span className="text-xs text-blue-200">Secs</span>
            </div>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1: BUY TICKETS */}
          <div 
            className="md:col-span-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg group hover:scale-[1.02] transition-transform cursor-pointer" 
            onClick={enterLottery}
          >
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold leading-tight">BUY<br/>TICKETS</h3>
                  <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform"/>
                </div>
                <p className="text-blue-100 text-sm mt-2 opacity-80">Decentralized lottery mode improved.</p>
              </div>
              
              <div>
                <p className="text-xs font-medium uppercase tracking-wider opacity-70 mb-2">Cost to Enter</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Ticket size={24} className="text-white"/>
                  </div>
                  <span className="text-3xl font-bold">{entranceFee} ETH</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* CARD 2: MY WALLET */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Wallet</h4>
                <p className="text-gray-500 text-sm mt-1">Balance of your connected account.</p>
              </div>
              <ArrowRight size={18} className="text-gray-300"/>
            </div>
             
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-800">{parseFloat(userBalance).toFixed(4)}</span>
              <span className="text-sm font-bold text-gray-400">ETH</span>
            </div>

            <div className="space-y-3">
              <TransactionRow icon={<ArrowUpRight size={14} className="text-green-600"/>} label="Deposit" date="Jan 31, 2023" amount="+$0.200" color="text-green-600" bg="bg-green-100"/>
              <TransactionRow icon={<ArrowDownLeft size={14} className="text-red-600"/>} label="Ticket Buy" date="Today" amount={`-${entranceFee}`} color="text-red-600" bg="bg-red-100"/>
            </div>
          </div>

          {/* CARD 3: RESULTS */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">RESULTS</h3>
              <ArrowRight size={18} className="text-gray-300"/>
            </div>
            
            <p className="text-gray-500 text-sm mb-6">Winning info for the most recent draw.</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Players</span>
                <div className="flex gap-2">
                  {[...Array(Math.min(5, parseInt(numPlayers)))].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                      P{i+1}
                    </div>
                  ))}
                  {parseInt(numPlayers) > 5 && <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs border border-white shadow-sm">+{parseInt(numPlayers)-5}</div>}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy size={16} className="text-yellow-600"/>
                  <span className="text-xs font-bold text-yellow-700 uppercase">Recent Winner</span>
                </div>
                <p className="font-mono text-slate-800 truncate text-sm">
                  {recentWinner === "0x0000000000000000000000000000000000000000" ? "Pending..." : recentWinner}
                </p>
              </div>
            </div>
          </div>

          {/* ADMIN CARD */}
          <div className="md:col-span-3 bg-slate-900 rounded-3xl p-8 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-1">Admin Controls</h3>
              <p className="text-slate-400 text-sm">Only the contract owner can execute this action.</p>
            </div>
            <button 
              onClick={pickWinner}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin"/> : "End Lottery & Pick Winner"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const TransactionRow = ({ icon, label, date, amount, color, bg }) => (
   <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
         <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
            {icon}
         </div>
         <div>
            <p className="text-sm font-bold text-slate-700">{label}</p>
            <p className="text-xs text-gray-400">{date}</p>
         </div>
      </div>
      <span className={`text-sm font-bold ${color}`}>{amount}</span>
   </div>
);

export default App;