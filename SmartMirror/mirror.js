
const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];



mirror = {

    _dateHandler: {


        _getPrettyDate: function (n) {

            let s = n.toString();
            switch (n) {
                case 1:
                case 21:
                case 31: s += 'st'; break;

                case 2:
                case 22: s += 'nd'; break;

                case 3:
                case 23: s += 'rd'; break;

                default: s += 'th'; break;

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
            setInterval(() => { this._displayTimeAndDate(); }, oneSecond);
        },
    },


    _dataCollector: {

        menus: {},
        calender: [],
        weather: {},

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

        _fetchMenu: async function () {

            try {
                this.menus = await this._fetchJSON('./menus.json');
            } catch (err) {
                console.log('menu fail');
            }
        },

        _displayMenu: function () {

            // console.log('displayMenus start');
            if (this.menus) {
                const d = new Date();
                const day = days[d.getDay()];

                if (this.menus[day]) {

                    const m = this.menus[day];
                    document.getElementById('disp-lunch').innerHTML = `${m.lunch.starter}<br>${m.lunch.mains}<br>${m.lunch.pudding}`;
                    document.getElementById('disp-dinner').innerHTML = `${m.dinner.starter}<br>${m.dinner.mains}<br>${m.dinner.pudding}`;

                } else {
                    console.log('No menu day', day, this.menus);
                }
            } else {
                console.log('No menus at all');
            }
            // console.log('displayMenus end');
        },


        _displayCalendar: function() {

            let str = '';
            this.calender.forEach( c => {

                str += '<div><hr>'
                c.forEach(l => {
                    str += l + '<br>';
                })
                str += '<hr></div>'
            });
            document.getElementById('disp-calendar').innerHTML = str;
        },

        _fetchCalendar: async function () {

            try {
                this.calender = await this._fetchJSON('./calendar.json');
            } catch (err) {
                console.log('calendar fail');
            }
        },


        _fetchData: async function () {

            console.log('Fetching...');
            await this._fetchMenu();
            this._displayMenu();


            await this._fetchCalendar();
            this._displayCalendar();

            console.log('Fetching end');
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
