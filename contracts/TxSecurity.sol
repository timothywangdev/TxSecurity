pragma solidity ^0.4.24;

contract TxSecurity {
    struct Alias {
        string addr; // address of a cryptocurrency
        bytes32 cryptoType; // type of the cryptocurrency
        bytes32 pin; // for transfer verification
    }

    struct Domain {
        address owner;
        bytes32[] alias;
        mapping(bytes32 => Alias) aliasData;
    }

    // domain hash => [Domain]
    mapping(bytes32 => Domain) public domains;

    function registerDomain(bytes32 domain) external {
        // domain must be available
        require(domains[domain].owner == address(0x0));
        domains[domain].owner = msg.sender;
    }

    function removeDomain(bytes32 domain) external {
        // must be owner
        require(domains[domain].owner == msg.sender);
        delete domains[domain].alias;
        delete domains[domain].owner;
    }

    function removeAlias(bytes32 domain, bytes32 alias) internal {
        Domain storage d = domains[domain];
        uint idx = d.alias.length;
        for(uint i = 0; i < d.alias.length; i++) {
            if (alias == d.alias[i]) {
                idx = i;
                break;
            }
        }
        if (idx < d.alias.length) {
            d.alias[idx] = d.alias[d.alias.length - 1];
            d.alias.length--;
        }
    }

    function addAlias(bytes32 domain, bytes32 alias, string addr, bytes32 cryptoType, bytes32 pin) public {
        Domain storage d = domains[domain];

        // must be owner
        require(d.owner == msg.sender);

        // remove an existing alias
        if (bytes(addr).length == 0) {
            removeAlias(domain, alias);
        }

        // add a new alias
        if (bytes(addr).length != 0 && bytes(d.aliasData[alias].addr).length == 0) {
            d.alias.push(alias);
        }

        // overwrite existing alias data
        d.aliasData[alias].addr = addr;
        d.aliasData[alias].cryptoType = cryptoType;
        d.aliasData[alias].pin = pin;
    }

    function getAliasData(bytes32 domain, bytes32 alias) external returns (string, bytes32, bytes32) {
        Domain storage d = domains[domain];
        return (d.aliasData[alias].addr, d.aliasData[alias].cryptoType, d.aliasData[alias].pin);
    }

    function getDomain(bytes32 domain) external returns (address, bytes32[]) {
        return (domains[domain].owner, domains[domain].alias);
    }
}
