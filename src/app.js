/* eslint-disable no-unused-vars */
const fastify = require("fastify")({});
import axios from "axios";

fastify.register(require("fastify-cors"), { origin: false });

fastify.post("/tweets", async (req, reply) => {
  if (!req.body.user)
    return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(
    `https://api.twitter.com/2/users/by/username/${req.body.user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  const {
    data: { data: userTweets },
  } = await axios.get(
    `https://api.twitter.com/2/users/${userData.id}/tweets?tweet.fields=id,text,created_at,conversation_id&max_results=2 `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  return userTweets ?? [];
});

fastify.post("/mentions", async (req, reply) => {
  if (!req.body.user)
    return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(
    `https://api.twitter.com/2/users/by/username/${req.body.user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  const {
    data: { data: mentionedTweets },
  } = await axios.get(
    `https://api.twitter.com/2/users/${userData.id}/mentions?tweet.fields=id,author_id,text,created_at&user.fields=id,name,profile_image_url&max_results=10 `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  return mentionedTweets ?? [];
});

fastify.all("/health-check", (req, reply) => {
  reply.send(true);
});

export default async () => {
  try {
    await fastify.listen(process.env.PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
