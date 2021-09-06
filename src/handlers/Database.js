const { PrismaClient } = require("@prisma/client"); // Prisma import

const prisma = new PrismaClient(); // New connection

async function create(params) {
    var res
    if (typeof params === "object") { // If params is an object, create a single new user
        if (!await read(params.uid)) res = await prisma.user.create({ // Check if user already exists
            data: params
        })
        else res = await update(params, params.uid) // Update if user exists
    }
    else { // Invalid input type
        res = "Invalid params, must be object or array of objects"
    }
    await prisma.$disconnect(); // End connection to db
    return res
}

async function read(val, key = "uid") { // Default to searching by uid, gives more choice for searching by img and id if needed
    var res
    if (key === "id") val = parseInt(val)
    if (!val) res = await prisma.user.findMany() // If no value is provided, return all users
    else res = await prisma.user.findMany({ // If value is provided and key is set to image, find all instances of a user with that image
        where: {
            [key]: val,
        }
    });
    if (Object.prototype.toString.call(res) == '[object Array]' && res.length < 2) res = res[0] // If response is a single item array, convert to object
    await prisma.$disconnect();
    return res
}

async function update(params, val, key = "uid") {
    var res
    if (!params || !val || typeof params !== "object") res = "Invalid input" // Validate input
    else res = await prisma.user.update({
        where: {
          [key]: val,
        },
        data: params,
    })
    await prisma.$disconnect();
    return res
}

async function del(val, key = "uid") { // No full delete... for good reason
    var res
    if (!val) res = "Missing input"
    else res = await prisma.user.delete({
        where: {
        [key]: val,
        },
    })
    await prisma.$disconnect();
    return res
}

module.exports = { read, create, update, del }

if( require.main === module ) {
    switch (process.argv[2]) {
        case "--read": case "-r":
            read(process.argv[3], process.argv[4]).then(res => console.log(res));
            break;
        case "--create": case "-c":
            create(JSON.parse(process.argv[3])).then(res => console.log(res));
            break;
        case "--update": case "-u":
            update(process.argv[3], process.argv[4], process.argv[5]).then(res => console.log(res));
            break;
        case "--delete": case "--del": case "-d":
            del(process.argv[3], process.argv[4]).then(res => console.log(res));
            break;
    }
}