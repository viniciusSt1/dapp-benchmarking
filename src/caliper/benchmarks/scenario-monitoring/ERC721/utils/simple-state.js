'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

class SimpleState {
    constructor(workerIndex, tokenIdStart = 101, accounts = 0) {
        this.accountsGenerated = accounts;
        this.tokenIdStart = tokenIdStart;
        this.accountPrefix = this._get26Num(workerIndex);
    }

    _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    getTransferArguments() {
        const args = {
            from: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", // conta do usuario
            to: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            tokenId: this.tokenIdStart
        };
        //console.log("transferindo", this.tokenIdStart);
        this.tokenIdStart++;
        return args;
    }

    getMintArguments() {
        const args = {
            to: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
            tokenId: this.tokenIdStart
        };
        //console.log("mintando", this.tokenIdStart);
        this.tokenIdStart++;
        return args;
    }
}

module.exports = SimpleState;