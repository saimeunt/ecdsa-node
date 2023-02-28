const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

for (let i = 0; i < 3; i++) {
  console.log("Account:", i + 1);
  const privateKey = secp.utils.randomPrivateKey();
  console.log("Private key:", toHex(privateKey));
  const publicKey = secp.getPublicKey(privateKey);
  console.log("Public key:", toHex(publicKey));
  const address = toHex(keccak256(publicKey)).slice(24, 64);
  console.log("Address:", `0x${address}`);
}
