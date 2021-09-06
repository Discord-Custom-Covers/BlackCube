const { PrismaClient } = require("@prisma/client");
const cliProgress = require('cli-progress');
const users = require("./oldData.json");

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(Object.keys(users).length, 0);

const prisma = new PrismaClient();

(async () => {
    for (let [key, value] of Object.entries(users)) {
        await prisma.user.create({data: {uid: key, img: value.background, orientation: value.orientation ?? "none"}})
        bar.increment()
    }
    await prisma.$disconnect();
    bar.stop();
})();