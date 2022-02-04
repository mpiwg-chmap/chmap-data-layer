
function setExtraProps(node) {

    let bgColor = "#E6E666";
    let wordColor = "#01010a";

    //TODO: Hard coding
    let newCaption = node.caption
    .replace(/補輯|補正|新通志|續補|續纂|重刊|志稿存|約稿|全志|圖志|合志|重輯|小志|重纂|輯要|三編|三續/, "")
    .replace(/志餘|初稿|志稿|增修|纂修|續修|續編|次志|總志|志略|新志|舊志|續志|通志|新修|重修|志|續/, "");

    if (newCaption.indexOf("直隸") >= 0) {
        bgColor = "#34495E";
        wordColor = "#FFFFFF";
    } else {

        const lastChar = newCaption.substr(newCaption.length - 1, 1);

        switch (lastChar){
            case '廳':
                bgColor = "#E74C3C";
                break;
            case '府':
                bgColor = "#DC7633";
                break;
            case '州':
                bgColor = "#16A085";
                wordColor = "#FFFFFF";
                break;
        }

    }

    newCaption = newCaption.replace(/直隸/, "");

    if (newCaption.length >= 3) {
        newCaption = newCaption.replace(/縣|府|廳/, "");
    }

    const shortCaption = newCaption.substring(0, 2);

    const iconStyle = `display:inline-block;vertical-align:middle;text-align:center;background-color:${bgColor};color:${wordColor}`;

    const iconHTML = `<div style="${iconStyle}"><span style="vertical-align:middle;">${shortCaption}</span><br/><span>${node.date.getFullYear()}</span></div>`

    Object.assign(node, { shortCaption, bgColor, wordColor, iconHTML });

}

export { setExtraProps };
