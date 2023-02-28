const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {
  utf8ToBytes,
  hexToBytes,
  toHex,
} = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xd496c6a7181c7652e4335f3b4f0b2eff8502dfc3": 100,
  "0xd7a7353cf005f2e6ea046152acfd0ac8efcd44da": 50,
  "0x5576d0c5d457fe57974b4445254536623d642064": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recoveryBit, sender, recipient, amount } = req.body;
  const signature = hexToBytes(req.body.signature);
  console.log("signature", signature);
  const hash = keccak256(utf8ToBytes(sender));
  console.log("hash", hash);
  const publicKey = secp.recoverPublicKey(hash, signature, recoveryBit);
  console.log("publicKey", toHex(publicKey));
  const isValid = secp.verify(signature, hash, publicKey);
  console.log("isValid", isValid);
  if (!isValid) {
    res.status(403).send({ message: "Forbidden" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
