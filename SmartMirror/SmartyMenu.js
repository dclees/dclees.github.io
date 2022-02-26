
console.log('SmaryMenu loaded and ready, Sir!');
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];

const appStatus = {
    numMenuLoads: 0,
    numPingsMissed: 0,
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
    if (level > 0) {
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
        dbgLog(`Day:${day}:${todayName}`);

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

const updateFooter = () => {

    const footEl = document.getElementById('footer');
    footEl.innerText = `Menu Loads: ${appStatus.numMenuLoads}, Pings Missed: ${appStatus.numPingsMissed}`;
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

        updateFooter();

    } catch (err) {
        throw err;
    }
}

const doNightAndDay = () => {

    try {

        const now = new Date();
        now.getHours();
        dbgLog(`${now.getHours()}:${now.getMinutes()}`);

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

const mainLoop = (numSeconds) => {

    try {
        doNightAndDay();
        doDataFetch();
    } catch (error) {
        dbgLog(`mainLoop:err:${err}`);
    }

    setInterval(() => {

        try {
            doDataFetch();
            doNightAndDay();
        }
        catch (err) {
            dbgLog(`mainLoop:err:${err}`);
        }

    }, numSeconds * 1000);
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

const autoRefeshEvery = (numSeconds) => {

    setInterval(refreshPage, numSeconds * 1000);
}

const swapToFullScreen = (numSeconds) => {

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
        }
        if (numSeconds === 0) {
            fullScreen();
        } else {
            setTimeout(fullScreen, numSeconds * 1000);
        }
    } catch (error) {
        dbgLog(`failed full screen: ${error}`);
    }
}

mainLoop(5);
autoRefeshEvery(10 * 60);

const bodyEl = document.getElementById("body");
bodyEl.addEventListener('click', (ev) => {

    // dbgLog('Clicked', 1);
    swapToFullScreen(0);
});

// let nHello = 0;
// setInterval( () => {
//     nHello += 1;
//     dbgLog(`Some quite long text for debug puroposes: ${nHello}`, 1)
// }, 1000);

// dbgLog('Loaded', 1);
// dbgLog('Loaded', 1);

