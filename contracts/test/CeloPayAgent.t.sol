// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {CeloPayAgent} from "../src/CeloPayAgent.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";

contract CeloPayAgentTest is Test {
    CeloPayAgent public agent;
    ERC20Mock public cusd;

    address public owner = address(this);
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");

    uint256 public constant INITIAL_BALANCE = 1000 * 10 ** 18;

    function setUp() public {
        cusd = new ERC20Mock("cUSD", "cUSD", 18);
        agent = new CeloPayAgent(address(cusd));

        cusd.mint(alice, INITIAL_BALANCE);
        cusd.mint(bob, INITIAL_BALANCE);
        cusd.mint(charlie, INITIAL_BALANCE);
    }

    // ===== sendPayment Tests =====

    function test_SendPaymentSuccess() public {
        uint256 amount = 100 * 10 ** 18;
        string memory memo = "lunch money";

        vm.startPrank(alice);
        cusd.approve(address(agent), amount);

        vm.expectEmit(true, true, true, true);
        emit CeloPayAgent.PaymentExecuted(alice, bob, amount, memo, block.timestamp);
        agent.sendPayment(bob, amount, memo);

        vm.stopPrank();

        assertEq(cusd.balanceOf(alice), INITIAL_BALANCE - amount);
        assertEq(cusd.balanceOf(bob), INITIAL_BALANCE + amount);
    }

    function test_SendPaymentRevertInvalidRecipient() public {
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        cusd.approve(address(agent), amount);
        vm.expectRevert("Invalid recipient");
        agent.sendPayment(address(0), amount, "test");
        vm.stopPrank();
    }

    function test_SendPaymentRevertInvalidAmount() public {
        vm.startPrank(alice);
        cusd.approve(address(agent), 1 * 10 ** 18);
        vm.expectRevert("Amount must be > 0");
        agent.sendPayment(bob, 0, "test");
        vm.stopPrank();
    }

    function test_SendPaymentRevertInsufficientAllowance() public {
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        cusd.approve(address(agent), amount - 1);
        vm.expectRevert();
        agent.sendPayment(bob, amount, "test");
        vm.stopPrank();
    }

    function test_SendPaymentRevertInsufficientBalance() public {
        uint256 amount = INITIAL_BALANCE + 1;

        vm.startPrank(alice);
        cusd.approve(address(agent), amount);
        vm.expectRevert();
        agent.sendPayment(bob, amount, "test");
        vm.stopPrank();
    }

    // ===== batchSend Tests =====

    function test_BatchSendSuccess() public {
        uint256 amount1 = 100 * 10 ** 18;
        uint256 amount2 = 50 * 10 ** 18;
        uint256 totalAmount = amount1 + amount2;

        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](2);
        payments[0] = CeloPayAgent.Payment({recipient: bob, amount: amount1});
        payments[1] = CeloPayAgent.Payment({recipient: charlie, amount: amount2});

        vm.startPrank(alice);
        cusd.approve(address(agent), totalAmount);

        vm.expectEmit(true, true, true, true);
        emit CeloPayAgent.BatchPaymentExecuted(alice, totalAmount, 2, block.timestamp);
        agent.batchSend(payments);

        vm.stopPrank();

        assertEq(cusd.balanceOf(alice), INITIAL_BALANCE - totalAmount);
        assertEq(cusd.balanceOf(bob), INITIAL_BALANCE + amount1);
        assertEq(cusd.balanceOf(charlie), INITIAL_BALANCE + amount2);
    }

    function test_BatchSendRevertEmptyPayments() public {
        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](0);

        vm.startPrank(alice);
        vm.expectRevert("Empty payments");
        agent.batchSend(payments);
        vm.stopPrank();
    }

    function test_BatchSendRevertTooManyRecipients() public {
        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](21);
        for (uint256 i = 0; i < 21; i++) {
            payments[i] = CeloPayAgent.Payment({
                recipient: makeAddr(string(abi.encodePacked("addr", i))),
                amount: 1 * 10 ** 18
            });
        }

        vm.startPrank(alice);
        vm.expectRevert("Max 20 recipients");
        agent.batchSend(payments);
        vm.stopPrank();
    }

    function test_BatchSendRevertInvalidRecipient() public {
        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](1);
        payments[0] = CeloPayAgent.Payment({recipient: address(0), amount: 100 * 10 ** 18});

        vm.startPrank(alice);
        vm.expectRevert("Invalid recipient");
        agent.batchSend(payments);
        vm.stopPrank();
    }

    function test_BatchSendRevertZeroAmount() public {
        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](1);
        payments[0] = CeloPayAgent.Payment({recipient: bob, amount: 0});

        vm.startPrank(alice);
        vm.expectRevert("Amount must be > 0");
        agent.batchSend(payments);
        vm.stopPrank();
    }

    function test_BatchSendRevertInsufficientAllowance() public {
        uint256 amount1 = 100 * 10 ** 18;
        uint256 amount2 = 50 * 10 ** 18;
        uint256 totalAmount = amount1 + amount2;

        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](2);
        payments[0] = CeloPayAgent.Payment({recipient: bob, amount: amount1});
        payments[1] = CeloPayAgent.Payment({recipient: charlie, amount: amount2});

        vm.startPrank(alice);
        cusd.approve(address(agent), totalAmount - 1);
        vm.expectRevert("Insufficient allowance");
        agent.batchSend(payments);
        vm.stopPrank();
    }

    // ===== Multiple Batch Transfers =====

    function testFuzz_BatchSendWithMultipleRecipients(uint8 numRecipients) public {
        vm.assume(numRecipients > 0 && numRecipients <= 20);

        CeloPayAgent.Payment[] memory payments = new CeloPayAgent.Payment[](numRecipients);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < numRecipients; i++) {
            address recipient = makeAddr(string(abi.encodePacked("fuzz", i)));
            uint256 amount = (i + 1) * 1 * 10 ** 18;
            payments[i] = CeloPayAgent.Payment({recipient: recipient, amount: amount});
            totalAmount += amount;
        }

        vm.assume(totalAmount <= INITIAL_BALANCE);

        vm.startPrank(alice);
        cusd.approve(address(agent), totalAmount);
        agent.batchSend(payments);
        vm.stopPrank();

        assertEq(cusd.balanceOf(alice), INITIAL_BALANCE - totalAmount);
    }

    // ===== getBalance Tests =====

    function test_GetBalance() public {
        assertEq(agent.getBalance(alice), INITIAL_BALANCE);

        uint256 amount = 100 * 10 ** 18;
        vm.startPrank(alice);
        cusd.approve(address(agent), amount);
        agent.sendPayment(bob, amount, "test");
        vm.stopPrank();

        assertEq(agent.getBalance(alice), INITIAL_BALANCE - amount);
    }
}
