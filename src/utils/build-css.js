const CRUD = require("../handlers/Database.js");
const path = require("path");
const fs = require("fs");

CRUD.read().then(data => { // Load data
    var backgrounds = {};
    var positionedBackgrounds = { left: [], right: [] };

    const createRule = (uids, rules) => `${uids.map(uid => `.root-3QyAh1[data-user-id="${uid}"],.userPopout-xaxa6l[data-user-id="${uid}"]`).join()}{${rules.join("")}}` // Builds css from array of ids

    for (let user of data) { // Iterate over each user
        if (user.orientation == "none") { // No orientation provided
            if (!backgrounds[user.img]) { // Checks if the background has been used before by someone
                backgrounds[user.img] = []; // Initialize an object in the backgrounds array with an array value for storing uids
            }
            backgrounds[user.img].push(user.uid) // Add uid to array object
        } else {
            if (!positionedBackgrounds[user.orientation][user.img]) { // Same thing but for users with positions specified
                positionedBackgrounds[user.orientation][user.img] = [];
            }
            positionedBackgrounds[user.orientation][user.img].push(user.uid);
        }
    }

    const noPosBgFragment = Object.entries(backgrounds).map(([bg, uid]) => // Build css for no position users by iterating over the background object
        [createRule(uid, [`--user-background:url("${bg}")`])] // Use es6 bullshittery to hack an array map in there
    ).join("") // Output as string

    const PosBgFragment = Object.entries(positionedBackgrounds).map(([pos, bgs]) => // Same thing but for users with positions
        Object.entries(bgs).map(([bg, uid]) => // Second iterator because of left & right positions
            createRule(uid, [`--user-background:url("${bg}");`, `--user-popout-position:${pos}!important`]) 
        ).join("")
    ).join("")

    fs.writeFileSync(path.join(__dirname, "..", "styles", "db.css"), [".userPopout-xaxa6l{--user-popout-position:center}", noPosBgFragment, PosBgFragment].join(""));
})
.catch(e => {
    console.error(e)
})