import { diffKeys, noData } from '../resources/constants';

/**
 * Convert seconds since epoch to a pseudo-UTC date, by adding timezoneoffset to the date.
 */
function epochToUTC(epoch)
{
    const d = new Date(epoch * 1000);
    return new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));
}

/**
 * Add a leading zero to a single-digit.
 * Can accept a double-digit, and returns it unchanged.
 */
function to2Digits(value) {
    return ("0" + value).slice(-2);
}

/**
 * Convert seconds value to a standard formatted date string
 */
function secondsToReadableDate(seconds)
{
    if (seconds.startsWith && seconds.startsWith('--')) return noData;

    var date = new Date(seconds * 1000);
    return `${date.getUTCFullYear()}-${to2Digits(date.getUTCMonth() + 1)}-${to2Digits(date.getUTCDate())} ${to2Digits(date.getUTCHours())}:${to2Digits(date.getUTCMinutes())}:${to2Digits(date.getUTCSeconds())}`;
}

function secondsToTimespan(seconds)
{
    if (seconds.startsWith && seconds.startsWith('--')) return noData;

    const d = new Date(seconds * 1000);
    const days = Math.floor(seconds / 86400);

    return `${( days > 0 ? `${days} day${( days > 1 ? "s" : "" )}, ` : "" )}${d.toISOString().substring(11,19)}`;
}

/**
 * Convert seconds value to YYYYMMDD format.
 */
function secondsToYYYYMMDD(seconds)
{
    let dateString = secondsToReadableDate(seconds);
    if (dateString === noData) return '';

    return dateString.split(' ')[0].replace(/-/g, '');
}

/**
 * Convert seconds value to string value of number of days, hours, etc.
 */
function secondsTo(seconds)
{
    let _seconds = parseInt(seconds);

    const days = Math.floor(_seconds / (60 * 60 * 24));
    _seconds -= days * (60 * 60 * 24);

    const hours = Math.floor(_seconds / (60 * 60));
    _seconds -= hours * (60 * 60);

    const minutes = Math.floor(_seconds / (60));
    _seconds -= minutes * (60);

    let str = "";

    if (days >= 1) {
        str +=  days + ` day${( days > 1 ? "s" : "" )}`;
    }
    if (hours >= 1) {
        str += " " + hours + ` hour${( hours > 1 ? "s" : "" )}`;
    }
    if (minutes >= 1) {
        str += " " + minutes + ` minute${( minutes > 1 ? "s" : "" )}`;
    }
    if (_seconds >= 1) {
        str += " " + _seconds + ` second${( _seconds > 1 ? "s" : "" )}`;
    }

    return str;
}

/**
 * Compares two date objects to see if they references (UTC) times within the same day
 */
function areSameDay(date1, date2)
{
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
}

/**
 * Compare values and return their status as same/changed/etc.
 */
function getDiff(A, B)
{

    if (A === null)
        return ( B === null ? diffKeys.same : diffKeys.added );
    else if (B === null)
        return ( A === null ? diffKeys.same : diffKeys.removed );
    else
        return ( A === B ? diffKeys.same : diffKeys.changed );
}

function toNumber(value)
{
    let val = value;
    if (typeof value === 'string') {
        if (value.startsWith('<'))
            val = "0.001";
        else if (!/^-?\d+(,?\d{3})*(\.\d*)?$/.test(value))
            console.log(`Another backend formatting decision encountered: value ${value} converted to number. Specific handling required?`);
        val = val.replace(/,/g, '');
    }
    return Number( val );
}

const integerFormatter = new Intl.NumberFormat('en-US', {style: 'decimal'}); 
const float3Formatter   = new Intl.NumberFormat('en-US', {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3});
const float6Formatter   = new Intl.NumberFormat('en-US', {style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 6});
const percentFormatter = new Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false});

function format(value, fmt)
{
    let fmtVal;
    switch (fmt) {
        case 'percent': {
            fmtVal = percentFormatter.format(value);
            break;
        }
        case 'int': {
            fmtVal = integerFormatter.format(value);
            break;
        }
        case 'float': {
            fmtVal = float3Formatter.format(value);
            break;
        }
        case 'float6': {
            fmtVal = float6Formatter.format(value);
            break;
        }
        default: {
            fmtVal = String(value);
        }
    }
    return fmtVal;
}

function capitalize(str)
{
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function isEmpty(obj) {
    if (!obj ||
        (obj.constructor === Array && obj.length === 0) ||
        (obj.constructor === Object && Object.keys(obj).length === 0))
    {
        return true;
    }
    return false;
}

function sortCaseInsensitive(a,b)
{
    let _a = a;
    let _b = b;
    if (a.toLowerCase && b.toLowerCase) {
        _a = a.toLowerCase();
        _b = b.toLowerCase();
    }
    return ( _a > _b ? 1 : _a < _b ? -1 : 0 );
}

function sortTimespanData(data)
{
    data.sort( (a, b) => {
        const a_beg = Number(a.beg);
        const a_end = Number(a.end);
        const b_beg = Number(b.beg);
        const b_end = Number(b.end);

        if (a_beg < b_beg)
            return -1;
        if (a_beg > b_beg)
            return 1;
        if (a_end < b_end)
            return -1;
        if (a_end > b_end)
            return 1;
        return 0;
    });

    return data;
}

export {
    epochToUTC,
    secondsToReadableDate,
    secondsToTimespan,
    secondsToYYYYMMDD, secondsTo,
    areSameDay,
    getDiff,
    toNumber,
    format,
    capitalize,
    isEmpty,
    sortCaseInsensitive, sortTimespanData
};
