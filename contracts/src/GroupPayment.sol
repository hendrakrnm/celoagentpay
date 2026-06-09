// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GroupPayment {
    IERC20 public cUSD;
    uint256 public groupCount;

    enum Status {
        Open,
        Completed,
        Cancelled
    }

    struct Group {
        address initiator;
        address recipient;
        uint256 targetAmount;
        uint256 collectedAmount;
        string description;
        Status status;
        uint256 createdAt;
        uint256 deadline;
    }

    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;

    event GroupCreated(
        uint256 indexed groupId,
        address indexed initiator,
        address recipient,
        uint256 targetAmount,
        string description
    );
    event ContributionMade(
        uint256 indexed groupId,
        address indexed contributor,
        uint256 amount
    );
    event GroupCompleted(uint256 indexed groupId, uint256 totalAmount);
    event GroupCancelled(uint256 indexed groupId);
    event RefundIssued(
        uint256 indexed groupId,
        address contributor,
        uint256 amount
    );

    constructor(address _cUSD) {
        require(_cUSD != address(0), "Invalid cUSD address");
        cUSD = IERC20(_cUSD);
    }

    /// @notice Create a new group payment session
    function createGroup(
        address recipient,
        uint256 targetAmount,
        string calldata description,
        uint256 deadlineTimestamp
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(targetAmount > 0, "Target must be > 0");
        require(deadlineTimestamp > block.timestamp, "Invalid deadline");

        uint256 groupId = groupCount++;
        groups[groupId] = Group({
            initiator: msg.sender,
            recipient: recipient,
            targetAmount: targetAmount,
            collectedAmount: 0,
            description: description,
            status: Status.Open,
            createdAt: block.timestamp,
            deadline: deadlineTimestamp
        });

        emit GroupCreated(
            groupId,
            msg.sender,
            recipient,
            targetAmount,
            description
        );
        return groupId;
    }

    /// @notice Contribute cUSD to an open group
    function contribute(uint256 groupId, uint256 amount) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(block.timestamp < g.deadline, "Deadline passed");
        require(amount > 0, "Amount must be > 0");

        if (contributions[groupId][msg.sender] == 0) {
            contributors[groupId].push(msg.sender);
        }

        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        contributions[groupId][msg.sender] += amount;
        g.collectedAmount += amount;

        emit ContributionMade(groupId, msg.sender, amount);

        if (g.collectedAmount >= g.targetAmount) {
            _completeGroup(groupId);
        }
    }

    /// @notice Manually finalize if target is reached
    function finalize(uint256 groupId) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(
            msg.sender == g.initiator || g.collectedAmount >= g.targetAmount,
            "Not initiator or target not reached"
        );
        _completeGroup(groupId);
    }

    /// @notice Cancel group and refund all contributors
    function cancel(uint256 groupId) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(msg.sender == g.initiator, "Not initiator");

        g.status = Status.Cancelled;

        address[] memory contribs = contributors[groupId];
        for (uint256 i = 0; i < contribs.length; i++) {
            uint256 amount = contributions[groupId][contribs[i]];
            if (amount > 0) {
                contributions[groupId][contribs[i]] = 0;
                require(cUSD.transfer(contribs[i], amount), "Refund failed");
                emit RefundIssued(groupId, contribs[i], amount);
            }
        }

        emit GroupCancelled(groupId);
    }

    function _completeGroup(uint256 groupId) internal {
        Group storage g = groups[groupId];
        g.status = Status.Completed;
        require(
            cUSD.transfer(g.recipient, g.collectedAmount),
            "Transfer to recipient failed"
        );
        emit GroupCompleted(groupId, g.collectedAmount);
    }

    /// @notice Get all contributors of a group
    function getContributors(uint256 groupId)
        external
        view
        returns (address[] memory)
    {
        return contributors[groupId];
    }

    /// @notice Get group details
    function getGroup(uint256 groupId)
        external
        view
        returns (Group memory)
    {
        return groups[groupId];
    }

    /// @notice Get contribution amount by user for a group
    function getContribution(uint256 groupId, address contributor)
        external
        view
        returns (uint256)
    {
        return contributions[groupId][contributor];
    }
}
