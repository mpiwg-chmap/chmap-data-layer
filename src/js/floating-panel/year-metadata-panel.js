
import { BootstrapWrap } from '@chmap/utilities';

const { Offcanvas } = BootstrapWrap;

let panel = null;

let panelBody = null;

function createUI(){

    const div = document.createElement('div');

    const html =
`<div 
     class="offcanvas offcanvas-end"
     style="width:40%;z-index:9997;"
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

    panelBody = div.querySelector('.offcanvas-body');

    panel = new Offcanvas(div.firstChild);


}

export function show(info){

    if(!panel){
        createUI();
    }

    panelBody.innerHTML = info;

    panel.show();
}
