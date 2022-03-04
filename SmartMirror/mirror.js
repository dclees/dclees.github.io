const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];



mirror = {

    _dateHandler: {


        _getPrettyDate: function (n) {

            let s = n.toString();
            switch (n) {
                case 1:
                case 21:
                case 31:
                    s += 'st';
                    break;

                case 2:
                case 22:
                    s += 'nd';
                    break;

                case 3:
                case 23:
                    s += 'rd';
                    break;

                default:
                    s += 'th';
                    break;

            }
            return s;
        },


        _displayTimeAndDate: function () {

            const t = new Date();
            // console.dir(t);

            // time
            {
                const tnHrs = t.getHours();
                const nHrs = ((tnHrs >= 13) ? (tnHrs - 12) : tnHrs).toString();
                const ampm = (tnHrs >= 12) ? 'pm' : 'am';
                const nMins = t.getMinutes().toString();
                const tStr = `${nHrs} : ${nMins.padStart(2, '0')} ${ampm}`;
                document.getElementById('disp-time').innerText = tStr;
            }

            // date
            {
                const nDayName = days[t.getDay()];
                const nDate = this._getPrettyDate(t.getDate());
                const nMonth = months[t.getMonth()];

                document.getElementById('disp-date').innerHTML = `${nDayName}<br>${nDate} of ${nMonth}`;
            }

        },

        _setupTimeAndDate: function () {

            this._displayTimeAndDate();
            setInterval(() => {
                this._displayTimeAndDate();
            }, oneSecond);
        },
    },


    _dataCollector: {

        _fetchJSON: async function (url) {
            const d = fetch(url)
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    }
                    throw new Error('Bad resp!=200, not ok');
                })
                .then(json => {
                    // console.dir(json);
                    return json;
                })
                .catch(err => {
                    console.log(`Failed: ${err}`);
                    return null;
                });
            return d;
        },

        _menu: {
            _menus: {},

            _fetch: async function () {

                try {
                    this._menus = await mirror._dataCollector._fetchJSON('./menus.json');
                } catch (err) {
                    console.log('menu fail');
                }
            },

            _display: function () {

                // console.log('displayMenus start');
                if (this._menus) {
                    const d = new Date();
                    const day = days[d.getDay()];

                    if (this._menus[day]) {

                        const m = this._menus[day];
                        document.getElementById('disp-lunch').innerHTML = `${m.lunch.starter}<br>${m.lunch.mains}<br>${m.lunch.pudding}`;
                        document.getElementById('disp-dinner').innerHTML = `${m.dinner.starter}<br>${m.dinner.mains}<br>${m.dinner.pudding}`;

                    } else {
                        console.log('No menu day', day, this._menus);
                    }
                } else {
                    console.log('No menus at all');
                }
                // console.log('displayMenus end');
            },
        },


        _calendar: {
            _calender: [],

            _display: function () {

                let str = '';
                this._calender.forEach(c => {

                    str += '<div><hr>'
                    c.forEach(l => {
                        str += l + '<br>';
                    })
                    str += '<hr></div>'
                });
                document.getElementById('disp-calendar').innerHTML = str;
            },

            _fetch: async function () {

                try {
                    this._calender = await mirror._dataCollector._fetchJSON('./calendar.json');
                } catch (err) {
                    console.log('calendar fail');
                }
            },
        },

        _weather: {

            _weather: {},

            _fetch: async function () {

                try {
                    this._weather = await mirror._dataCollector._fetchJSON('./weather.json');
                } catch (err) {
                    console.log('weather fail', err);
                }
            },

            _display: function () {

                const w = this._weather;
                const deg = `&#176;`;

                document.getElementById('disp-temp').innerHTML = `
                Current: ${w.main.temp.toFixed(1)}${deg}C<br>
                Max: ${w.main.temp_max.toFixed(1)}${deg}C<br>
                Min: ${w.main.temp_min.toFixed(1)}${deg}C<br>
                Feels like: ${w.main.feels_like.toFixed(1)}${deg}C
                `;

                const icon = w.weather[0].icon;
                document.getElementById('disp-weather-icon').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                document.getElementById('disp-weather-description').innerText = `${w.weather[0].description}`
            }
        },


        _fetchData: async function () {

            // console.log('Fetching...');
            await this._menu._fetch();
            this._menu._display();


            await this._calendar._fetch();
            this._calendar._display();

            await this._weather._fetch();
            this._weather._display();

            // console.log('Fetching end');
        },

        _setupFetchData: function () {
            this._fetchData();
            setInterval(() => this._fetchData(), 5 * oneMinute);
        }
    },



    main: function () {

        this._dateHandler._setupTimeAndDate();
        this._dataCollector._setupFetchData();
    }
}


window.addEventListener('load', (ev) => { // load -> fully loaded
    mirror.main();
});