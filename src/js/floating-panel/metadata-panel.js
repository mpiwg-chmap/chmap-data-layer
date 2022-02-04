
import { Commons, BootstrapWrap } from '@chmap/utilities';

const { Offcanvas } = BootstrapWrap;

let panel = null;

let panelBody = null;

const localEventEmitter = new Commons.EventEmitterClass();

function addEventListener(obj, types, fn, context){
    localEventEmitter.on(obj, types, fn, context);
}

function createUI(){

    const div = document.createElement('div');

    const html =
`<div 
     class="offcanvas offcanvas-end"
     style="width:40%;z-index:9996;"
     data-bs-scroll="true"
     data-bs-backdrop="false"
     tabindex="-1"
     aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header pb-0">
        <h5 class="offcanvas-title">Metadata</h5>
        <i class="bi bi-chevron-right btn-outline-success px-1" data-bs-dismiss="offcanvas" aria-label="Close" ></i>
    </div>
    <div class="offcanvas-body" style="padding-top:0.5rem;"></div>
</div>`;

    div.innerHTML = html;

    document.body.append(div);

    panelBody = div.querySelector('.offcanvas-body');

    panel = new Offcanvas(div.firstChild);


}

function bindShowYearMetadata(){

    const hypLink = panelBody.querySelector('.show-year-metadata-btn');

    if(hypLink){

        const year = parseFloat(hypLink.getAttribute('data-year'));

        hypLink.onclick = (e) => {
            e.preventDefault();
            localEventEmitter.emit('showYearMetadata', year);
        }
    }

}

function show(info){

    if(!panel){
        createUI();
    }

    panelBody.innerHTML = info;

    bindShowYearMetadata();

    panel.show();
}

export {
    show,
    addEventListener as on,
}

/* Events

    { name: 'showYearMetadata', params: year-Number}

 */
