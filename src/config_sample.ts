// Main guild ID (logs transfers from all guilds)
export const MAIN_GUILD = "123"

// Prefix for commands
export const PREFIX = "!"

// Text representation of the points emote used in bot messages
// You can get this by typing a backslash with the emote e.g. "\:points:"
// And it'll send it in this format
export const POINTS_EMOTE = "<a:COIN:1004373786780520449>"

// IDs for custom roles and the minimum amount of points to acquire each
// e.g. "50-250 points" role for "min: 50",
// "250-1000 points" role for "min: 250"
// Providing an empty array disables this feature
export const ROLE_LEVELS = [
    { id: "1004355700455133255", min: 50000 },
    { id: "1004355686618116097", min: 30000 },
    { id: "1004355630154387577", min: 20000 },
    { id: "1004355601226272849", min: 10000 },
    { id: "1004355576446324796", min: 5000 },
    { id: "1004355548080250901", min: 1000 },
    { id: "1004355530321559602", min: 250 },
    { id: "1004353626241769582", min: 50 },
    { id: "1004353557648130048", min: 0 },
]

// (optional) Bot IDs allowed to interact with this bot
// All other bots will be ignored
export const TRUSTED_BOTS = ["123456"]

// (optional) Slack webhook for logging grants
// https://api.slack.com/messaging/webhooks
export const SLACK_WEBHOOK = ""
