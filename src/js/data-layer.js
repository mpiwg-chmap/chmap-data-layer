
import * as DataLayerFactory from "./builder/layer-factory";
import { BasicDataProcessor, Commons } from "@chmap/utilities";

const ENABLE_AVAILABLE_MAPS = process.env.ENABLE_AVAILABLE_MAPS;

const DataLayer = function() {

    const localEventEmitter = new Commons.EventEmitterClass();

    let localMap = null;

    let dataLayer = null;

    let keywordsInputWrap = null;

    let keywordsInput = null;

    const loadedData = {rows: [], imgType: 'text'};

    function addEventListener(obj, types, fn, context) {
        localEventEmitter.on(obj, types, fn, context);
    }

    function init(map) {

        localMap = map;

    }

    function filter(filterFn, highlightText) {

        const rows = loadedData.rows.filter(filterFn);

        const result = {rows, imgType: loadedData.imgType, keywords: highlightText};

        localEventEmitter.emit('filtered', result);

        renderMarkers(result);

    }

    function filterByKeywords(keywords) {

        const regExp = new RegExp(keywords, 'gui');

        const filterFn = (row) => regExp.test(JSON.stringify(row));

        filter(filterFn, keywords);

    }

    function reset() {
        renderMarkers(loadedData);
    }

    function clear() {

        if (localMap && dataLayer) {
            dataLayer.clearLayers();
            localMap.removeLayer(dataLayer);
            keywordsInputWrap.style.display = 'none';
        }

    }

    function getLoadedData() {
        return loadedData;
    }

    function load(text, fileType) {

        const {rows, imgType} = BasicDataProcessor.execute(text, fileType);

        loadedData.rows = rows;
        loadedData.imgType = imgType;

        localEventEmitter.emit('loaded', {rows, imgType});

        keywordsInput.value = '';

        renderMarkers({rows, imgType});

    }

    function renderMarkers({rows, imgType, keywords}) {

        clear();

        const {nodes} = buildDataNodes(rows, imgType, keywords);

        if (nodes.length > 0) {

            dataLayer = DataLayerFactory.create(imgType);

            dataLayer.add(nodes).addTo(localMap);

            localMap.fitBounds(dataLayer.getBounds());

            localMap.setZoom(refineZoomLevel());

        }

        localEventEmitter.emit('rendered', {nodes, imgType, keywords});

        displayCountInfo(nodes, keywords);

    }

    function displayCountInfo(nodes, keywords) {

        const totalCnt = loadedData.rows.length;

        const filteredCnt = (keywords) ? nodes.length : 0;

        const filteredInfo = (filteredCnt > 0) ? `, Filtered: ${filteredCnt}` : '';

        keywordsInputWrap.querySelector('.count-info').innerText = `Total: ${totalCnt}${filteredInfo}.`;

        keywordsInputWrap.style.display = 'inline-flex';

    }

    function buildDataNodes(data, imgType, keyword) {

        const nodes = [];

        const titleField = findTitleField(data);

        for (let idx = 0, len = data.length; idx < len; idx++) {

            const node = data[idx];

            const title = getNodeTitle(node, titleField);

            const year = node.date.getFullYear();

            let thumbnail = '';

            if (imgType === 'text') {
                thumbnail = refineTextNodeTitle(title, year);
            } else if (imgType === 'iiif') {
                thumbnail = node.thumbnail;
            } else {
                thumbnail = node.imageURL;
            }

            const nodeInfo = createNodeInfo(node, keyword);

            nodes.push({
                date: node.date,
                lat: node.Latitude,
                lng: node.Longitude,
                url: node.imageURL,
                caption: `${title} ${year}`,
                nodeInfo,
                bigImage: node.bigImage || '',
                thumbnail,
                ...getNodeActions(node, nodeInfo, imgType),
            });

        }

        return {nodes};

    }

    function findTitleField(data) {

        let rs = "";

        if (data == null || data.length === 0) {
            return rs;
        }

        const keys = Object.keys(data[0]);

        for (const key of keys) {

            const lowerKey = key.toLocaleLowerCase();

            if (lowerKey.indexOf("name") >= 0 || lowerKey.indexOf("title") >= 0) {
                rs = key;
                break;
            }

        }

        return rs;
    }

    function getNodeTitle(node, titleField) {

        let result = (titleField === '')
        ? node[Object.keys(node)[0]]
        : node[titleField];

        if (result === undefined) {
            result = "X";
        }

        return result
    }

    function refineTextNodeTitle(str, year) {

        //TODO: Hard coding

        let bgColor = "E6E666";
        let wordColor = "01010a";

        let newStr = str
        .replace(/補輯|補正|新通志|續補|續纂|重刊|志稿存|約稿|全志|圖志|合志|重輯|小志|重纂|輯要|三編|三續/, "")
        .replace(/志餘|初稿|志稿|增修|纂修|續修|續編|次志|總志|志略|新志|舊志|續志|通志|新修|重修|志|續/, "");

        const lastChar = newStr.substr(newStr.length - 1, 1);

        if (newStr.indexOf("直隸") >= 0) {
            bgColor = "34495E";
            wordColor = "FFFFFF";
        } else if (lastChar === '廳') {
            bgColor = "E74C3C";
        } else if (lastChar === '府') {
            bgColor = "DC7633";
        } else if (lastChar === '州') {
            bgColor = "16A085";
            wordColor = "FFFFFF";
        }

        newStr = newStr.replace(/直隸/, "");

        if (newStr.length >= 3) {
            newStr = newStr.replace(/縣|府|廳/, "");
        }

        newStr = newStr.substring(0, 2);

        const title = `${newStr}<br/><span href='#'>${year}</span>`;

        return `${title};${wordColor};${bgColor}`;

    }

    function highlightText(keywords, text) {

        if (keywords) {

            const regExp = new RegExp(keywords, 'gui');

            return text.replace(regExp, (matched) => {

                return `<span class='keywords-highlight' >${matched}</span>`;

            });

        } else {
            return text;
        }

    }

    function createNodeInfo(node, keyword) {

        const info = Object.assign({}, node);

        delete info.imageURL;

        const year = new Date(info.date).getFullYear();

        info.date = `<a class='show-year-metadata-btn' data-year='${year}' href='#'>${info.date}</a>`;

        const html = [];

        const parser = document.createElement('div');

        for (const key in info) {

            let text = info[key];

            if (key !== 'date') {

                if (typeof text === 'object') {
                    text = JSON.stringify(text);
                }

                parser.innerHTML = text;
                text = parser.innerText;
            }

            html.push(`${key}:${highlightText(keyword, text)}`);
        }

        return html.join('<br>');

    }

    function getNodeActions(node, nodeInfo, imgType) {

        let btns = [];

        const primaryBtnCls = 'btn btn-primary btn-sm mb-1';

        const availableMapsBtn = (ENABLE_AVAILABLE_MAPS.toLowerCase() === 'true')
        ? `<button class="${primaryBtnCls} load-available-maps-btn" data-lat="${node.Latitude}" data-lng="${node.Longitude}">Show available maps</button>`
        : '';

        switch (imgType) {

            case 'normal':

                btns = getNormalImageActions(node, nodeInfo, availableMapsBtn);

                break;

            case 'iiif':

                const {manifestId, ID} = node;

                btns.push(
                `<button class="${primaryBtnCls} show-IIIF-viewer-btn" data-manifest-id="${manifestId}" data-canvas-id="${ID}">IIIF Viwer</button>`);

                btns.push(availableMapsBtn);

                break;

            case 'geoJson':
            case 'text':
                btns.push(availableMapsBtn);
                break;
            default:
                break;

        }

        return {actions: btns.join(' ')}

    }

    function getNormalImageActions(node, nodeInfo, availableMapsBtn) {

        const btns = [];

        const {ID, imageURL, Latitude, Longitude} = node;

        const secondBtnCls = 'btn btn-secondary btn-sm';

        const smallBtnStyle = 'position:relative; top:-35px;float:right;';

        btns.push(
        `<button class="${secondBtnCls} px-1 py-0 ms-1 show-node-info-btn" 
style="${smallBtnStyle}" data-node-info="${nodeInfo}" title="show metadata">
<span class="bi bi-info-circle"></span></button>`);

        btns.push(
        `<button class="${secondBtnCls} px-1 py-0 reload-img-btn" 
style="${smallBtnStyle}" title="reload image" 
onclick="document.querySelector('.popup.thumbnail-img').src='${imageURL}?timestamp=${new Date().getTime()}'">
<span class="bi bi-arrow-clockwise"></span></button>`);

        btns.push(availableMapsBtn);

        btns.push(`<button class="${secondBtnCls} mb-1 show-images-of-a-book" data-book-id="${ID}">Show all images of this book</button>`);

        btns.push(`<button class="${secondBtnCls} mb-1 show-images-at-this-location" data-lat="${Latitude}" data-lng="${Longitude}">Show all images at this location</button>`);

        return btns;

    }

    function refineZoomLevel() {

        const level = localMap.getZoom();

        return (level > 6) ? 4 : level;

    }

    function getRecsOfABook(bookId) {

        const {rows} = loadedData;

        const newRows = [];

        for (const row of rows) {

            if (bookId === row.ID) {
                newRows.push({...row});
            }
        }

        const firstRow = newRows[0] || {};

        const {
            Province, County, name,
            Dynasty, Period, Edition, Volume, Author, Source
        } = firstRow;

        const title = `${Province} ${County} - ${name}  ${firstRow["TimeSpan:begin"]} ~ ${firstRow["TimeSpan:end"]}`;

        const subTitle = `${Dynasty} ${Period}  ${Edition} ${Volume} ${Author} ${Source}`;

        return {title, subTitle, rows: newRows, isSingleBook: true};
    }

    function getRecsByALocation(lat, lng) {

        const {rows} = loadedData;

        const newRows = [];

        for (const row of rows) {

            if (lat === parseFloat(row.Latitude) && lng === parseFloat(row.Longitude)) {
                newRows.push({...row});
            }
        }

        const title = 'All images at this location';

        const subTitle = `Latitude: ${lat}, Longitude: ${lng}`;

        return {title, subTitle, rows: newRows, isSingleBook: false};
    }

    function getKeywordsInput() {

        if (!keywordsInputWrap) {

            const div = document.createElement("div");

            keywordsInputWrap = div;

            div.className = 'input-group input-group-sm me-1';
            div.style.cssText = 'display:none;width:initial;padding-left: 5rem';

            // const filler1 = document.createElement("span");
            // filler1.style.cssText = 'width:20rem;';
            // div.appendChild(filler1);

            const span = document.createElement("span");

            span.className = 'me-2 pt-2 count-info';
            span.style.cssText = 'font-size: 12px;';

            div.appendChild(span);

            const input = document.createElement("input");

            input.type = 'text';
            input.className = 'form-control';
            input.style.cssText = 'width:13rem;';
            input.placeholder = 'Input keywords for filtering';
            input.onkeyup = (e) => {
                if (e.key === "Enter") {

                    filterByKeywords(e.target.value.trim());
                }
            }

            keywordsInput = input;

            div.appendChild(input);

            const btn = document.createElement("button");
            btn.className = 'btn btn-outline-secondary btn-sm';
            btn.innerHTML = '<i class="bi bi-search"></i>';
            btn.onclick = () => {

                filterByKeywords(input.value.trim());
            }

            div.appendChild(btn);

            const btn2 = document.createElement("button");
            btn2.className = 'btn btn-outline-secondary btn-sm';
            btn2.innerHTML = '<i class="bi bi-arrow-clockwise"></i>'
            btn2.title = 'reset';
            btn2.onclick = () => {

                input.value = '';

                reset();
            }

            div.appendChild(btn2);

            const filler2 = document.createElement("span");
            filler2.style.cssText = 'width:4rem;';
            div.appendChild(filler2);

            const btn3 = document.createElement("button");
            btn3.className = 'btn btn-outline-secondary btn-sm';
            btn3.innerHTML = 'Clear All'
            btn3.onclick = clear;

            div.appendChild(btn3);


        }

        return keywordsInputWrap;

    }

    return {
        init,
        load,
        filter,
        reset,
        clear,
        getLoadedData,
        getRecsOfABook,
        getRecsByALocation,
        getKeywordsInput,
        on: addEventListener,
    }

    /* Events

    { name: 'loaded', params: { rows, imgType }}
    { name: 'filtered', params: { rows, imgType, keywords }}
    { name: 'rendered', params: { nodes, imgType, keywords }}

 */
}();

export { DataLayer };
