const CRUD = require("../handlers/Database");
const oldData = require("./oldData.json");

const dat = Object.entries(oldData).map(user => {
    return { uid: user[0], img: user[1].background, orientation: user[1].orientation ? user[1].orientation : "none" }
})

CRUD.create(dat).then(() => process.exit(1))