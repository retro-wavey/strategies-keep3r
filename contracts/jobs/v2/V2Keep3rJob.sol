// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@lbertenasco/contract-utils/contracts/abstract/MachineryReady.sol";
import "@lbertenasco/contract-utils/interfaces/keep3r/IKeep3rV1.sol";

import "../../proxy-job/Keep3rJob.sol";
import "../../../interfaces/jobs/v2/IV2Keeper.sol";

import "../../../interfaces/jobs/v2/IV2Keep3rJob.sol";
import "../../../interfaces/keep3r/IKeep3rV1Helper.sol";
import "../../../interfaces/yearn/IBaseStrategy.sol";
import "../../../interfaces/keep3r/IUniswapV2SlidingOracle.sol";

abstract contract V2Keep3rJob is MachineryReady, Keep3rJob, IV2Keep3rJob {
    using SafeMath for uint256;

    address public constant KP3R = address(0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44);
    address public constant WETH = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    IV2Keeper public V2Keeper;
    address public keep3r;
    address public keep3rHelper;
    address public slidingOracle;

    EnumerableSet.AddressSet internal _availableStrategies;

    mapping(address => uint256) public requiredAmount;
    mapping(address => uint256) public lastWorkAt;

    uint256 public workCooldown;

    uint256 public usedCredits;
    uint256 public maxCredits;

    enum WorkType {tend, harvest}
    WorkType public workType;

    constructor(
        address _mechanicsRegistry,
        address _keep3rProxyJob,
        address _v2Keeper,
        address _keep3r,
        address _keep3rHelper,
        address _slidingOracle,
        uint256 _workCooldown,
        uint256 _maxCredits
    ) public MachineryReady(_mechanicsRegistry) Keep3rJob(_keep3rProxyJob) {
        V2Keeper = IV2Keeper(_v2Keeper);
        keep3r = _keep3r;
        keep3rHelper = _keep3rHelper;
        slidingOracle = _slidingOracle;
        _setWorkCooldown(_workCooldown);
        _setMaxCredits(_maxCredits);
    }

    // Setters
    function setWorkCooldown(uint256 _workCooldown) external override onlyGovernor {
        _setWorkCooldown(_workCooldown);
    }

    function _setWorkCooldown(uint256 _workCooldown) internal {
        require(_workCooldown > 0, "generic-keep3r-v2::set-work-cooldown:should-not-be-zero");
        workCooldown = _workCooldown;
    }

    function setMaxCredits(uint256 _maxCredits) external override onlyGovernor {
        _setMaxCredits(_maxCredits);
    }

    function _setMaxCredits(uint256 _maxCredits) internal {
        usedCredits = 0;
        maxCredits = _maxCredits;
    }

    // Governor
    function addStrategies(address[] calldata _strategies, uint256[] calldata _requiredAmounts) external override onlyGovernor {
        require(_strategies.length == _requiredAmounts.length, "generic-keep3r-v2::add-strategies:strategies-required-works-different-length");
        for (uint256 i; i < _strategies.length; i++) {
            _addStrategy(_strategies[i], _requiredAmounts[i]);
        }
    }

    function addStrategy(address _strategy, uint256 _requiredAmount) external override onlyGovernor {
        _addStrategy(_strategy, _requiredAmount);
    }

    function _addStrategy(address _strategy, uint256 _requiredAmount) internal {
        require(_requiredAmount > 0, "generic-keep3r-v2::add-strategy:required-amount-not-0");
        require(requiredAmount[_strategy] == 0, "generic-keep3r-v2::add-strategy:strategy-already-added");
        _setRequiredAmount(_strategy, _requiredAmount);
        emit StrategyAdded(_strategy, _requiredAmount);
        _availableStrategies.add(_strategy);
    }

    function updateRequiredAmount(address _strategy, uint256 _requiredAmount) external override onlyGovernor {
        require(requiredAmount[_strategy] > 0, "generic-keep3r-v2::update-required-amount:strategy-not-added");
        _setRequiredAmount(_strategy, _requiredAmount);
        emit StrategyModified(_strategy, _requiredAmount);
    }

    function removeStrategy(address _strategy) external override onlyGovernor {
        require(requiredAmount[_strategy] > 0, "generic-keep3r-v2::remove-strategy:strategy-not-added");
        delete requiredAmount[_strategy];
        _availableStrategies.remove(_strategy);
        emit StrategyRemoved(_strategy);
    }

    function _setRequiredAmount(address _strategy, uint256 _requiredAmount) internal {
        require(_requiredAmount > 0, "generic-keep3r-v2::set-required-work:should-not-be-zero");
        requiredAmount[_strategy] = _requiredAmount;
    }

    // Getters
    function strategies() public view override returns (address[] memory _strategies) {
        _strategies = new address[](_availableStrategies.length());
        for (uint256 i; i < _availableStrategies.length(); i++) {
            _strategies[i] = _availableStrategies.at(i);
        }
    }

    // Job actions
    function getWorkData() public override returns (bytes memory _workData) {
        for (uint256 i; i < _availableStrategies.length(); i++) {
            address _strategy = _availableStrategies.at(i);
            if (_workable(_strategy)) return abi.encode(_strategy);
        }
    }

    function decodeWorkData(bytes memory _workData) public pure returns (address _strategy) {
        return abi.decode(_workData, (address));
    }

    function workable() public override returns (bool) {
        for (uint256 i; i < _availableStrategies.length(); i++) {
            if (_workable(_availableStrategies.at(i))) return true;
        }
        return false;
    }

    function _workable(address _strategy) internal view returns (bool) {
        require(requiredAmount[_strategy] > 0, "generic-keep3r-v2::workable:strategy-not-added");
        if (block.timestamp > lastWorkAt[_strategy].add(workCooldown)) return false;

        uint256 kp3rCallCost = IKeep3rV1Helper(keep3rHelper).getQuoteLimit(requiredAmount[_strategy]);
        uint256 ethCallCost = IUniswapV2SlidingOracle(slidingOracle).current(KP3R, kp3rCallCost, WETH);
        if (workType == WorkType.tend) return IBaseStrategy(_strategy).tendTrigger(ethCallCost);
        if (workType == WorkType.harvest) return IBaseStrategy(_strategy).harvestTrigger(ethCallCost);
    }

    // Keep3r actions
    function work(bytes memory _workData) external override notPaused onlyProxyJob updateCredits {
        address _strategy = decodeWorkData(_workData);
        require(_workable(_strategy), "generic-keep3r-v2::work:not-workable");

        _work(_strategy);

        emit Worked(_strategy);
    }

    // Governor keeper bypass
    function forceWork(address _strategy) external override onlyGovernorOrMechanic {
        _work(_strategy);
        emit ForceWorked(_strategy);
    }

    function _work(address _strategy) internal {
        if (workType == WorkType.tend) V2Keeper.tend(_strategy);
        if (workType == WorkType.harvest) V2Keeper.harvest(_strategy);
        lastWorkAt[_strategy] = block.timestamp;
    }

    modifier updateCredits() {
        uint256 _beforeCredits = IKeep3rV1(keep3r).credits(address(Keep3rProxyJob), keep3r);
        _;
        uint256 _afterCredits = IKeep3rV1(keep3r).credits(address(Keep3rProxyJob), keep3r);
        usedCredits = usedCredits.add(_beforeCredits.sub(_afterCredits));
        require(usedCredits <= maxCredits, "generic-keep3r-v2::update-credits:used-credits-exceed-max-credits");
    }
}