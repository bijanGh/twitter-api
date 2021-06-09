const fastify = require("fastify")({ logger: true });

fastify.register(require("fastify-cors"), { origin: false });

fastify.get("/", (req, reply) => {
  reply.send({ hello: "world" });
});

fastify.post("/parrot", (req, reply) => {
  reply.send(req.body);
});

fastify.get("/health-check", (req, reply) => {
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
