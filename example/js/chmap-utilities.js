(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("bootstrap"));
	else if(typeof define === 'function' && define.amd)
		define(["bootstrap"], factory);
	else if(typeof exports === 'object')
		exports["chmapUtilities"] = factory(require("bootstrap"));
	else
		root["chmapUtilities"] = factory(root["bootstrap"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE_bootstrap__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/bootstrp-wrap.js":
/*!******************************!*\
  !*** ./src/bootstrp-wrap.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Toast": function() { return /* reexport safe */ bootstrap__WEBPACK_IMPORTED_MODULE_0__.Toast; },
/* harmony export */   "Offcanvas": function() { return /* reexport safe */ bootstrap__WEBPACK_IMPORTED_MODULE_0__.Offcanvas; },
/* harmony export */   "Popover": function() { return /* reexport safe */ bootstrap__WEBPACK_IMPORTED_MODULE_0__.Popover; },
/* harmony export */   "Modal": function() { return /* reexport safe */ bootstrap__WEBPACK_IMPORTED_MODULE_0__.Modal; },
/* harmony export */   "Collapse": function() { return /* reexport safe */ bootstrap__WEBPACK_IMPORTED_MODULE_0__.Collapse; }
/* harmony export */ });
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "bootstrap");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_0__);





/***/ }),

/***/ "./src/commons.js":
/*!************************!*\
  !*** ./src/commons.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitterClass": function() { return /* binding */ EventEmitterClass; },
/* harmony export */   "SnowflakeID": function() { return /* binding */ SnowflakeID; },
/* harmony export */   "YearMetadata": function() { return /* binding */ YearMetadata; }
/* harmony export */ });

class EventEmitterClass {

    constructor() {
        this._events = {};
    }

    on(name, listener) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(listener);
    }

    removeListener(name, listenerToRemove) {

        if (!this._events[name]) {
            // throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
            return;
        }

        const filterListeners = (listener) => listener !== listenerToRemove;

        this._events[name] = this._events[name].filter(filterListeners);
    }

    emit(name, params) {

        if (!this._events[name]) {
            // throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
            return;
        }

        const fireCallbacks = (listener) => {
            listener(params);
        };

        this._events[name].forEach(fireCallbacks);
    }
}

const SnowflakeID = function(){

    let nowId = 0;

    function next(){
        return nowId++;
    }

    return {
        next
    }
}();

// const UUIDGenerator = function () {
//
//     function next(){
//
//         // Public Domain/MIT
//         let d = new Date().getTime();
//
//         if ( typeof performance !== "undefined" && typeof performance.now === "function") {
//             d += performance.now(); //use high-precision timer if available
//         }
//
//         return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//
//             const r = (d + Math.random() * 16) % 16 | 0;
//
//             d = Math.floor(d / 16);
//
//             return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
//         });
//     }
//
//     return {
//         next,
//     }
//
// }();

const YearMetadata = function(){

    function query(year, callback, errorCallback){

        const dateStr = year.toString() + "-06-01";

        const isoString = (new Date(dateStr)).toISOString();

        const url = `//authority.dila.edu.tw/webwidget/getAuthorityData.php?type=time&when=${isoString}&format=s`;

        fetch(url)
        .then(response => response.ok ? response : Promise.reject({err: response.status}))
        .then(response => response.json())
        .then(json => {

            const root = json.W;

            const html = [`<div class="mb-2">${year + "-06-01"}</div>`];

            for(const key in root) {

                const parent = root[key];

                html.push(`<div class="mb-2"><span class="key">${key}</span><div class="ps-4">`);

                for(const subKey in parent) {
                    const value = parent[subKey];
                    html.push(`<span class="fw-bolder">${subKey}</span>: <span class="key">${value}</span><br>`);
                }

                html.push(`</div></div>`);
            }

            html.push('<br/>Data provider: <a href="https://authority.dila.edu.tw/time/" target="_blank">DILA時間規範資料庫</a>');

            callback(html.join(''));

        })
        .catch(error => {
            console.error('Error:', error);
            errorCallback('Cannot access DILA時間規範資料庫 service, please contact administrators', 'warning')
        });

    }

    return {
        query,
    }

}();




/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GEO_REF_IMG_SIZE": function() { return /* binding */ GEO_REF_IMG_SIZE; },
/* harmony export */   "POPUP_THUMBNAIL_WIDTH": function() { return /* binding */ POPUP_THUMBNAIL_WIDTH; },
/* harmony export */   "PHOTO_ICON_SIZE": function() { return /* binding */ PHOTO_ICON_SIZE; },
/* harmony export */   "PUBLIC_MAP_API_URL": function() { return /* binding */ PUBLIC_MAP_API_URL; },
/* harmony export */   "IIIF_VIEWER_URL": function() { return /* binding */ IIIF_VIEWER_URL; },
/* harmony export */   "EXAMPLE_FILES_DIR": function() { return /* binding */ EXAMPLE_FILES_DIR; }
/* harmony export */ });

String.prototype.interpolate = function(params) {
    const names = Object.keys(params);
    const values = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...values);
}

const GEO_REF_IMG_SIZE = 500;

const POPUP_THUMBNAIL_WIDTH = 300;

const PHOTO_ICON_SIZE = 55;

const PUBLIC_MAP_API_URL = "http://localhost/publicMaps.php";

const IIIF_VIEWER_URL = "http://localhost/mirador/index.html?mf=${manifestId}&ci=${canvasId}";

const EXAMPLE_FILES_DIR = "example-files/";




/***/ }),

/***/ "./src/data-processor/csv-processor.js":
/*!*********************************************!*\
  !*** ./src/data-processor/csv-processor.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "process": function() { return /* binding */ process; }
/* harmony export */ });
/* harmony import */ var _data_props_mapping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-props-mapping */ "./src/data-processor/data-props-mapping.js");


function process(text) {

    const {headerArray, headerMap, data} = csv2JSON(text);

    (0,_data_props_mapping__WEBPACK_IMPORTED_MODULE_0__.mapCSVRequiredProps)(headerMap, data);

    if (headerMap.ID !== undefined) {
        data.sort((a, b) => parseInt(a.ID) - parseInt(b.ID));
    }
    if (headerMap.Page !== undefined) {
        data.sort((a, b) => parseInt(b.Page) - parseInt(a.Page));
    }

    return {headerArray, headerMap, items: data};

}

function csv2Array(CSV_string, delimiter) {

    delimiter = (delimiter || ","); // user-supplied delimeter or default comma

    const pattern = new RegExp( // regular expression to parse the CSV values.
    ( // Delimiters:
    "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + delimiter + "\\r\\n]*))"
    ), "gi"
    );

    const rows = [[]];  // array to hold our data. First row is column headers.
    // array to hold our individual pattern matching groups:
    let matches = false; // false if we don't find any matches
    // Loop until we no longer find a regular expression match
    while (matches = pattern.exec(CSV_string)) {
        const matched_delimiter = matches[1]; // Get the matched delimiter
        // Check if the delimiter has a length (and is not the start of string)
        // and if it matches field delimiter. If not, it is a row delimiter.
        if (matched_delimiter.length && matched_delimiter !== delimiter) {
            // Since this is a new row of data, add an empty row to the array.
            rows.push([]);
        }
        let matched_value;
        // Once we have eliminated the delimiter, check to see
        // what kind of value was captured (quoted or unquoted):
        if (matches[2]) { // found quoted value. unescape any double quotes.
            matched_value = matches[2].replace(
            new RegExp("\"\"", "g"), "\""
            );
        } else { // found a non-quoted value
            matched_value = matches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        rows[rows.length - 1].push(matched_value);
    }

    return rows; // Return the parsed data Array

}

function csv2JSON(csvStr) {

    const aryCSV = csv2Array(csvStr);

    const headers = aryCSV[0], result = [], headerLen = headers.length;

    const headerArray = [], headerMap = {};

    let header, headerWOSpace;
    for (let idx = 0; idx < headerLen; idx++) {

        header = headers[idx];

        headerWOSpace = headers[idx].replace(/\s/g, '');

        headers[idx] = headerWOSpace;

        headerMap[headerWOSpace] = header;

        headerArray.push(headerWOSpace)
    }

    let rec, currentline, val;

    for (let idx = 1, len = aryCSV.length; idx < len; idx++) {

        rec = {};

        currentline = aryCSV[idx];

        if (currentline.length < headerLen) continue;

        for (let idx2 = 0; idx2 < headerLen; idx2++) {

            val = currentline[idx2];

            rec[headers[idx2]] = (val) ? val : '';
        }

        result.push(rec);

    }

    return {headerArray, headerMap, data: result};
}


/***/ }),

/***/ "./src/data-processor/data-props-mapping.js":
/*!**************************************************!*\
  !*** ./src/data-processor/data-props-mapping.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapCSVRequiredProps": function() { return /* binding */ mapCSVRequiredProps; },
/* harmony export */   "mapGeoJSONRequiredProps": function() { return /* binding */ mapGeoJSONRequiredProps; }
/* harmony export */ });
function mapCSVRequiredProps(headerMap, rows){

    //TODO: Hard coding
    const rules = [
        {required: 'ID', alias: 'BookID'},
        {required: 'name', alias: 'BookName'},
        {required: 'date', alias: 'BookYear'},
    ];

    for(const rule of rules){
        convert(headerMap, rule.required, rule.alias);
    }

    for(const row of rows){

        mapRequiredProps(row, rules);

    }

}

function mapGeoJSONRequiredProps(props){

    //TODO: Hard coding
    const rules = [
        {required: 'ID', alias: 'OBSERVER_I'},
        {required: 'name', alias: 'COMMON_NAM'},
        {required: 'imageURL', alias: 'Pict'},
        {required: 'date', alias: 'OBSERVAT_1'},
        {required: 'ID', alias: '圖徵編號'},
        {required: 'name', alias: '空間名稱'},
        {required: 'imageURL', alias: '空間圖像'},
        {required: 'date', alias: '建立時間'},
    ];

    mapRequiredProps(props, rules);

}

function mapRequiredProps(props, rules){

    for(const rule of rules){

        convert(props, rule.required, rule.alias);

    }

}

function convert(props, requiredKey, aliasKey){

    const required = props[requiredKey];
    const alias = props[aliasKey];

    if(!required && alias) {
        props[requiredKey] = alias;
    }

}




/***/ }),

/***/ "./src/data-processor/geo-json-processor.js":
/*!**************************************************!*\
  !*** ./src/data-processor/geo-json-processor.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shouldIHandle": function() { return /* binding */ shouldIHandle; },
/* harmony export */   "process": function() { return /* binding */ process; }
/* harmony export */ });
/* harmony import */ var _data_props_mapping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-props-mapping */ "./src/data-processor/data-props-mapping.js");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../date-utils */ "./src/date-utils.js");



function shouldIHandle(text) {
    return text.indexOf("FeatureCollection") >= 0;
};

function process(text) {

    const json = JSON.parse(text);

    const items = [];

    for (let idx = 0, len = json.features.length; idx < len; idx++) {

        const feature = json.features[idx];

        const {properties, geometry} = feature;

        (0,_data_props_mapping__WEBPACK_IMPORTED_MODULE_0__.mapGeoJSONRequiredProps)(properties);

        const {ID, name, imageURL, date} = properties;

        const obj = {ID, name};

        obj.imageURL = imageURL || "#";
        obj.Longitude = geometry.coordinates[0] || 0;
        obj.Latitude = geometry.coordinates[1] || 0;
        obj.date = _date_utils__WEBPACK_IMPORTED_MODULE_1__["default"].parse(date, "yyyy/M/d t HH:mm:ss");
        obj.all = properties;

        items.push(obj);

    }

    return {items, json};
}


/***/ }),

/***/ "./src/data-processor/iiif-processor.js":
/*!**********************************************!*\
  !*** ./src/data-processor/iiif-processor.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shouldIHandle": function() { return /* binding */ shouldIHandle; },
/* harmony export */   "process": function() { return /* binding */ process; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");


function shouldIHandle(text) {

    return text.indexOf("http://iiif.io") >= 0;

};

function process(text) {

    const json = JSON.parse(text);

    const manifestId = json['@id'];

    const manifestLabel = json.label;

    const canvases = json.sequences[0].canvases;

    const items = [];

    for (const canvas of canvases) {

        const resource = canvas.images[0].resource;

        const item = {
            manifestId,
            ID: canvas["@id"],
            name: canvas.label + " " + manifestLabel,
            height: canvas?.height || 200,
            width: canvas?.width || 200,
            serviceID: resource.service["@id"],
        };

        item.imageURL = item.ID;

        item.bigImage = `${item.serviceID}/full/500,/0/default.jpg`;

        if (canvas.thumbnail) {

            const {height, width} = canvas.thumbnail;

            item.thumbnail = canvas.thumbnail["@id"];
            item.thumbnailWidth = height;
            item.thumbnailHeight = width;

        } else {

            item.thumbnail = `${item.serviceID}/full/${_constants__WEBPACK_IMPORTED_MODULE_0__.POPUP_THUMBNAIL_WIDTH},/0/default.jpg`;

        }

        if (canvas.metadata !== undefined) {

            item.metadata = canvas.metadata;

            const firstMeta = item.metadata[0];

            item.Longitude = firstMeta.Longitude || 0;
            item.Latitude = firstMeta.Latitude || 0;
            item.Zoom = firstMeta.Zoom || 4;
            item.date = makeDateProperty(firstMeta);

        } else {

            item.metadata = [{Latitude: 0, Longitude: 0, Zoom: 4}];

            item.Latitude = 0;
            item.Longitude = 0;
            item.Zoom = 4;
            item.date = makeDateProperty({});
        }

        items.push(item);

    }

    return {items, json};
}

function makeDateProperty(firstMeta){

    const { label, value } = firstMeta;

    let result;

    if (label && label.toLowerCase() === 'date') {

        if (value.length <= 4) {

            const fixedYear = ("0000" + value).substr(value.length, 4);

            result = new Date(parseInt(fixedYear), 5, 1);

        } else {
            //TODO: Hard coding
            //Only deal with the two cases below:
            // 1856-03-28
            // 1746 ~ 1809
            const regex = /(\d*)(-|~)\d*/g;
            const found = regex.exec(value.replace(/\s/g, ""));

            result = new Date(parseInt(found[1]), 5, 1);
        }

    } else {

        result = new Date(-99999, 0, 1);
    }

    return result;

}



/***/ }),

/***/ "./src/data-processor/index.js":
/*!*************************************!*\
  !*** ./src/data-processor/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _date_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../date-utils.js */ "./src/date-utils.js");
/* harmony import */ var _csv_processor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./csv-processor */ "./src/data-processor/csv-processor.js");
/* harmony import */ var _geo_json_processor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geo-json-processor */ "./src/data-processor/geo-json-processor.js");
/* harmony import */ var _iiif_processor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./iiif-processor */ "./src/data-processor/iiif-processor.js");





const BasicDataProcessor = function() {

    function execute(text, fileType) {

        const {items, imgType, json} = processRawText(text, fileType);

        const rows = [];

        for (const item of items) {

            //screen out the items which are without geo-coordinate.
            if (item.Latitude !== undefined && item.Longitude !== undefined) {

                rows.push(decorateDate(item));
            }
        }

        return {rows, imgType, json};

    }

// extract required fields from rawText and convert each line into a json object.
    function processRawText(text, fileType) {

        let imgType = 'text';

        let items = [];

        let json = null;

        if (fileType === 'geoJson' ||
        fileType === 'unknown' && (0,_geo_json_processor__WEBPACK_IMPORTED_MODULE_2__.shouldIHandle)(text)) {

            imgType = 'geoJson';

            const result = (0,_geo_json_processor__WEBPACK_IMPORTED_MODULE_2__.process)(text);

            items = result.items;

            json = result.json;

        } else if (fileType === 'iiif' || fileType === 'unknown' && (0,_iiif_processor__WEBPACK_IMPORTED_MODULE_3__.shouldIHandle)(text)) {

            imgType = 'iiif';

            const result = (0,_iiif_processor__WEBPACK_IMPORTED_MODULE_3__.process)(text);

            items = result.items;

            json = result.json;

        } else {

            const result = (0,_csv_processor__WEBPACK_IMPORTED_MODULE_1__.process)(text);

            items = result.items;

            imgType = (result.headerMap.imageURL !== undefined) ? 'normal' : 'text';

        }

        return {items, imgType, json};

    }

    function decorateDate(item) {

        if (item.date) {

            let ds = item.date.toString();

            if (ds.length <= 4) {

                const fixedYear = ("0000" + ds).substr(ds.length, 4);

                item.date = new Date(fixedYear + "-06-01T00:00:00Z");

            } else {

                item.date = _date_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].parse(item.date, "yyyy/M/d t HH:mm:ss");
            }

        } else {

            item.date = new Date(-99999, 0, 1);
        }

        return item;

    }

    return {
        execute,
        isIIIFFile: _iiif_processor__WEBPACK_IMPORTED_MODULE_3__.shouldIHandle,
    }
}();

/* harmony default export */ __webpack_exports__["default"] = (BasicDataProcessor);


/***/ }),

/***/ "./src/date-utils.js":
/*!***************************!*\
  !*** ./src/date-utils.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/**
 * 日期格式化和解析
 * DateUtils提供format和parse进行日期转换。
 * format(date, pattern)把日期格式化成字符串。
 * 使用方法：
 * var date = new Date();
 * DateUtils.format(date, 'yyyy-MM-dd HH:mm:ss'); //2015-08-12 13:00:00
 *
 * parse(str, pattern)把字符串转成日期。
 * 使用方法：
 * var str = 2015-08-12 13:00:00;
 * DateUtils.format(str, 'yyyy-MM-dd HH:mm:ss');
 *
 * parse有两个参数，如果只传递str参数，会调用浏览器内置的Date.parse()方法进行转换。
 *
 *   格式       描述
 *   --------   ---------------------------------------------------------------
 *   yy         年份后两位，如2015取后两位是15。
 *   yyyy       年份四位。
 *   M          月份，取值1 ~ 12。
 *   MM         月份，取值01 ~ 12，如果月份为个位数，前面补0。
 *   MMM        月份缩写，如一月的英文缩写为Jan，中文缩写为一。
 *   MMMM       月份全称，如January、一月。
 *   d          日期在月中的第几天，取值1~31。
 *   dd         日期在月中的第几天，取值01~31，如果天数为个位数，前面补0。
 *   ddd        星期缩写，取值日、一、二、三、四、五、六。
 *   dddd       星期全称，取值星期日、星期一、星期二、星期三、星期四、星期五、星期六。
 *   H          24小时进制，取值0~23。
 *   HH         24小时进制，取值00~23，如果小时为个位数，前面补0。
 *   h          12小时进制，取值0~11。
 *   hh         12小时进制，取值00~11，如果小时为个位数，前面补0。
 *   m          分钟，取值0~59。
 *   mm         分钟，取值00~59，如果为个位数，前面补0。
 *   s          秒，取值0~59。
 *   ss         秒，取值00~59，如果为个位数，前面补0。
 *   S          毫秒，取值0~999。
 *   SS         毫秒，取值00~999，如果不足两位数，前面补0。
 *   SSS        毫秒，取值000~999，如果不足三位数，前面补0。
 *   t          上午、下午缩写。
 *   tt         上午、下午全称。
 *   --------   ---------------------------------------------------------------
 *
 * @author accountwcx@qq.com
 * @date   2015-08-12
 */
const DateUtils = (function() {
    /*
      const locale = {
          dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          am: 'AM',
          pm: 'PM',
          shortAm: 'A',
          shortPm: 'P'
      };
      */

    const locale = {
        dayNames: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ],
        shortDayNames: ["日", "一", "二", "三", "四", "五", "六"],
        monthNames: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        shortMonthNames: [
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九",
            "十",
            "十一",
            "十二"
        ],
        am: "上午",
        pm: "下午",
        shortAm: "上",
        shortPm: "下"
    };

    /**
     * 左边补0
     */
    function leftPad(str, size) {
        let result = "" + str;

        while (result.length < size) {
            result = "0" + result;
        }

        return result;
    }

    var parseToken = (function() {

        const match2 = /\d{2}/, // 00 - 99
        //match3 = /\d{3}/,          // 000 - 999
        match4 = /\d{4}/, // 0000 - 9999
        match1to2 = /\d{1,2}/, // 0 - 99
        match1to3 = /\d{1,3}/, // 0 - 999
        //match1to4 = /\d{1,4}/,     // 0 - 9999
        match2w = /.{2}/, // 匹配两个字符
        match1wto2w = /.{1,2}/, // 匹配1~2个字符
        map = {
            //年的后两位
            yy: {
                regex: match2,
                name: "year"
            },
            //年
            yyyy: {
                regex: match4,
                name: "year"
            },
            //两位数的月，不到两位数则补0
            MM: {
                regex: match2,
                name: "month"
            },
            //月
            M: {
                regex: match1to2,
                name: "month"
            },
            //两位数的日期，不到两位数则补0
            dd: {
                regex: match2,
                name: "date"
            },
            //日期
            d: {
                regex: match1to2,
                name: "date"
            },
            //两位数的小时，24小时进制
            HH: {
                regex: match2,
                name: "hours"
            },
            //小时，24小时进制
            H: {
                regex: match1to2,
                name: "hours"
            },
            //两位数的小时，12小时进制
            hh: {
                regex: match2,
                name: "hours"
            },
            //小时，12小时进制
            h: {
                regex: match1to2,
                name: "hours"
            },
            //两位数的分钟
            mm: {
                regex: match2,
                name: "minutes"
            },
            //分钟
            m: {
                regex: match1to2,
                name: "minutes"
            },
            s: {
                regex: match1to2,
                name: "seconds"
            },
            ss: {
                regex: match2,
                name: "seconds"
            },
            //上午、下午
            tt: {
                regex: match2w,
                name: "t"
            },
            //上午、下午
            t: {
                regex: match1wto2w,
                name: "t"
            },
            //毫秒
            S: {
                regex: match1to3,
                name: "millisecond"
            },
            //毫秒
            SS: {
                regex: match1to3,
                name: "millisecond"
            },
            //毫秒
            SSS: {
                regex: match1to3,
                name: "millisecond"
            }
        };

        return function(token, str, dateObj) {

            let result;

            const part = map[token];

            if (part) {
                result = str.match(part.regex);
                if (result) {
                    dateObj[part.name] = result[0];
                    return result[0];
                }
            }

            return null;
        };
    })();

    return {
        locale: locale,

        format: function(val, pattern) {
            if (Object.prototype.toString.call(val) !== "[object Date]") {
                return "";
            }

            if (
            Object.prototype.toString.call(pattern) !== "[object String]" ||
            pattern === ""
            ) {
                pattern = "yyyy-MM-dd HH:mm:ss";
            }

            const fullYear = val.getFullYear(),
            month = val.getMonth(),
            day = val.getDay(),
            date = val.getDate(),
            hours = val.getHours(),
            minutes = val.getMinutes(),
            seconds = val.getSeconds(),
            milliseconds = val.getMilliseconds();

            return pattern.replace(
            /(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?)/g,
            function(m) {
                if (m.charAt(0) === "\\") {
                    return m.replace("\\", "");
                }

                const locale = DateUtils.locale;

                switch (m) {
                    case "hh":
                        return leftPad(
                        hours < 13 ? (hours === 0 ? 12 : hours) : hours - 12,
                        2
                        );
                    case "h":
                        return hours < 13 ? (hours === 0 ? 12 : hours) : hours - 12;
                    case "HH":
                        return leftPad(hours, 2);
                    case "H":
                        return hours;
                    case "mm":
                        return leftPad(minutes, 2);
                    case "m":
                        return minutes;
                    case "ss":
                        return leftPad(seconds, 2);
                    case "s":
                        return seconds;
                    case "yyyy":
                        return fullYear;
                    case "yy":
                        return (fullYear + "").substring(2);
                    case "dddd":
                        return locale.dayNames[day];
                    case "ddd":
                        return locale.shortDayNames[day];
                    case "dd":
                        return leftPad(date, 2);
                    case "d":
                        return date;
                    case "MMMM":
                        return locale.monthNames[month];
                    case "MMM":
                        return locale.shortMonthNames[month];
                    case "MM":
                        return leftPad(month + 1, 2);
                    case "M":
                        return month + 1;
                    case "t":
                        return hours < 12 ? locale.shortAm : locale.shortPm;
                    case "tt":
                        return hours < 12 ? locale.am : locale.pm;
                    case "S":
                        return milliseconds;
                    case "SS":
                        return leftPad(milliseconds, 2);
                    case "SSS":
                        return leftPad(milliseconds, 3);
                    default:
                        return m;
                }
            }
            );
        },

        parse: function(val, pattern) {
            if (!val) {
                return null;
            }

            if (Object.prototype.toString.call(val) === "[object Date]") {
                // 如果val是日期，则返回。
                return val;
            }

            if (Object.prototype.toString.call(val) !== "[object String]") {
                // 如果val不是字符串，则退出。
                return null;
            }

            let time;
            if (
            Object.prototype.toString.call(pattern) !== "[object String]" ||
            pattern === ""
            ) {
                // 如果fmt不是字符串或者是空字符串。
                // 使用浏览器内置的日期解析
                time = Date.parse(val);
                if (isNaN(time)) {
                    return null;
                }

                return new Date(time);
            }

            let i,
            token,
            tmpVal;

            const tokens = pattern.match(
            /(\\)?(dd?|MM?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?|.)/g
            );

            const dateObj = {
                year: 0,
                month: 1,
                date: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                millisecond: 0
            };

            for (i = 0; i < tokens.length; i++) {
                token = tokens[i];
                tmpVal = parseToken(token, val, dateObj);

                if (tmpVal !== null) {
                    if (val.length > tmpVal.length) {
                        val = val.substring(tmpVal.length);
                    } else {
                        val = "";
                    }
                } else {
                    val = val.substring(token.length);
                }
            }

            if (dateObj.t) {
                if (
                DateUtils.locale.pm === dateObj.t ||
                DateUtils.locale.shortPm === dateObj.t
                ) {
                    dateObj.hours = +dateObj.hours + 12;
                }
            }

            dateObj.month -= 1;

            return new Date(
            dateObj.year,
            dateObj.month,
            dateObj.date,
            dateObj.hours,
            dateObj.minutes,
            dateObj.seconds,
            dateObj.millisecond
            );
        }
    };

})();

/* harmony default export */ __webpack_exports__["default"] = (DateUtils);


/***/ }),

/***/ "./src/float-panel-management.js":
/*!***************************************!*\
  !*** ./src/float-panel-management.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const FloatPanelManagement = function (){

    const panelMap = {
        right: [],
        left: [],
    };

    function setPanelSeq(panels, panelSeq, newPanel){

        for(const panel of panels){
            if(panel.id !== newPanel.id) {
                panelSeq.push(panel);
            }
        }

        for(let idx = 0, len = panelSeq.length; idx < len; idx++){
            panelSeq[idx].style.zIndex = 9999 - idx;
        }

    }

    function shown(position, panel){

        const panels = panelMap[position];

        const panelSeq = [ panel ];

        setPanelSeq(panels, panelSeq, panel);

        panelMap[position] = panelSeq;

    }

    function hidden(position, panel){

        const panels = panelMap[position];

        const panelSeq = [ ];

        setPanelSeq(panels, panelSeq, panel);

        panelMap[position] = panelSeq;

    }

    function register(controller, eventPrefix, position){

        const shownEventName = `${eventPrefix}.shown`;
        const hiddenEventName = `${eventPrefix}.hidden`;

        controller.on(shownEventName, (panel) => shown(position, panel));

        controller.on(hiddenEventName, (panel) => hidden(position, panel));

    }

    return {
        register,
    }

}();

/* harmony default export */ __webpack_exports__["default"] = (FloatPanelManagement);


/***/ }),

/***/ "./src/iiif-viewer.js":
/*!****************************!*\
  !*** ./src/iiif-viewer.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");


const IIIFViewer = function () {

    function open(params){

        window.open( _constants_js__WEBPACK_IMPORTED_MODULE_0__.IIIF_VIEWER_URL.interpolate(params).trim());
    }

    return {
        open,
    }

}();

/* harmony default export */ __webpack_exports__["default"] = (IIIFViewer);


/***/ }),

/***/ "./src/notification.js":
/*!*****************************!*\
  !*** ./src/notification.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrp_wrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrp-wrap */ "./src/bootstrp-wrap.js");



const Notification = function(){

    let notification = null;

    let notificationBody = null;

    function create(){

        const html =
`<div class="toast hide bg-white"
      role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-body"></div>
</div>`;

        const div = document.createElement('div');

        div.className = 'position-fixed';

        div.style.cssText = "z-index:9998;top:30px;left:43%;"

        div.innerHTML = html;

        document.body.append(div);

        notification = div.firstChild;

        notificationBody = notification.querySelector('.toast-body')

    }

    function show(info, type, sec){

        if(!notification){

            create();

        }

        notificationBody.innerHTML = info;

        notificationBody.className = `toast-body text-white bg-${ type || 'primary' }`;

        const toast = _bootstrp_wrap__WEBPACK_IMPORTED_MODULE_0__.Toast.getOrCreateInstance(notification);

        toast.show();

        window.setTimeout(() => { toast.hide(); }, (sec || 3) * 1000)

    }

    return {
        show,
    }

}();

/* harmony default export */ __webpack_exports__["default"] = (Notification);


/***/ }),

/***/ "./src/openstreetmap-service.js":
/*!**************************************!*\
  !*** ./src/openstreetmap-service.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _commons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commons.js */ "./src/commons.js");


const OpenStreetMapService = function () {

    const localEventEmitter = new _commons_js__WEBPACK_IMPORTED_MODULE_0__.EventEmitterClass();

    function addEventListener(obj, types, fn, context) {
        localEventEmitter.on(obj, types, fn, context);
    }

    function getInfoByLatLng({callback, lat, lng, lang}) {

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=${lang}`;

        fetch(url)
        .then(response => response.ok ? response : Promise.reject({err: response.status}))
        .then(response => response.json())
        .then(json => callback({placeInfo: json.display_name || 'unknown', lat, lng}))
        .catch(error => {
            console.error('Error:', error);
            localEventEmitter.emit('exception', 'Cannot access openstreetmap service, please contact administrators');
        });

    }

    function searchPlaceName(placeName, callback) {

        if (placeName === "") {
            return;
        }

        //TODO get user's current language
        const url =
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&polygon=1&addressdetails=1&accept-language=en`;

        fetch(url)
        .then(response => response.ok ? response : Promise.reject({err: response.status}))
        .then(response => response.json())
        .then(json => {

            const data = [];

            for (const element of json) {

                const node = {lat: element.lat, lng: element.lon, info: ''};

                node.info = JSON.stringify(element)
                .replace(/{/g, "")
                .replace(/}/g, "")
                .replace(/"/g, "")
                .replace(/, ODbL 1.0. https:\/\/osm.org\/copyright/g, "")
                .replace(/,/g, "<br/>");

                data.push(node);
            }

            callback(data);


        })
        .catch(error => {
            console.error('Error:', error);
            localEventEmitter.emit('exception', 'Cannot access openstreetmap service, please contact administrators');
        });
    }

    return {
        getInfoByLatLng,
        searchPlaceName,
        on: addEventListener,
    }

    /* Events

    { name: 'exception', params: String }

    */
}();

/* harmony default export */ __webpack_exports__["default"] = (OpenStreetMapService);



/***/ }),

/***/ "./src/spinner.js":
/*!************************!*\
  !*** ./src/spinner.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const Spinner = function() {

    let spinner = null;

    function create(){

        const html = `<span class="visually-hidden">Loading...</span>`;

        const div = document.createElement('div');

        div.className = 'spinner-border';

        div.style.cssText = "z-index:9998;position:absolute;top:40%;left:50%;width:3rem;height:3rem;display:none;";

        div.innerHTML = html;

        document.body.append(div);

        spinner = div;

    }

    function show(){

        if(!spinner){
            create();
        }

        spinner.style.display = 'block';
    }

    function hide(){

        if(spinner) {
            spinner.style.display = 'none';
        }
    }

    return {
        show,
        hide,
    }
}();

/* harmony default export */ __webpack_exports__["default"] = (Spinner);


/***/ }),

/***/ "bootstrap":
/*!****************************!*\
  !*** external "bootstrap" ***!
  \****************************/
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE_bootstrap__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Constants": function() { return /* reexport module object */ _constants__WEBPACK_IMPORTED_MODULE_8__; },
/* harmony export */   "Commons": function() { return /* reexport module object */ _commons__WEBPACK_IMPORTED_MODULE_9__; },
/* harmony export */   "Spinner": function() { return /* reexport safe */ _spinner__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "Notification": function() { return /* reexport safe */ _notification__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "OpenStreetMapService": function() { return /* reexport safe */ _openstreetmap_service__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "IIIFViewer": function() { return /* reexport safe */ _iiif_viewer__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "DateUtils": function() { return /* reexport safe */ _date_utils__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   "BasicDataProcessor": function() { return /* reexport safe */ _data_processor__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   "BootstrapWrap": function() { return /* reexport module object */ _bootstrp_wrap__WEBPACK_IMPORTED_MODULE_7__; },
/* harmony export */   "FloatPanelManagement": function() { return /* reexport safe */ _float_panel_management__WEBPACK_IMPORTED_MODULE_6__["default"]; }
/* harmony export */ });
/* harmony import */ var _spinner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./spinner */ "./src/spinner.js");
/* harmony import */ var _notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notification */ "./src/notification.js");
/* harmony import */ var _openstreetmap_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./openstreetmap-service */ "./src/openstreetmap-service.js");
/* harmony import */ var _iiif_viewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./iiif-viewer */ "./src/iiif-viewer.js");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./date-utils */ "./src/date-utils.js");
/* harmony import */ var _data_processor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data-processor */ "./src/data-processor/index.js");
/* harmony import */ var _float_panel_management__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./float-panel-management */ "./src/float-panel-management.js");
/* harmony import */ var _bootstrp_wrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./bootstrp-wrap */ "./src/bootstrp-wrap.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _commons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./commons */ "./src/commons.js");













}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=chmap-utilities.js.map