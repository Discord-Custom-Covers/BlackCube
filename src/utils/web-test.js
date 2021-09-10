const cliProgress = require('cli-progress');
const fetch = require("node-fetch");
const util = require('util');

if( require.main === module ) {
    (async () => {
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        let errCount = 0
        const errData = new Map
        const max = process.argv[2] ? parseInt(process.argv[2]) : 1;
        console.log("Starting load test...")
        bar.start(max, 0);
        for (let i = 0; i < max; i++) {
            let res = await fetch("http://localhost/").catch(err => {console.log(err)})
            if (res.status !== 200) {
                if (process.argv[3] === "--verbose" || process.argv[3] === "-v") {
                    const errStatus = errData.get(res.status);
                    if (!errStatus) errData.set(res.status, [i]);
                    else errStatus.push(i);
                }
                errCount++
            }
            bar.increment();
        }
        bar.stop();
        
        if (process.argv[3] === "--verbose" || process.argv[3] === "-v") console.log(`Successfully completed ${max-errCount}/${max} tests.\nVerbose mode enabled... Logging contents of failed requests:\n${util.inspect(errData, { colors: true })}`)
        else console.log(`Successfully completed ${max-errCount}/${max} tests.\nTo see more information run this script with the --verbose (-v) tag.`)
    })();
}
else {
    console.log("Error: Script must be run directly, not imported as a module")
}