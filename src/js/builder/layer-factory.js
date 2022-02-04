import 'leaflet.markercluster';
import './leaflet-photo';
import './leaflet-text';
import { Constants } from "@chmap/utilities";

const { POPUP_THUMBNAIL_WIDTH, PHOTO_ICON_SIZE } = Constants;

export function create(imgType){

    let result = null;

    switch (imgType){
        case 'normal':
            result = createPhotoLayer('border-width:0px;', 'caption');
            break;
        case 'iiif':
        case 'geoJson':
            result = createPhotoLayer('', 'nodeInfo');
            break;
        default:
            result = createTextLayer();
            break;
    }

    return result;

}

const nodeInfoStyle = 'max-height:100px;overflow:auto;margin:3px 0px;padding:0px 4px;border:1px solid rgba(0, 0, 0, 0.125);';

const dataLayerOpts = {
    disableClusteringAtZoom: 16,
    animate: true,
    autoZoomOnAdd: true,
    spiderfyDistanceMultiplier: 1.4,
    icon: { iconSize: [PHOTO_ICON_SIZE, PHOTO_ICON_SIZE] },
}

const popupOpts = {
    className: "leaflet-popup-photo",
    minWidth: 220,
}

function createTextLayer(){

    const tmpl = `<div style="${nodeInfoStyle}">{nodeInfo}</div>{actions}`;

    return L.text.cluster({ ...dataLayerOpts })
    .on("click", function (evt) {
        evt.layer.bindPopup(L.Util.template(tmpl, evt.layer.node), popupOpts).openPopup();
    });
}

function createPhotoLayer(extraStyle, captionName){

    const tmpl =
`<div class="popup thumbnail-img-loading">
    <span class="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
    Loading...
</div>
<img class="popup thumbnail-img" src="{thumbnail}" data-big-image="{bigImage}" style="cursor:pointer;width:${POPUP_THUMBNAIL_WIDTH}px;" />
<div style="${nodeInfoStyle}${extraStyle}">{${captionName}}</div>{actions}`;

    return L.photo.cluster({ ...dataLayerOpts })
            .on("click", function (evt) {
                evt.layer.bindPopup(L.Util.template(tmpl, evt.layer.photo), popupOpts).openPopup();
            });

}
