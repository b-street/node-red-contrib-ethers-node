const {
    EthersActionExecutor
} = require("../dist/src/EthersActionExecutor");
module.exports = function (RED) {
    function EthersReadNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.contract = RED.nodes.getNode(config.contract);
        this.rpc = RED.nodes.getNode(config.rpc).rpc;
        this.output = config.output;
        this.outputType = config.outputType;
        var ethersActionExecutor = new EthersActionExecutor(null, this.rpc, node, {
            context: this.outputType,
            key: this.output
        });
        node.on('input', function (msg) {
            const params = RED.util.evaluateNodeProperty(config.params, config.paramsType || "json", node, msg)
            const abi = this.contract.abi;
            const bytecode = this.contract.bytecode;
            const contractAddress = config.contractAddress
            const method = config.method
            const action = EthersActionExecutor.readContractAction(abi, bytecode, contractAddress, method, params);
            ethersActionExecutor.executeRead(action,msg);
        });
    }

    RED.nodes.registerType("ethers-read", EthersReadNode);
}
