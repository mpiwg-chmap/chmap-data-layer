import { Commons } from '@chmap/utilities';

const localEventEmitter = new Commons.EventEmitterClass();

function addEventListener(obj, types, fn, context){
    localEventEmitter.on(obj, types, fn, context);
}

function loadLocalDataFile(fileInput){

    //only process one file.
    const aFile = fileInput.files[0];

    if (aFile !== undefined) {

        const reader = new FileReader();

        reader.onload = () => localEventEmitter.emit('dataFileRead', { text: reader.result, type: 'unknown'});

        const extensionName = aFile.name.split(".")[1].toLowerCase();

        if ( extensionName === "csv" || extensionName === "json") {
            reader.readAsText(aFile, "UTF-8");
        } else {
            //TODO: i18n
            localEventEmitter.emit('exception', "Only CSV or GeoJson file format is allowed!");
        }

        fileInput.value = '';
    }

}

function loadOnlineDataFile(url, fileType, requireCredentials){

    if(url.trim() === '') return;

    const fetchOpts = { method: 'GET' };

    if(requireCredentials){
        fetchOpts.credentials = 'include';
    }

    fetch(url, fetchOpts)
        .then(response => response.ok ? response : Promise.reject({err: response.status}))
        .then(response => response.text())
        .then(text => localEventEmitter.emit('dataFileRead', { text, type: fileType }))
        .catch(error => {
            localEventEmitter.emit('exception', error);
        });

}

export {
    loadLocalDataFile,
    loadOnlineDataFile,
    addEventListener as on,
}

/* Events

    { name: 'dataFileRead', params: { text, type }}
    { name: 'exception', params: String }

 */
