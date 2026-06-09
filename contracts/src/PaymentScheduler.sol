// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentScheduler {
    IERC20 public cUSD;
    uint256 public scheduleCount;

    struct Schedule {
        address owner;
        address recipient;
        uint256 amount;
        uint256 interval;
        uint256 nextExec;
        uint256 execCount;
        bool active;
        string memo;
    }

    mapping(uint256 => Schedule) public schedules;
    mapping(address => uint256[]) public userSchedules;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed owner,
        address recipient,
        uint256 amount,
        uint256 interval
    );
    event ScheduleExecuted(
        uint256 indexed scheduleId,
        address indexed executor,
        uint256 execCount
    );
    event ScheduleCancelled(uint256 indexed scheduleId);

    constructor(address _cUSD) {
        require(_cUSD != address(0), "Invalid cUSD address");
        cUSD = IERC20(_cUSD);
    }

    /// @notice Create a recurring payment schedule
    function createSchedule(
        address recipient,
        uint256 amount,
        uint256 intervalSeconds,
        uint256 startTimestamp,
        string calldata memo
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(intervalSeconds >= 3600, "Min interval 1 hour");

        uint256 scheduleId = scheduleCount++;
        uint256 nextExec = startTimestamp > block.timestamp
            ? startTimestamp
            : block.timestamp;

        schedules[scheduleId] = Schedule({
            owner: msg.sender,
            recipient: recipient,
            amount: amount,
            interval: intervalSeconds,
            nextExec: nextExec,
            execCount: 0,
            active: true,
            memo: memo
        });

        userSchedules[msg.sender].push(scheduleId);

        emit ScheduleCreated(
            scheduleId,
            msg.sender,
            recipient,
            amount,
            intervalSeconds
        );
        return scheduleId;
    }

    /// @notice Execute a due schedule — callable by anyone (agent, keeper, user)
    function executeSchedule(uint256 scheduleId) external {
        Schedule storage s = schedules[scheduleId];
        require(s.active, "Schedule not active");
        require(block.timestamp >= s.nextExec, "Not yet due");

        s.nextExec = block.timestamp + s.interval;
        s.execCount++;

        require(
            cUSD.transferFrom(s.owner, s.recipient, s.amount),
            "Transfer failed - check allowance"
        );

        emit ScheduleExecuted(scheduleId, msg.sender, s.execCount);
    }

    /// @notice Cancel a schedule
    function cancelSchedule(uint256 scheduleId) external {
        Schedule storage s = schedules[scheduleId];
        require(s.owner == msg.sender, "Not owner");
        require(s.active, "Already inactive");

        s.active = false;
        emit ScheduleCancelled(scheduleId);
    }

    /// @notice Get all schedules for a user
    function getUserSchedules(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userSchedules[user];
    }

    /// @notice Check if a schedule is due for execution
    function isDue(uint256 scheduleId) external view returns (bool) {
        Schedule storage s = schedules[scheduleId];
        return s.active && block.timestamp >= s.nextExec;
    }

    /// @notice Get schedule details
    function getSchedule(uint256 scheduleId)
        external
        view
        returns (Schedule memory)
    {
        return schedules[scheduleId];
    }

    /// @notice Get next execution time for a schedule
    function getNextExecTime(uint256 scheduleId)
        external
        view
        returns (uint256)
    {
        return schedules[scheduleId].nextExec;
    }
}
