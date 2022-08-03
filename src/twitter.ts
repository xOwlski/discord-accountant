import { Client, MessageEmbed, TextChannel } from 'discord.js';
import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2';
import fetch from 'node-fetch';
import { grantPoints } from './database/points';
import { Accountant } from 'client';

export const twitterClient = new TwitterApi({
    // @ts-ignore
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export let twitterApp: TwitterApi|null = null;

const twitterIdToDiscordId = async (twitterId: string) => {
    return fetch(`https://twittycord.com/api/getAllUsers?key=${process.env.TWITTYCORD_KEY}`).then((res) => {
        return res.json().then((users) => {
            const user = users.find((u) => u.connections.find((t) => t.name === 'twitter').accountId === twitterId);
            if (user) {
                return user.userId;
            }
            return null;
        });
    })
}

export const syncTwitter = async (client: Client) => {
    
    twitterApp = await twitterClient.appLogin();
    const { data: { id } } = await twitterApp.v2.userByUsername(process.env.TWITTER_USERNAME);
    console.log(`User id: ${id}`);

    await twitterApp.v2.updateStreamRules({
        add: [
          { value: `to:${id}`, tag: 'response' },
          { value: `@${process.env.TWITTER_USERNAME} has:mentions`, tag: 'mention' },
          { value: `retweets_of:${process.env.TWITTER_USERNAME}`, tag: 'retweet' },
        ],
    });

    const rules = await twitterApp.v2.streamRules();
    console.log(rules);
    
    const stream = await twitterApp.v2.searchStream();
  
    stream.on(
        // Emitted when Node.js {response} emits a 'error' event (contains its payload).
        ETwitterStreamEvent.ConnectionError,
        err => console.log('Connection error!', err),
    );
  
    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.'),
    );
    
    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        async (eventData) => {

            console.log(eventData.matching_rules)

            const id = eventData.data.id;
            const tweet = await twitterApp!.v2.singleTweet(id, {
                expansions: ['author_id'],
            });
            const userId = tweet.data.author_id;
            const discordId = await twitterIdToDiscordId(userId);

            console.log(tweet);

            if (discordId) {

                if (eventData.matching_rules.some((rule) => rule.tag === 'response')) {

                    await grantPoints(client.user, client.users.cache.get(discordId), 50, (client as Accountant).pool);

                    console.log(`${discordId} added a response and got rewarded with 10 points!`);
                    const user = client.users.cache.get(discordId) ?? await client.users.fetch(discordId);
                    (client.channels.cache.get('998675347925127329') as TextChannel).send({
                        embed: new MessageEmbed()
                            .setAuthor(user.tag, user.displayAvatarURL())
                            .setDescription(`${user.tag} added a Twitter response and got rewarded with 10 points!`)
                            .setColor('#00ff00')
                            .setTimestamp()
                    });
                }
                
                if (eventData.matching_rules[0]?.tag === 'mention') {

                    await grantPoints(client.user, client.users.cache.get(discordId), 100, (client as Accountant).pool);

                    console.log(`${discordId} added a mention and got rewarded with 10 points!`);

                    const user = client.users.cache.get(discordId) ?? await client.users.fetch(discordId);
                    (client.channels.cache.get('998675347925127329') as TextChannel).send({
                        embed: new MessageEmbed()
                            .setAuthor(user.tag, user.displayAvatarURL())
                            .setDescription(`${user.tag} added a Twitter mention and got rewarded with 10 points!`)
                            .setColor('#00ff00')
                            .setTimestamp()
                    });

                }

                if (eventData.matching_rules[0]?.tag === 'retweet') {

                    await grantPoints(client.user, client.users.cache.get(discordId), 75, (client as Accountant).pool);

                    console.log(`${discordId} added a retweet and got rewarded with 10 points!`);

                    const user = client.users.cache.get(discordId) ?? await client.users.fetch(discordId);
                    (client.channels.cache.get('998675347925127329') as TextChannel).send({
                        embed: new MessageEmbed()
                            .setAuthor(user.tag, user.displayAvatarURL())
                            .setDescription(`${user.tag} added a Twitter retweet and got rewarded with 10 points!`)
                            .setColor('#00ff00')
                            .setTimestamp()
                    });

                }
            }
        }
    );
    
    stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => {} //console.log('Twitter has a keep-alive packet.'),
    );
    
    // Enable reconnect feature
    stream.autoReconnect = true;

};
