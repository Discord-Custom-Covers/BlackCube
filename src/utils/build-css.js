require("../handlers/Database.js").read().then(data => {
    const createRule = (uids, rules) => `${uids.map(uid => `.root-3QyAh1[data-user-id="${uid}"],.userPopout-xaxa6l[data-user-id="${uid}"]`).join()}{${rules.join("")}}`

    const backgrounds = new Map(Object.entries({ none: new Map, left: new Map, right: new Map }))

    for (const { orientation, img, uid } of data) {
        const map = backgrounds.get(orientation);
        const background = map.get(img);
        if (!background) map.set(img, [uid]);
        else background.push(uid);
    }

    const css = [...backgrounds].map(([orientation, map]) => {
        return [...map].map(([img, uids]) => {
            if (orientation === "none") return createRule(uids, [`--user-background:url("${img}")`])
            else return createRule(uids, [`--user-background:url("${img}");`, `--user-popout-position:${orientation}!important`]) 
        }).join("");
    }).join("");

    require("fs").writeFileSync(require("path").join(__dirname, "..", "styles", "db.css"), ".userPopout-xaxa6l{--user-popout-position:center}" + css);
})
.catch(e => {
    console.error(e)
})