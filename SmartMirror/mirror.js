

mirror = {

    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],


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

        {
            const tnHrs = t.getHours();
            const nHrs = ((tnHrs >= 13) ? (tnHrs - 12) : tnHrs).toString();
            const ampm = (tnHrs >= 12) ? 'pm' : 'am';
            const nMins = t.getMinutes().toString();
            const tStr = `${nHrs} : ${nMins.padStart(2, '0')} ${ampm}`;
            document.getElementById('disp-time').innerText = tStr;
        }

        {
            const nDayName = this.days[t.getDay()];
            const nDate = this._getPrettyDate(t.getDate());
            const nMonth = this.months[t.getMonth()];

            document.getElementById('disp-date').innerHTML = `${nDayName}<br>${nDate} of ${nMonth}`;
        }

    },

    _setupTimeAndDate: function () {

        this._displayTimeAndDate();
        setInterval(this._dislayTimeAndDate, 1000);
    },



    main: function () {

        this._setupTimeAndDate();
    }
}


window.addEventListener('load', (ev) => { // load -> fully loaded
    mirror.main();
});
