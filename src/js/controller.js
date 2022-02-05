
import { Commons } from "@chmap/utilities";

const DataLayerController = function() {

    const localEventEmitter = new Commons.EventEmitterClass();

    const initialized = { dataLayer: false };

    let localMap = null;

    let localToolbar = null;

    let sidebarToggleBtn = null;

    function addEventListener(obj, types, fn, context) {
        localEventEmitter.on(obj, types, fn, context);
    }

    function init(map) {

        localMap = map;

        cmpEventBinding();

    }

    async function initDataLayer(map, toolbar, dataLayer) {

        dataLayer.init(map);

        toolbar.appendChild(dataLayer.getKeywordsInput());

        mapEventBinding(map);

        // ImagesPanel events
        const {on: ImagesPanel_on} = await import("./floating-panel/images-panel");

        ImagesPanel_on('showBigImage', async (imgUrl) => {

            const {show: showBigImage} = await import("./floating-panel/big-image-panel");

            showBigImage(imgUrl);

        });

        // MetaDataPanel events
        const {on: MetaDataPanel_on} = await import("./floating-panel/metadata-panel");

        if(!YearMetadataPanel) {

            YearMetadataPanel = await import("./floating-panel/year-metadata-controller");

            bindFloatingPanelEvent(YearMetadataPanel, "year-metadata-panel");
        }

        MetaDataPanel_on('showYearMetadata', YearMetadataPanel.show);

        // DataLayer events
        dataLayer.on('rendered', () => {

            if (sidebarToggleBtn && sidebarToggleBtn.className.indexOf('collapsed') < 0) {
                sidebarToggleBtn.click();
            }
        })

    }

    function addButtonsTo(toolbar) {

        localToolbar = toolbar;

    }

    function bindTriggerButtons({importLocalDataBtn, importOnlineDataBtn}) {

        importLocalDataBtn.onclick = async (e) => {

            e.preventDefault();

            const {LocalFileModal} = await import ("./file-import/local-file-modal");

            LocalFileModal.show();
        }

        importOnlineDataBtn.onclick = async (e) => {

            e.preventDefault();

            const {OnlineFileModal} = await import ("./file-import/online-file-modal");

            OnlineFileModal.show();
        }

    }

    function mapEventBinding(map) {

        map.on('popupopen', (e) => {

            const popupRoot = e.popup._contentNode;

            bindThumbnail(popupRoot);

            bindShowBigImage(popupRoot);

            bindShowImagesOfABook(popupRoot);

            bindShowImagesAtThisLocation(popupRoot);

            bindShowNodeInfoBtn(popupRoot);

            bindShowIIIFViewer(popupRoot);

            bindShowYearMetadata(popupRoot);

        });

    }

    function bindThumbnail(popupRoot) {

        const img = popupRoot.querySelector('.popup.thumbnail-img');

        if (img && !img.onload) {

            img.onload = () => {
                popupRoot.querySelector('.popup.thumbnail-img-loading').style.display = 'none';
            }

        }

    }

    function bindFloatingPanelEvent (panel, eventPrefix){

        panel.on('shown', (panelDOM) => {

            localEventEmitter.emit(`${eventPrefix}.shown`, panelDOM);

        });

        panel.on('hidden', (panelDOM) => {

            localEventEmitter.emit(`${eventPrefix}.hidden`, panelDOM);

        });

    }

    let MetadataPanel = null;

    function bindShowNodeInfoBtn(popupRoot) {

        const btn = popupRoot.querySelector('.show-node-info-btn');

        if (btn && !btn.onclick) {

            btn.onclick =  async (e) => {

                if(!MetadataPanel) {

                    MetadataPanel = await import("./floating-panel/metadata-panel");

                    bindFloatingPanelEvent(MetadataPanel, "metadata-panel");
                }

                MetadataPanel.show(btn.getAttribute('data-node-info'))
            }
        }
    }

    let BigImagePanel = null;

    function bindShowBigImage(popupRoot) {

        const img = popupRoot.querySelector('.thumbnail-img');

        if (img && !img.onclick) {

            img.onclick = async (e) => {

                if(!BigImagePanel) {

                    BigImagePanel = await import("./floating-panel/big-image-panel");

                    bindFloatingPanelEvent(BigImagePanel, "big-image-panel");
                }

                const target = e.target;

                const url = target.getAttribute('data-big-image') || target.src;

                BigImagePanel.show(url);
            }
        }

    }

    let ImagesOfABookPanel = null;

    function bindShowImagesOfABook(popupRoot) {

        const btn = popupRoot.querySelector('.show-images-of-a-book');

        if (btn && !btn.onclick) {

            const bookId = btn.getAttribute('data-book-id');

            btn.onclick = async () => {

                const { DataLayer } = await import ("./data-layer");

                if(!ImagesOfABookPanel) {

                    ImagesOfABookPanel = await import("./floating-panel/images-panel");

                    bindFloatingPanelEvent(ImagesOfABookPanel, "images-panel");
                }

                ImagesOfABookPanel.show(DataLayer.getRecsOfABook(bookId));
            }
        }

    }

    function bindShowImagesAtThisLocation(popupRoot) {

        const btn = popupRoot.querySelector('.show-images-at-this-location');

        if (btn && !btn.onclick) {

            // if(!ImagesOfABookPanel) {
            //     ImagesOfABookPanel = new Commons.FloatingPanelClass(
            //     "./floating-panel/images-panel",
            //     "images-panel",
            //     localEventEmitter);
            // }

            const lat = parseFloat(btn.getAttribute('data-lat'));
            const lng = parseFloat(btn.getAttribute('data-lng'));

            btn.onclick = async () => {

                const { DataLayer } = await import ("./data-layer");

                if(!ImagesOfABookPanel) {

                    ImagesOfABookPanel = await import("./floating-panel/images-panel");

                    bindFloatingPanelEvent(ImagesOfABookPanel, "images-panel");
                }

                ImagesOfABookPanel.show(DataLayer.getRecsByALocation(lat, lng));
            }
        }

    }

    function bindShowIIIFViewer(popupRoot) {

        const btn = popupRoot.querySelector('.show-IIIF-viewer-btn');

        if (btn && !btn.onclick) {

            const manifestId = btn.getAttribute('data-manifest-id');
            const canvasId = btn.getAttribute('data-canvas-id');

            btn.onclick = async () => {

                const {IIIFViewer} = await import('@chmap/utilities');

                IIIFViewer.open({manifestId, canvasId});
            }
        }

    }

    let YearMetadataPanel = null;

    function bindShowYearMetadata(popupRoot) {

        const hypLink = popupRoot.querySelector('.show-year-metadata-btn');

        if (hypLink && !hypLink.onclick) {

            const year = parseFloat(hypLink.getAttribute('data-year'));

            hypLink.onclick = async (e) => {

                e.preventDefault();

                if(!YearMetadataPanel) {

                    YearMetadataPanel = await import("./floating-panel/year-metadata-controller");

                    bindFloatingPanelEvent(YearMetadataPanel, "year-metadata-panel");
                }

                YearMetadataPanel.show(year);
            }
        }

    }

    async function cmpEventBinding() {

        const {on: FileLoader_on} = await import("./file-import/file-loader");

        // FileLoader events
        FileLoader_on('dataFileRead', async ({text, type}) => {

            localEventEmitter.emit('dataFileRead', {text, type});

            const { DataLayer } = await import ("./data-layer");

            if (!initialized.dataLayer) {

                await initDataLayer(localMap, localToolbar, DataLayer);

                initialized.dataLayer = true;
            }

            DataLayer.load(text, type);

            const {LocalFileModal} = await import ("./file-import/local-file-modal");

            LocalFileModal.hide();

            const {OnlineFileModal} = await import ("./file-import/online-file-modal");

            OnlineFileModal.hide();
        });

        FileLoader_on('exception', async (info) => {

            const {Notification} = await import("@chmap/utilities");

            Notification.show(info, 'danger');
        });

    }

    function hookSidebarToggleBtn(btn) {

        sidebarToggleBtn = btn;
    }

    async function loadFromAPI(url, requireCredentials) {

        const {loadOnlineDataFile} = await import("./file-import/file-loader");

        loadOnlineDataFile(url, 'unknow', requireCredentials || true);
    }

    async function clear() {

        if (initialized.dataLayer) {

            const {DataLayer} = await import("./data-layer");

            DataLayer.clear();
        }
    }

    return {
        init,
        addButtonsTo,
        hookSidebarToggleBtn,
        bindTriggerButtons,
        loadFromAPI,
        clear,
        on: addEventListener,
    }

    /* Events

    { name: 'dataFileRead', params: { text, type }}

    */

}();

export default DataLayerController;
