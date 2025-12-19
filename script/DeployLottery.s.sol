// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {Lottery} from "../src/Lottery.sol";

contract DeployLottery is Script {
    function run() external returns (Lottery) {
        
        uint256 subscriptionId = 78224920352035550526408518512989436770169428253196759877923572038646659625263; 
        address vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
        bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
        uint32 callbackGasLimit = 100000;
        uint256 entranceFee = 0.01 ether;
        
        // NEW: Automation Interval (e.g., 30 seconds for testing)
        uint256 interval = 30; 

        vm.startBroadcast();
        
        Lottery lottery = new Lottery(
            vrfCoordinator,
            entranceFee,
            keyHash,
            subscriptionId,
            callbackGasLimit,
            interval // <--- Passed here
        );
        
        vm.stopBroadcast();

        console.log("----------------------------------------------------");
        console.log("New Lottery Deployed To:", address(lottery));
        console.log("----------------------------------------------------");

        return lottery;
    }
}