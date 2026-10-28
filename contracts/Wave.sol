// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Wave
 * @dev A minimal Web3 social contract to send and record waves between addresses.
 * Does not accept or hold funds.
 */
contract Wave {
    struct WaveItem {
        address sender;
        address recipient;
        uint256 timestamp;
    }

    // List of all waves recorded
    WaveItem[] private _waves;

    // Fast counters per address
    mapping(address => uint256) public wavesSent;
    mapping(address => uint256) public wavesReceived;

    // Emitted whenever a wave is sent
    event WaveSent(
        address indexed sender,
        address indexed recipient,
        uint256 timestamp
    );

    // Custom errors for gas efficiency and clear reverts
    error ZeroAddressNotAllowed();
    error CannotWaveToSelf();

    /**
     * @notice Send a wave to a recipient address
     * @param recipient The address receiving the wave
     */
    function sendWave(address recipient) external {
        if (recipient == address(0)) {
            revert ZeroAddressNotAllowed();
        }
        if (recipient == msg.sender) {
            revert CannotWaveToSelf();
        }

        uint256 currentTimestamp = block.timestamp;

        _waves.push(WaveItem({
            sender: msg.sender,
            recipient: recipient,
            timestamp: currentTimestamp
        }));

        wavesSent[msg.sender]++;
        wavesReceived[recipient]++;

        emit WaveSent(msg.sender, recipient, currentTimestamp);
    }

    /**
     * @notice Total number of waves recorded by the contract
     */
    function getTotalWaves() external view returns (uint256) {
        return _waves.length;
    }

    /**
     * @notice Retrieve all recorded waves
     */
    function getAllWaves() external view returns (WaveItem[] memory) {
        return _waves;
    }

    /**
     * @notice Retrieve the most recent waves with optional pagination
     * @param limit Maximum number of waves to return
     * @param offset Number of latest waves to skip
     */
    function getRecentWaves(uint256 limit, uint256 offset) external view returns (WaveItem[] memory) {
        uint256 total = _waves.length;
        if (offset >= total) {
            return new WaveItem[](0);
        }

        uint256 available = total - offset;
        uint256 count = limit > available ? available : limit;
        WaveItem[] memory recent = new WaveItem[](count);

        for (uint256 i = 0; i < count; i++) {
            // Read in reverse chronological order (newest first)
            recent[i] = _waves[total - 1 - offset - i];
        }

        return recent;
    }
}
