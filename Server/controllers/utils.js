exports.commonResponce = (res, status, message, data) => {
    return res
      .status(status)
      .json({ status: status, message: message, data: data });
  };



  exports.dateTimeFormate=(currentDate)=>{
// Format the date
const dd = String(currentDate.getDate()).padStart(2, '0');
const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const yyyy = currentDate.getFullYear();

// Format the time
const hh = String(currentDate.getHours()).padStart(2, '0');
const min = String(currentDate.getMinutes()).padStart(2, '0');
const ss = String(currentDate.getSeconds()).padStart(2, '0');

// Create the formatted date and time string
const formattedDateTime = `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
return formattedDateTime;

  }
  
  exports.dates = {
    convert: function (d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp)
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return d.constructor === Date
        ? d
        : d.constructor === Array
        ? new Date(d[0], d[1], d[2])
        : d.constructor === Number
        ? new Date(d)
        : d.constructor === String
        ? new Date(d)
        : typeof d === "object"
        ? new Date(d.year, d.month, d.date)
        : NaN;
    },
    compare: function (a, b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return isFinite((a = this.convert(a).valueOf())) &&
        isFinite((b = this.convert(b).valueOf()))
        ? (a > b) - (a < b)
        : NaN;
    },
    inRange: function (d, start, end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
      return isFinite((d = this.convert(d).valueOf())) &&
        isFinite((start = this.convert(start).valueOf())) &&
        isFinite((end = this.convert(end).valueOf()))
        ? start <= d && d <= end
        : NaN;
    },
    datetoDDMMYYDashFormat: function (date) {
    
      return (
        date.getDate().toString() +
        "-" +
        (date.getMonth() + 1).toString() +
        "-" +
        date.getFullYear().toString()
      );
    },
  };
  