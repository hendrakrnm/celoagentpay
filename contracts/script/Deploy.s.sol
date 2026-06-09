// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {CeloPayAgent} from "../src/CeloPayAgent.sol";
import {GroupPayment} from "../src/GroupPayment.sol";
import {PaymentScheduler} from "../src/PaymentScheduler.sol";

contract DeployScript is Script {
    // Mainnet cUSD: 0x765DE816845861e75A25fCA122bb6898B8B1282a
    // Alfajores cUSD: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address cUSDAddress;
        uint256 chainId = block.chainid;

        if (chainId == 42220) {
            // Celo Mainnet
            cUSDAddress = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
            console.log("Deploying to Celo Mainnet (chainId: 42220)");
        } else if (chainId == 44787) {
            // Celo Alfajores Testnet
            cUSDAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
            console.log("Deploying to Celo Alfajores Testnet (chainId: 44787)");
        } else {
            revert("Unsupported network");
        }

        vm.startBroadcast(deployerPrivateKey);

        // Deploy CeloPayAgent
        CeloPayAgent celoPayAgent = new CeloPayAgent(cUSDAddress);
        console.log("CeloPayAgent deployed to:", address(celoPayAgent));

        // Deploy GroupPayment
        GroupPayment groupPayment = new GroupPayment(cUSDAddress);
        console.log("GroupPayment deployed to:", address(groupPayment));

        // Deploy PaymentScheduler
        PaymentScheduler paymentScheduler = new PaymentScheduler(cUSDAddress);
        console.log("PaymentScheduler deployed to:", address(paymentScheduler));

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("Network ChainID:", chainId);
        console.log("cUSD Address:", cUSDAddress);
        console.log("CeloPayAgent:", address(celoPayAgent));
        console.log("GroupPayment:", address(groupPayment));
        console.log("PaymentScheduler:", address(paymentScheduler));
    }
}
