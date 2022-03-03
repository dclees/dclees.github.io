
// console.log('SmartyMenu loaded and ready, Sir!');
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];

const oneSecond = (1000);
const oneMinute = (60 * oneSecond);
const oneHour = (60 * oneMinute);


const appStatus = {
    numDisplay: 0,
    numMenuLoads: 0,
    numPingsMissed: 0,
    secondsBetweenMenuLoads: 30 * oneMinute,
    secondsForAppReload: 4 * oneHour,
    lastLoaded: new Date(),
};


let dbgStr = '';
const addDebug = (str) => {

    try {
        dbgStr += str + '\n';
        if (dbgStr.length > 100) {
            const f = dbgStr.indexOf('\n') + 1;
            dbgStr = dbgStr.slice(f);;
        }
        const dbgEl = document.getElementById("debug");
        dbgEl.innerText = dbgStr;
    }
    catch (error) {
    }
}


const dbgLog = (str, level) => {
    // if (level > 0)
     {

        const dbgMainEl = document.getElementById("dbgMain");
        dbgMainEl.hidden = false;
    
        console.log(str);
        addDebug(str);
    }
}

const fetchMenu = async () => {

    try {
        const data = await fetch('./menus.json')
            .then(resp => {

                if (resp.ok) {
                    return resp.json();
                }
            })
            .then(obj => {
                // dbgLog(`json1:${JSON.stringify(obj)}`);
                return obj;
            });
        return data;
    } catch (err) {
        throw new Error("Failed to load json");
    }
    return null;
}

const displayMenu = (obj) => {

    try {
        const d = new Date();
        let day = d.getDay();
        const todayName = dayNames[d.getDay()];
        const todaysMenu = obj[todayName];

        const dayEl = document.getElementById('date');
        dayEl.innerText = `${todaysMenu.day}`

        const meals = ['lunch', 'dinner'];
        const courses = ['starter', 'mains', 'pudding'];
        meals.forEach(m => {

            courses.forEach(c => {

                const mcEl = document.getElementById(`${m}_${c}`);
                mcEl.innerText = todaysMenu[m][c];
            });

        });

    } catch (err) {
        dbgLog(`displayMenu:err:${err}`, 1);
    }
}

const dTimeToHMS = (dTime) => {

    const secondsInMinute = 60
    const secondsInHr = (60 * secondsInMinute);

    let secs = Math.floor(dTime / 1000);

    const nHr = Math.floor(secs / secondsInHr);
    secs -= nHr * secondsInHr;

    const nMin = Math.floor(secs / secondsInMinute);
    secs -= nMin * secondsInMinute;

    let s = '';
    if (nHr > 0) s += `${nHr}hr `;
    if (nMin > 0) s += `${nMin}m`;
    if (secs > 0) s += ` ${secs}s`

    return s;
}

const updateStatusInfo = () => {

    appStatus.numDisplay += 1;

    const footEl = document.getElementById('footer');
    footEl.innerText = `${appStatus.numDisplay}) Menu Loads: ${appStatus.numMenuLoads}, Pings Missed: ${appStatus.numPingsMissed}, ` +
        `Menus:${dTimeToHMS(appStatus.secondsBetweenMenuLoads)}, ` +
        `Reload:${dTimeToHMS(appStatus.secondsForAppReload)}, ` +
        `Last Loaded:${appStatus.lastLoaded.toLocaleDateString()} at ${appStatus.lastLoaded.toLocaleTimeString()}`;
}

const doMenu = async () => {

    try {
        const res = await fetchMenu()
            .then(obj => {
                // dbgLog(`json2:${JSON.stringify(obj)}`);
                displayMenu(obj);
            });

    } catch (err) {
        dbgLog(`Failed in doMenu: ${err}`, 1)
    }
}

const doDataFetch = () => {

    try {
        doMenu();
        appStatus.numMenuLoads += 1;

        updateStatusInfo();

    } catch (err) {
        throw err;
    }
}

const doNightAndDay = () => {

    try {

        const now = new Date();
        now.getHours();
        // dbgLog(`doNightAndDay:${now.getHours()}:${now.getMinutes()}`);

        // const mins = now.getMinutes();
        // const isDayTime = ((mins % 2) == 0);
        // const secs = now.getSeconds();
        // const isDayTime = ((secs % 10) < 5);
        const hr = now.getHours();
        const isDayTime = ((hr >= 8) && (hr <= 18));
        // dbgLog(`${secs}:${isDayTime}`);
        const newDayNightClass = isDayTime ? 'daytime' : 'nighttime';

        const bodyEl = document.getElementById("body");
        if (isDayTime) {

            bodyEl.classList.remove('nighttime');
            bodyEl.classList.add('daytime');

        } else {

            bodyEl.classList.remove('daytime');
            bodyEl.classList.add('nighttime');
        }
        // dbgLog(`Swapping day/night class to ${newDayNightClass}, CL<${bodyEl.classList}>`, 1);

    } catch (error) {
        dbgLog(`doDayNight:${error}`);
    }
}

const mainLoop = (dTime) => {

    try {
        doNightAndDay();
        doDataFetch();
    } catch (error) {
        dbgLog(`mainLoop:err:${error}`);
    }

    setInterval(() => {

        try {
            doDataFetch();
            doNightAndDay();
        }
        catch (err) {
            dbgLog(`mainLoop:err:${err}`);
        }

    }, dTime);
}

const refreshPage = async () => {

    try {
        await fetch('./pingFile')   // ONLY IF FILE GOT DO WE TRY AN DREFRESH THE PAGE!!
            .then(response => {

                if (response.ok) {
                    dbgLog('refresh', 1); location.reload(true);
                } else {
                    dbgLog(`Failed to get pingFile`);
                    appStatus.numPingsMissed += 1;
                }
            });

    } catch (error) {
        dbgLog(`refreshPage:${err}`)
    }
}

const autoRefeshEvery = (dTime) => {

    setInterval(refreshPage, dTime);
}


const showTime = () => {

    try {
        const t = new Date();
        const nHr = t.getHours();
        const nMins = t.getMinutes();
        const ampm = (nHr > 11)? 'pm' : 'am';

        const dispHr = (nHr <= 12) ? nHr : nHr-12;
        const sHr = dispHr.toString().padStart(2, '0');
        const sMin = nMins.toString().padStart(2, '0');

        const timeEl = document.getElementById('time_now');
        const tStr = `${sHr}:${sMin} ${ampm}`;
        timeEl.innerText = tStr;

        dbgLog(`showTime:${tStr}`);

    } catch (error) {
        dbgLog(`Can't get time ${error}`);
    }
}

const timeLoop = (dTime) => {

    showTime();
    setInterval(() => {

        showTime();

    }, dTime);
}

const swapToFullScreen = (dTime) => {

    try {

        const fullScreen = () => {

            // dbgLog('Trying fullscreen', 1);
            const el = document.documentElement;
            if (el.requestFullscreen) {
                // dbgLog('requestFullscreen full screen', 1);
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) { /* Safari */
                // dbgLog('webkitRequestFullscreen full screen', 1);
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) { /* IE11 */
                // dbgLog('msRequestFullscreen full screen', 1);
                el.msRequestFullscreen();
            } else {
                dbgLog('Unknown full screen', 1);
            }
            dbgLog("Fullscreen");
        }
        if (dTime === 0) {
            fullScreen();
        } else {
            setTimeout(fullScreen, dTime);
        }
    } catch (error) {
        dbgLog(`failed full screen: ${error}`);
    }
}

const bodyEl = document.getElementById("body");
bodyEl.addEventListener('click', (ev) => {

    try {
        swapToFullScreen(0);
    } catch (err) {
    }
});

// let nHello = 0;
// setInterval( () => {
//     nHello += 1;
//     dbgLog(`Some quite long text for debug puroposes: ${nHello}`, 1)
// }, oneSecond);

const main = () => {

    const dbgMainEl = document.getElementById("dbgMain");
    dbgMainEl.hidden = true;

    setTimeout(() => updateStatusInfo(), oneMinute);
    timeLoop(10*oneSecond);
    mainLoop(appStatus.secondsBetweenMenuLoads);
    autoRefeshEvery(appStatus.secondsForAppReload);
}

window.onload = function() { main(); };
