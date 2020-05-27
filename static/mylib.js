function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(), 
        hour=d.getHours(),
        minute=d.getMinutes(),
        second=d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var ret = [year, month, day].join('-')+' '+hour+':'+minute+':'+second;
    return ret;

}
