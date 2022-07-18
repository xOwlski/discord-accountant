import { Listener } from "discord-akairo"
import { syncTwitter } from "../twitter";

export default class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    })
  }

  async exec() {
    console.log(`Logged in as ${this.client.user.tag}!`);

    syncTwitter(this.client);
  }
}
