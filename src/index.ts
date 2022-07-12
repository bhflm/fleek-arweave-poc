// eslint-disable-next-line @typescript-eslint/no-var-requires
const Arweave = require("arweave");
import { newTransaction, generateWalletAndAddress, getBalance, mintWalletAndFund } from "./arweave/api";

const defaultConfig = {
  host: "127.0.0.1",
  port: 1984,
  protocol: "http",
};

export class FleekWeave {
  public address;
  private client;
  private jwk;

  constructor(config) {
    // If you want to connect directly to a node
    const cfg = config ? config : defaultConfig;
    this.client = Arweave.init(cfg);
    this.address = null;
  }

  // Needs to have ARLocal node running;
  public async generateNewWalletAndFund() {
    // fs.readFile(wallet.json)
    const { jwk, address } = await generateWalletAndAddress(this.client);
    this.address = address;
    this.jwk = jwk;
    // @ TODO get this syncd with faucet
    // for the time being we use a local node
    // run with npx arlocal
    await mintWalletAndFund(this.address);
  }

  public async getBalance() {
    if (!this.address || !this.jwk) {
      throw new Error("Need to set an address first");
    }
    return await getBalance(this.address);
  }

  public async createTx(data) {
    if (!this.address || !this.jwk) {
      throw new Error("Need to set an address first");
    }
    if (!data) {
      throw new Error("Need to have data input");
    }
    const tx = await newTransaction(this.client, data, this.jwk);
    return tx;
  }
}
