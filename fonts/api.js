import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import crypto from "crypto";
import skyProcess from '../Libs/SkyThread.js';
let __dirname = path.dirname(fileURLToPath(import.meta.url));



export default (()=>{
    class Fonts {
        constructor() {
            if (!fs.existsSync(path.join(__dirname, `../public/fonts`))) {
                fs.mkdir(path.join(__dirname, `../public/fonts`), (err) => {
                    if (err) {
                        console.error(err);
                    };
                });
            };
            var Local = {
                Uuids: {},
                Cache: {}    
            };
            this.Catch = (uuid) => {
                if (typeof Local.Uuids[uuid] === `undefined`) {
                    return {
                        code: 404,
                        file: `/* Nothing here... */`
                    };
                };
    
                if (typeof Local.Uuids[uuid] === `object`) {
                    if (typeof Local.Uuids[uuid].wait === `boolean`) {
                        if (Local.Uuids[uuid].wait) {
                            return {
                                code: 206,
                                file: null
                            };
                        };
                    };
                };
    
                return {
                    code: 200,
                    file: Local.Uuids[uuid]
                };
            };

            this.Define = (fonts) => {
                var ThisShaForFonts = crypto.createHash('sha256').update(JSON.stringify(fonts)).digest('hex');
                if (typeof Local.Cache[ThisShaForFonts] !== `undefined`) {
                    return Local.Cache[ThisShaForFonts];
                };
    
                var u = `${crypto.randomUUID().replaceAll(`-`, ``)}`;
    
                Local.Uuids[u] = {
                    wait: true
                };
    
                var font = (element, end) => {
                    var value = Object.assign({
                        name: `Montserrat`,
                        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
                    }, element);
    
                    if (!fs.existsSync(path.join(__dirname, `family`, `${value.name}.json`))) {
                        end();
                        return;
                    };
    
                    fs.readFile(path.join(__dirname, `family`, `${value.name}.json`), 'utf-8', (err, data) => {
                        if (err) {
                            console.error(err);
                            end();
                            return;
                        };
                        var urr = null;
                        try {
                            JSON.parse(data);
                        } catch (err) {
                            urr = err;
                        };
    
                        if (urr) {
                            console.error(urr);
                            end();
                            return;
                        };
    
                        var data = JSON.parse(data);
                        var ob = Object.keys(data.weight);
    
                        skyProcess(3, ob, (ind3, nex3) => {
                            const element = ob[ind3];
                            const file = data.weight[element];
                            if (!value.weights.includes((element / 1))) {
                                nex3();
                                return;
                            };
    
                            fs.readFile(path.join(__dirname, `fonts`, file), 'utf-8', (err, dt) => {
                                if (err) {
                                    console.error(err);
                                    nex3();
                                    return;
                                };
                                var _t = dt.split(`\n`);
                                for (let index = 0; index < _t.length; index++) {
                                    const element = _t[index];
                                    if (element.includes(`url`)) {
                                        var _e = element.split(`;`);
                                        for (let index1 = 0; index1 < _e.length; index1++) {
                                            const element1 = _e[index1];
                                            if (element1.includes(`src:`)) {
                                                var url = element1.split(`url(`)[1].split(`)`)[0];
                                                dt = dt.replaceAll(url, `/fonts/${url}`);
                                                fs.copyFile(path.join(__dirname, `fonts`, url), path.join(__dirname, `../public/fonts`, url), (err) => {
                                                    if (err) {
                                                        console.error(err);
                                                    };
                                                });
                                            };
                                        };
                                    };
                                };
                                outfilecss += `${dt}`;
    
                                nex3();
                            });
                        }, () => {
                            end();
                        });
                    });
                };
                
                var end = () => {
                    fs.writeFile(path.join(__dirname, `../public/fonts/${u}.css`), outfilecss, (err) => {
                        if (err) {
                            console.error(err);
                        };
                    });
                    Local.Uuids[u] = outfilecss;
                    Local.Cache[ThisShaForFonts] = u;
                    ending = true;
                };
    
                var ending = false;
                var outfilecss = ``;
                if (Array.isArray(fonts)) {
                    skyProcess(1, fonts, (index, next) => {
                        const element = fonts[index];
                        font(element, () => {
                            next();
                        });
                    }, end);
                } else {
                    font(fonts, () => {
                        end();
                    });
                };
    
                return u;
            }
        };
    }
    return new Fonts();
})();

