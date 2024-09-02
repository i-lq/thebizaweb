export default (sametimecount, poparray, toppop, ended) => {
    var sameTime = [];
    var using = -1;
    var maxtp = poparray;
    var ended_pops = 0;
    if (Array.isArray(poparray)) {
        maxtp = poparray.length;
    };
    if (maxtp === 0) {
        ended();
        return;
    };
    var readyended = false;
    var rel = () => {
        using += 1;
        sameTime.push({
            index: using
        });
        var pop = (sameTime.length - 1);
        var readyNexted = false;
        if ((using) >= (maxtp)) {
            return;
        };
        if ((ended_pops) >= (maxtp)) {
            if (!readyended) {
                readyended = true;
                ended();
            };
            return;
        };
        toppop(using, () => {
            return new Promise((resolve_, reject_) => {
                if (!readyNexted) {
                    readyNexted = true;
                    sameTime.splice(pop, 1);
                    resolve_();
                    ended_pops += 1;
                    if ((ended_pops) >= (maxtp)) {
                        if (!readyended) {
                            readyended = true;
                            ended();
                        };
                        return;
                    } else {
                        rel();
                    };
                } else {
                    reject_();
                };
            });
        });
    };
    for (let index = 0; index < sametimecount; index++) {
        rel();
    };
};