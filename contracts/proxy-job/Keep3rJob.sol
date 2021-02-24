// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@lbertenasco/contract-utils/interfaces/utils/IGovernable.sol";
import "@lbertenasco/contract-utils/interfaces/keep3r/IKeep3rV1.sol";

import "../../interfaces/proxy-job/IKeep3rProxyJob.sol";
import "../../interfaces/proxy-job/IKeep3rJob.sol";
import "../../interfaces/keep3r/IChainLinkFeed.sol";

abstract contract Keep3rJob is IKeep3rJob, IGovernable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    IChainLinkFeed public constant FASTGAS = IChainLinkFeed(0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C);

    address public override keep3r;
    uint256 public override usedCredits;
    uint256 public override maxCredits;
    uint256 public override maxGasPrice;

    IKeep3rProxyJob internal Keep3rProxyJob;

    constructor(address _keep3rProxyJob, uint256 _maxCredits) public {
        Keep3rProxyJob = IKeep3rProxyJob(_keep3rProxyJob);
        _setMaxCredits(_maxCredits);
    }

    modifier onlyProxyJob() {
        require(msg.sender == address(Keep3rProxyJob), "Keep3rJob::onlyProxyJob:invalid-msg-sender");
        _;
    }

    // view
    function keep3rProxyJob() external view override returns (address _keep3rProxyJob) {
        return address(Keep3rProxyJob);
    }

    // Credits
    function _setMaxCredits(uint256 _maxCredits) internal {
        usedCredits = 0;
        maxCredits = _maxCredits;
    }

    modifier updateCredits() {
        uint256 _beforeCredits = IKeep3rV1(keep3r).credits(address(Keep3rProxyJob), keep3r);
        _;
        uint256 _afterCredits = IKeep3rV1(keep3r).credits(address(Keep3rProxyJob), keep3r);
        usedCredits = usedCredits.add(_beforeCredits.sub(_afterCredits));
        require(usedCredits <= maxCredits, "Keep3rJob::update-credits:used-credits-exceed-max-credits");
    }

    // MaxGasPrice
    function _setMaxGasPrice(uint256 _maxGasPrice) internal {
        maxGasPrice = _maxGasPrice;
    }

    modifier limitGasPrice() {
        require(uint256(FASTGAS.latestAnswer()) <= maxGasPrice, "Keep3rJob::limit-gas-price:gas-price-exceed-max");
        _;
    }
}
