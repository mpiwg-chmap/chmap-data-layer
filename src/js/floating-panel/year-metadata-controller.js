
import * as YearMetaDataPanel from "./year-metadata-panel";

import { Commons, Spinner } from '@chmap/utilities';

const { YearMetadata } = Commons;

function show(year){

    Spinner.show();

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
}
