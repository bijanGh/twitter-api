/* eslint-disable no-unused-vars */
const fastify = require("fastify")({});
import axios from "axios";

fastify.register(require("fastify-cors"), {
  origin: process.env.NODE_ENV === "production" ? false : true,
});

fastify.post("/getUser", async (req, reply) => {
  const { user } = JSON.parse(req.body);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(
    `https://api.twitter.com/2/users/by/username/${user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );
  return userData ?? undefined;
});

fastify.post("/tweets", async (req, reply) => {
  const { user } = JSON.parse(req.body);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(
    `https://api.twitter.com/2/users/by/username/${user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  const {
    data: { data: userTweets },
  } = await axios.get(
    `https://api.twitter.com/2/users/${userData.id}/tweets?tweet.fields=id,text,created_at,conversation_id&max_results=100 `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  return { user: userData, tweets: userTweets };
});

fastify.post("/mentions", async (req, reply) => {
  const { user } = JSON.parse(req.body);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(
    `https://api.twitter.com/2/users/by/username/${user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  const {
    data: { data: mentionedTweets },
  } = await axios.get(
    `https://api.twitter.com/2/users/${userData.id}/mentions?tweet.fields=id,author_id,text,created_at&user.fields=id,name,profile_image_url&max_results=100 `,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  return { user: userData, tweets: mentionedTweets };
});

fastify.all("/health-check", (req, reply) => {
  reply.send(true);
});

export default async () => {
  try {
    await fastify.listen(process.env.PORT || 4000, "0.0.0.0");
    console.log("shit started successfully");
  } catch (err) {
    console.log("🚀 ~ file: app.js ~ line 73 ~ err", err);
    fastify.log.error(err);
    process.exit(1);
  }
};
