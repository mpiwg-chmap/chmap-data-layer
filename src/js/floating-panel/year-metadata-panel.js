
import { Commons, BootstrapWrap } from '@chmap/utilities';

const { Offcanvas } = BootstrapWrap;

const localEventEmitter = new Commons.EventEmitterClass();

let panel = null;

let panelBody = null;

function addEventListener(obj, types, fn, context) {
    localEventEmitter.on(obj, types, fn, context);
}

function createUI(){

    const div = document.createElement('div');

    const html =
`<div 
     id="data-layer-year-metadata-panel"
     class="offcanvas offcanvas-end"
     style="width:40%;"
     data-bs-scroll="true"
     data-bs-backdrop="false"
     tabindex="-1"
     aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header pb-0">
        <h5 class="offcanvas-title">Year Metadata</h5>
        <i class="bi bi-chevron-right btn-outline-success px-1" data-bs-dismiss="offcanvas" aria-label="Close" ></i>
    </div>
    <div class="offcanvas-body" style="padding-top:0.5rem;"></div>
</div>`;

    div.innerHTML = html;

    document.body.append(div);

    bindPointersAndEvents(div);

}

function bindPointersAndEvents(div) {

    panelBody = div.querySelector('.offcanvas-body');

    const offCanvasDom= div.firstChild;

    panel = new Offcanvas(offCanvasDom);

    // offCanvasDom.addEventListener('shown.bs.offcanvas', () => {
    //     localEventEmitter.emit('shown', offCanvasDom);
    // });

    offCanvasDom.addEventListener('hidden.bs.offcanvas', () => {
        localEventEmitter.emit('hidden', offCanvasDom);
    });

}

function show(info){

    if(!panel){
        createUI();
    }

    panelBody.innerHTML = info;

    panel.show();

    localEventEmitter.emit('shown', panel._element);
}

export {
    show,
    addEventListener as on,
}

/* Events

    { name: 'shown', params: panelDom-Object }
    { name: 'hidden', params: panelDom-Object }

*/
