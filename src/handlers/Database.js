const MongoClient = require('mongodb').MongoClient
const uri = `mongodb://${process.env.mongoIp}:27017/`
const client = new MongoClient(uri)
const connection = client.connect()

const getConnection = () => connection
const getClient = () => client

connection.then((client) => {
    client.db("usrbg").collection("usrbg").createIndex( {uid : 1} , {unique : true} )
})

async function create(dat) {
    let res
    const client = await connection
    if (Array.isArray(dat)) res = await client.db("usrbg").collection("usrbg").insertMany(dat);
    else res = await client.db("usrbg").collection("usrbg").updateMany({ uid: dat.uid }, { $set: dat }, { upsert: true });
    return res.insertedCount;
}

async function read(query, type = "uid") {
    const client = await connection
    const res = await client.db("usrbg").collection("usrbg").find(query ? { [type]: query } : {}).toArray();
    return res.length > 1 ? res : res[0]
}

async function del(query) {
    const client = await connection
    return (await client.db("usrbg").collection("usrbg").deleteOne({ uid: query })).deletedCount;
}

module.exports = { getConnection, getClient, create, read, del }

if( require.main === module ) {
    switch (process.argv[2]) {
        case "--read": case "-r":
            read(process.argv[3], process.argv[4]).then(res => {console.log(res); process.exit(1)});
            break;
        case "--create": case "-c":
            create(JSON.parse(process.argv[3])).then(res => {console.log(res); process.exit(1)});
            break;
        case "--delete": case "--del": case "-d":
            del(process.argv[3]).then(res => {console.log(res); process.exit(1)});
            break;
    }
}