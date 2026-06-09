// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PaymentScheduler} from "../src/PaymentScheduler.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";

contract PaymentSchedulerTest is Test {
    PaymentScheduler public scheduler;
    ERC20Mock public cusd;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public executor = makeAddr("executor");

    uint256 public constant INITIAL_BALANCE = 1000 * 10 ** 18;
    uint256 public constant PAYMENT_AMOUNT = 50 * 10 ** 18;
    uint256 public constant INTERVAL = 7 days;

    function setUp() public {
        cusd = new ERC20Mock("cUSD", "cUSD", 18);
        scheduler = new PaymentScheduler(address(cusd));

        cusd.mint(alice, INITIAL_BALANCE);
        cusd.mint(bob, 100 * 10 ** 18);
    }

    // ===== createSchedule Tests =====

    function test_CreateScheduleSuccess() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "weekly payment"
        );
        vm.stopPrank();

        assertEq(scheduleId, 0);
        PaymentScheduler.Schedule memory sched = scheduler.getSchedule(scheduleId);
        assertEq(sched.owner, alice);
        assertEq(sched.recipient, bob);
        assertEq(sched.amount, PAYMENT_AMOUNT);
        assertEq(sched.interval, INTERVAL);
        assertEq(sched.active, true);
        assertEq(sched.execCount, 0);
    }

    function test_CreateScheduleRevertInvalidRecipient() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        vm.expectRevert("Invalid recipient");
        scheduler.createSchedule(address(0), PAYMENT_AMOUNT, INTERVAL, startTime, "test");
        vm.stopPrank();
    }

    function test_CreateScheduleRevertZeroAmount() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        vm.expectRevert("Amount must be > 0");
        scheduler.createSchedule(bob, 0, INTERVAL, startTime, "test");
        vm.stopPrank();
    }

    function test_CreateScheduleRevertMinInterval() public {
        uint256 startTime = block.timestamp;
        uint256 tooSmallInterval = 1 hours - 1;

        vm.startPrank(alice);
        vm.expectRevert("Min interval 1 hour");
        scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            tooSmallInterval,
            startTime,
            "test"
        );
        vm.stopPrank();
    }

    // ===== executeSchedule Tests =====

    function test_ExecuteScheduleSuccess() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        cusd.approve(address(scheduler), PAYMENT_AMOUNT * 100);
        vm.stopPrank();

        vm.startPrank(executor);
        vm.expectEmit(true, true, false, true);
        emit PaymentScheduler.ScheduleExecuted(scheduleId, executor, 1);
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();

        assertEq(cusd.balanceOf(bob), 100 * 10 ** 18 + PAYMENT_AMOUNT);
        PaymentScheduler.Schedule memory sched = scheduler.getSchedule(scheduleId);
        assertEq(sched.execCount, 1);
    }

    function test_ExecuteScheduleRevertNotDue() public {
        uint256 startTime = block.timestamp + 1 days;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        cusd.approve(address(scheduler), PAYMENT_AMOUNT * 100);
        vm.stopPrank();

        vm.startPrank(executor);
        vm.expectRevert("Not yet due");
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();
    }

    function test_ExecuteScheduleRevertInactive() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        scheduler.cancelSchedule(scheduleId);
        vm.stopPrank();

        vm.startPrank(executor);
        vm.expectRevert("Schedule not active");
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();
    }

    function test_ExecuteScheduleRevertInsufficientAllowance() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        cusd.approve(address(scheduler), 0);
        vm.stopPrank();

        vm.startPrank(executor);
        vm.expectRevert();
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();
    }

    // ===== Multiple executions =====

    function test_ExecuteScheduleMultipleTimes() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        cusd.approve(address(scheduler), PAYMENT_AMOUNT * 100);
        vm.stopPrank();

        assertEq(scheduler.isDue(scheduleId), true);

        vm.startPrank(executor);
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();

        assertEq(scheduler.isDue(scheduleId), false);

        vm.warp(block.timestamp + INTERVAL);
        assertEq(scheduler.isDue(scheduleId), true);

        vm.startPrank(executor);
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();

        PaymentScheduler.Schedule memory sched = scheduler.getSchedule(scheduleId);
        assertEq(sched.execCount, 2);
    }

    // ===== cancelSchedule Tests =====

    function test_CancelScheduleSuccess() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        vm.expectEmit(true, false, false, false);
        emit PaymentScheduler.ScheduleCancelled(scheduleId);
        scheduler.cancelSchedule(scheduleId);
        vm.stopPrank();

        PaymentScheduler.Schedule memory sched = scheduler.getSchedule(scheduleId);
        assertEq(sched.active, false);
    }

    function test_CancelScheduleRevertNotOwner() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert("Not owner");
        scheduler.cancelSchedule(scheduleId);
        vm.stopPrank();
    }

    // ===== isDue Tests =====

    function test_IsDueTrue() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        vm.stopPrank();

        assertEq(scheduler.isDue(scheduleId), true);
    }

    function test_IsDueFalse() public {
        uint256 startTime = block.timestamp + 1 days;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        vm.stopPrank();

        assertEq(scheduler.isDue(scheduleId), false);
    }

    // ===== getUserSchedules Tests =====

    function test_GetUserSchedules() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId1 = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test1"
        );
        uint256 scheduleId2 = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test2"
        );
        vm.stopPrank();

        uint256[] memory schedules = scheduler.getUserSchedules(alice);
        assertEq(schedules.length, 2);
        assertEq(schedules[0], scheduleId1);
        assertEq(schedules[1], scheduleId2);
    }

    // ===== getNextExecTime Tests =====

    function test_GetNextExecTime() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        vm.stopPrank();

        uint256 nextExec = scheduler.getNextExecTime(scheduleId);
        assertEq(nextExec, startTime);
    }

    function test_GetNextExecTimeAfterExecution() public {
        uint256 startTime = block.timestamp;

        vm.startPrank(alice);
        uint256 scheduleId = scheduler.createSchedule(
            bob,
            PAYMENT_AMOUNT,
            INTERVAL,
            startTime,
            "test"
        );
        cusd.approve(address(scheduler), PAYMENT_AMOUNT * 100);
        vm.stopPrank();

        vm.startPrank(executor);
        scheduler.executeSchedule(scheduleId);
        vm.stopPrank();

        uint256 nextExec = scheduler.getNextExecTime(scheduleId);
        assertEq(nextExec, block.timestamp + INTERVAL);
    }
}
