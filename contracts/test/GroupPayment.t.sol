// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {GroupPayment} from "../src/GroupPayment.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";

contract GroupPaymentTest is Test {
    GroupPayment public groupPayment;
    ERC20Mock public cusd;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");
    address public recipient = makeAddr("recipient");

    uint256 public constant INITIAL_BALANCE = 1000 * 10 ** 18;
    uint256 public constant TARGET_AMOUNT = 300 * 10 ** 18;

    function setUp() public {
        cusd = new ERC20Mock("cUSD", "cUSD", 18);
        groupPayment = new GroupPayment(address(cusd));

        cusd.mint(alice, INITIAL_BALANCE);
        cusd.mint(bob, INITIAL_BALANCE);
        cusd.mint(charlie, INITIAL_BALANCE);
    }

    // ===== createGroup Tests =====

    function test_CreateGroupSuccess() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "Split dinner",
            deadline
        );
        vm.stopPrank();

        assertEq(groupId, 0);
        GroupPayment.Group memory group = groupPayment.getGroup(groupId);
        assertEq(group.initiator, alice);
        assertEq(group.recipient, recipient);
        assertEq(group.targetAmount, TARGET_AMOUNT);
        assertEq(group.collectedAmount, 0);
        assertEq(uint8(group.status), uint8(GroupPayment.Status.Open));
    }

    function test_CreateGroupRevertInvalidRecipient() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        vm.expectRevert("Invalid recipient");
        groupPayment.createGroup(address(0), TARGET_AMOUNT, "test", deadline);
        vm.stopPrank();
    }

    function test_CreateGroupRevertZeroTarget() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        vm.expectRevert("Target must be > 0");
        groupPayment.createGroup(recipient, 0, "test", deadline);
        vm.stopPrank();
    }

    function test_CreateGroupRevertInvalidDeadline() public {
        vm.startPrank(alice);
        vm.expectRevert("Invalid deadline");
        groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            block.timestamp
        );
        vm.stopPrank();
    }

    // ===== contribute Tests =====

    function test_ContributeSuccess() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        vm.expectEmit(true, true, true, true);
        emit GroupPayment.ContributionMade(groupId, bob, amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        assertEq(groupPayment.getContribution(groupId, bob), amount);
        GroupPayment.Group memory group = groupPayment.getGroup(groupId);
        assertEq(group.collectedAmount, amount);
    }

    function test_ContributeRevertGroupNotOpen() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), TARGET_AMOUNT);
        groupPayment.contribute(groupId, TARGET_AMOUNT);
        vm.stopPrank();

        vm.startPrank(charlie);
        cusd.approve(address(groupPayment), amount);
        vm.expectRevert("Group not open");
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();
    }

    function test_ContributeRevertDeadlinePassed() public {
        uint256 deadline = block.timestamp + 1;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.warp(block.timestamp + 2);

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        vm.expectRevert("Deadline passed");
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();
    }

    function test_ContributeRevertZeroAmount() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), 1 * 10 ** 18);
        vm.expectRevert("Amount must be > 0");
        groupPayment.contribute(groupId, 0);
        vm.stopPrank();
    }

    // ===== Auto-complete on target reached =====

    function test_AutoCompleteOnTargetReached() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), TARGET_AMOUNT);
        vm.expectEmit(true, true, false, true);
        emit GroupPayment.GroupCompleted(groupId, TARGET_AMOUNT);
        groupPayment.contribute(groupId, TARGET_AMOUNT);
        vm.stopPrank();

        GroupPayment.Group memory group = groupPayment.getGroup(groupId);
        assertEq(uint8(group.status), uint8(GroupPayment.Status.Completed));
        assertEq(cusd.balanceOf(recipient), TARGET_AMOUNT);
    }

    // ===== finalize Tests =====

    function test_FinalizeByInitiator() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(alice);
        vm.expectEmit(true, true, false, true);
        emit GroupPayment.GroupCompleted(groupId, amount);
        groupPayment.finalize(groupId);
        vm.stopPrank();

        GroupPayment.Group memory group = groupPayment.getGroup(groupId);
        assertEq(uint8(group.status), uint8(GroupPayment.Status.Completed));
    }

    function test_FinalizeRevertWhenTargetNotReached() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(charlie);
        vm.expectRevert("Not initiator or target not reached");
        groupPayment.finalize(groupId);
        vm.stopPrank();
    }

    // ===== cancel Tests =====

    function test_CancelByInitiator() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(alice);
        vm.expectEmit(true, false, false, false);
        emit GroupPayment.GroupCancelled(groupId);
        groupPayment.cancel(groupId);
        vm.stopPrank();

        GroupPayment.Group memory group = groupPayment.getGroup(groupId);
        assertEq(uint8(group.status), uint8(GroupPayment.Status.Cancelled));
        assertEq(cusd.balanceOf(bob), INITIAL_BALANCE);
    }

    function test_CancelRevertNotInitiator() public {
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert("Not initiator");
        groupPayment.cancel(groupId);
        vm.stopPrank();
    }

    // ===== Multiple contributors =====

    function test_MultipleContributorsRefund() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(charlie);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(alice);
        groupPayment.cancel(groupId);
        vm.stopPrank();

        assertEq(cusd.balanceOf(bob), INITIAL_BALANCE);
        assertEq(cusd.balanceOf(charlie), INITIAL_BALANCE);
    }

    function test_GetContributors() public {
        uint256 deadline = block.timestamp + 7 days;
        uint256 amount = 100 * 10 ** 18;

        vm.startPrank(alice);
        uint256 groupId = groupPayment.createGroup(
            recipient,
            TARGET_AMOUNT,
            "test",
            deadline
        );
        vm.stopPrank();

        vm.startPrank(bob);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        vm.startPrank(charlie);
        cusd.approve(address(groupPayment), amount);
        groupPayment.contribute(groupId, amount);
        vm.stopPrank();

        address[] memory contributors = groupPayment.getContributors(groupId);
        assertEq(contributors.length, 2);
        assertEq(contributors[0], bob);
        assertEq(contributors[1], charlie);
    }
}
