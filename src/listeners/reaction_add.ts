import { Accountant } from "client";
import { isAdmin } from "../database/admin";
import { grantPoints } from "../database/points";
import { Listener } from "discord-akairo"
import { MessageReaction, User } from "discord.js"

export default class ReadyListener extends Listener {
  constructor() {
    super("reactionAdd", {
      emitter: "client",
      event: "messageReactionAdd",
    })
  }

  async exec(reaction: MessageReaction, user: User) {

    const points = {
        "💎": 100,
        "💰": 50
    };

    const pool = (this.client as Accountant).pool;
    const adderIsAdmin = await isAdmin(user.id, pool);

    if (adderIsAdmin && points[reaction.emoji?.name]) {
        await grantPoints(user, reaction.message.author, points[reaction.emoji?.name], pool);
        await reaction.message.react("✅");
    }

  }
}
