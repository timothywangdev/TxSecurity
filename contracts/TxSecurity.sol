progma solidity ^0.4.24;

contract TxSecurity {
    struct Transfer {
        address from;
        address to;
        uint val;
        bytes32 secret;
        uint timestamp;
        uint8 status; // 0: init 1: received 2: cancelled
    };

    Transfer[] transfers;

    // addres => tx list
    mapping(address => uint) userTransfers;

    function send(address to, bytes32 secret) public external {
        require(to != address(0x0), "Invalid receiver");
        require(msg.value > 0, "Value too low");

        transfers.push(Transfer(msg.sender, to, msg.value, secret, block.timestamp));
        userTransfers[msg.sender].push(transfers.length - 1);
        userTransfers[to].push(transfers.length - 1);
    }

    function receive(uint id, bytes32 pwd) external {
        require(id < transfers.length, "Invalid ID");
        require(msg.sender == transfers[id].to, "Invalid receiver");
        require(transfers[id].val != 0, "Value must be non-zero");
        require(keccak256(pwd) == transfers[id].secret, "Invalid password");

        uint _val = transfers[id].val;
        transfers[id].val = 0;
        msg.sender.transfer(_val);
        transfer[id].status = 1;
    }

    function cancel(uint id) external {
        require(id < transfers.length, "Invalid ID");
        require(msg.sender == transfers[id].from, "Invalid sender");
        require(transfers[id].val != 0, "Value must be non-zero");

        uint _val = transfers[id].val;
        transfers[id].val = 0;
        msg.sender.transfer(_val);
        transfer[id].status = 2;
    }

    function getTransferListLen(address user) external view returns (uint) {
        return transferList[user].length;
    }

    function getTransferList(address user, uint startId)
        external
        view
        returns
        (address[] from,
         uint[] val,
         bytes32[] secret,
         uint[] timestamp,
         uint8[] status) {

        // batch of ten
        address[] _from = new address(10);
        uint[] _val = new uint(10);
        bytes32[] _secret = new bytes32(10);
        uint[] _timestamp = new uint(10);
        uint8[] status = new uint8(10);

        for(int i = (int)(startId); i >= 0 && i >= (int)(startId) - 10; i--) {
            Transfer storage t = transferList[user][i];
            _from.push(t.from);
            _val.push(t.val);
            _secret.push(t.secret);
            _timestamp.push(t.timestamp);
            _status.push(t.status);
        }
        return (_from, _val, _secret, _timestamp, _status);
    }
}
