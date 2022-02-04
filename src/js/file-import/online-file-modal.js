
import { Constants, BootstrapWrap } from '@chmap/utilities';
const { EXAMPLE_FILES_DIR } = Constants;

const { Modal } = BootstrapWrap;

const OnlineFileModal = function() {

    let modal = null;

    let gCallback = null

    function creat() {

        const html =
`<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Import online data</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
            <label class="form-label" for="onlineDataUrl">*Url</label>
            <input type="text" id="onlineDataUrl" class="form-control" value="">
        </div>
         <br>
        <pre>
CHMap supports three file formats:
1. CSV (<a id="open-logart-books.csv" class="example-file" href="#">example-text</a>, <a id="my-collection.csv" class="example-file" href="#">example-images</a>) 
   The required columns are: name, latitude, longitude and date. 
   If imageURL column is provided, the image markers will be displayed on the map.
2. GeoJson (<a id="geo-json-eagles.json" class="example-file" href="#">example-eagles</a>)
3. IIIF manifest.json (<a id="iiif-general-images.json" class="example-file"  href="#">example-images</a>, <a id="iiif-map-images.json" class="example-file" href="#">example-maps</a>)
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
            link.onclick = (e) => {

                e.preventDefault();

                const target = e.target;

                const url = EXAMPLE_FILES_DIR + target.id;

                const input = target.parentElement.parentElement.querySelector('#onlineDataUrl');

                input.value = url;

                input.focus();
                input.scrollLeft = input.scrollWidth;

            }
        }

    }

    async function onImport() {

        const url = modal._element.querySelector('#onlineDataUrl').value.trim();

        const { loadOnlineDataFile } = await import('./file-loader');

        loadOnlineDataFile(url, 'unknown');

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

export { OnlineFileModal };
