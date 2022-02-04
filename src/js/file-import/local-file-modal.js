
import { Constants, BootstrapWrap } from '@chmap/utilities';
const { EXAMPLE_FILES_DIR } = Constants;

const { Modal } = BootstrapWrap;

const LocalFileModal = function() {

    let modal = null;

    let gCallback = null

    function creat() {

        const html =
`<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Import local data</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3 local-data-file-input">
            <label class="form-label" for="localDataFile">*Local file</label>
            <input type="file" id="localDataFile">
        </div>
        <br>
        <pre>
CHMap supports three file formats:
1. CSV (<a id="open-logart-books.csv" class="example-file" href="#" download>example-text</a>, <a id="my-collection.csv" class="example-file" href="#" download>example-images</a>) 
   The required columns are: name, latitude, longitude and date. 
   If imageURL column is provided, the image markers will be displayed on the map.
2. GeoJson (<a id="geo-json-eagles.json" class="example-file" href="#" download>example-eagles</a>)
3. IIIF manifest.json (<a id="iiif-general-images.json" class="example-file" href="#" download>example-images</a>, <a id="iiif-map-images.json" class="example-file" href="#" download>example-maps</a>)
        </pre>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary import-btn">Import</button>
      </div>
    </div>
 </div>`;

        const div = document.createElement('div');

        div.className = 'modal fade';
        div.innerHTML = html;

        document.body.append(div);

        div.querySelector('.import-btn').onclick = onImport;

        setExampleFileURL(div);

        modal = Modal.getOrCreateInstance(div);

    }

    function setExampleFileURL(div) {

        const hyLinks = div.querySelectorAll('.example-file');

        for (const link of hyLinks) {

            link.href = EXAMPLE_FILES_DIR + link.id;
            link.target = "_blank";
        }

    }

    async function onImport() {

        const { loadLocalDataFile } = await import('./file-loader');

        loadLocalDataFile(modal._element.querySelector('#localDataFile'));

    }

    function show(callback) {

        if (!modal) {
            creat();
        }

        gCallback = callback;

        modal.show();

    }

    function hide() {

        if (modal) {
            modal.hide();
        }

    }

    return {
        show,
        hide,
    }

}();

export { LocalFileModal };
