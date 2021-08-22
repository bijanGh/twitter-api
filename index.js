/* eslint-disable no-unused-vars */
const axios = require("axios");
// intializing fastify instance
const fastify = require("fastify")({});
// register cors middleware in order to prevent CORS error when we request from our localhost
fastify.register(require("fastify-cors"), {
  origin: true,
});

/**
 * a neat query factory for getting user from twitter API
 * @param {string} user
 * @returns {string}
 */

const getUserQuery = (user) =>
  `https://api.twitter.com/2/users/by/username/${user}?user.fields=id,name,profile_image_url&tweet.fields=id,text,created_at,conversation_id `;

/**
 * a neat query factory for getting user's tweets or mentions from twitter API
 * @param {'mentions'|'tweets'} type
 * @param {string} user
 * @returns
 */
const getTweets = (type, user) =>
  `https://api.twitter.com/2/users/${user}/${type}?tweet.fields=id,text,created_at,conversation_id&max_results=${
    process.env.MAX_RESULT_COUNT ?? 20
  }`;

fastify.post("/getUser", async (req) => {
  const { user } = JSON.parse(req.body);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(getUserQuery(user), {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });
  return userData ?? undefined;
});

fastify.post("/tweets", async (req) => {
  const { user } = JSON.parse(req.body);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(getUserQuery(user), {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  const {
    data: { data: userTweets },
  } = await axios.get(getTweets("tweets", userData.id), {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  return { user: userData, tweets: userTweets };
});

fastify.post("/mentions", async (req, reply) => {
  console.log(
    "🚀 ~ file: index.js ~ line 71 ~ fastify.post ~ req.body",
    req.body
  );

  const { user } = req.body;
  console.log("🚀 ~ file: index.js ~ line 71 ~ fastify.post ~ user", user);

  if (!user) return new Error(`please add user to the body of the request`);

  const {
    data: { data: userData },
  } = await axios.get(getUserQuery(user), {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  const {
    data: { data: mentionedTweets },
  } = await axios.get(getTweets("mentions", userData.id), {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  return { user: userData, tweets: mentionedTweets };
});

// to check if it is working
fastify.all("/health-check", (req, reply) => {
  reply.send(`I'm OK!`);
});

const app = async () => {
  try {
    await fastify.listen(process.env.PORT || 4000, "0.0.0.0");
    console.log(`Our beautiful API is working, Let's conqure the world!!`);
  } catch (err) {
    console.log(
      `Our great API shamefully encounterd 
      an error on startup, our hope is lost`
    );
    fastify.log.error(err);
    process.exit(1);
  }
};

app();
