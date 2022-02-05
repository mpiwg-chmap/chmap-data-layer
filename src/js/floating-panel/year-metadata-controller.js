
import * as YearMetaDataPanel from "./year-metadata-panel";

import { Commons, Spinner } from '@chmap/utilities';

const { YearMetadata } = Commons;

const localEventEmitter = new Commons.EventEmitterClass();

let initialized = false;

function addEventListener(obj, types, fn, context) {
    localEventEmitter.on(obj, types, fn, context);
}

function show(year){

    Spinner.show();

    if(!initialized) {

        YearMetaDataPanel.on('shown', (panelDOM) => {

            localEventEmitter.emit(`shown`, panelDOM);

        });

        YearMetaDataPanel.on('hidden', (panelDOM) => {

            localEventEmitter.emit(`hidden`, panelDOM);

        });

        initialized = true;
    }

    const callback = (info) => {
        YearMetaDataPanel.show(info);
        Spinner.hide();
    }

    const errorCallback = async (info, type) => {

        Spinner.hide();

        const { Notification } = await import("@chmap/utilities");

        Notification.show(info, type);
    }

    YearMetadata.query(year, callback, errorCallback);

}

export {
    show,
    addEventListener as on,
}

/* Events

    { name: 'shown', params: panelDom-Object }
    { name: 'hidden', params: panelDom-Object }

*/
