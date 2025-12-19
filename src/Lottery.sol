// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
// 1. Import Automation Interface
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// 2. Inherit from AutomationCompatibleInterface
contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    error Lottery_NotEnoughEthEntered();
    error Lottery_TransferFailed();
    error Lottery_LotteryNotOpen();
    error Lottery_UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 lotteryState);

    enum LotteryState {
        OPEN,
        CALCULATING
    }

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private immutable i_entranceFee;
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    
    // 3. New Variables for Automation
    uint256 private immutable i_interval; // How often to run (in seconds)
    uint256 private s_lastTimeStamp;      // When was the last run?

    address payable[] private s_players;
    address private s_recentWinner;
    LotteryState private s_lotteryState;

    event LotteryEnter(address indexed player);
    event WinnerPicked(address indexed winner);
    event RequestedWinner(uint256 indexed requestId);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 keyHash,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval // 4. Add interval to constructor
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        i_interval = interval;
        s_lastTimeStamp = block.timestamp; // Start the clock!
    }

    function enterLottery() public payable {
        if (msg.value < i_entranceFee) {
            revert Lottery_NotEnoughEthEntered();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery_LotteryNotOpen();
        }
        s_players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    // 5. checkUpkeep: The Logic/Brain
    // Chainlink nodes call this constantly (off-chain) to see if they should trigger the lottery.
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool isOpen = LotteryState.OPEN == s_lotteryState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        
        // Only return TRUE if all these are true
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "0x0");
    }

    // 6. performUpkeep: The Action (Replaces pickWinner)
    // This is what actually runs on-chain.
    function performUpkeep(bytes calldata /* performData */) external override {
        // We re-validate the conditions here to be safe
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery_UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        }

        s_lotteryState = LotteryState.CALCULATING;
        
        // Reset the timer for the next round
        s_lastTimeStamp = block.timestamp; 

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RequestedWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] calldata randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        s_players = new address payable[](0);
        s_lotteryState = LotteryState.OPEN;
        // Timer was already reset in performUpkeep

        emit WinnerPicked(recentWinner);

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Lottery_TransferFailed();
        }
    }

    /* Getter Functions */
    function getEntranceFee() public view returns (uint256) { return i_entranceFee; }
    function getPlayer(uint256 index) public view returns (address) { return s_players[index]; }
    function getRecentWinner() public view returns (address) { return s_recentWinner; }
    function getLotteryState() public view returns (LotteryState) { return s_lotteryState; }
    function getNumberOfPlayers() public view returns (uint256) { return s_players.length; }
    function getLastTimeStamp() public view returns (uint256) { return s_lastTimeStamp; }
    function getInterval() public view returns (uint256) { return i_interval; }
}