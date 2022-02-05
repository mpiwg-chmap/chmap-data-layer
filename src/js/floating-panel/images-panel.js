
import { Commons, BootstrapWrap } from '@chmap/utilities';

const { Offcanvas } = BootstrapWrap;

const localEventEmitter = new Commons.EventEmitterClass();

let panel = null;

let offCanvasTitle = null;

let panelBody = null;

function addEventListener(obj, types, fn, context){
    localEventEmitter.on(obj, types, fn, context);
}

function createUI(){

    const div = document.createElement('div');

    const html =
`<div 
     id="data-layer-images-panel"
     class="offcanvas offcanvas-start"
     style="width:40%;"
     data-bs-scroll="true"
     data-bs-backdrop="false"
     tabindex="-1"
     aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header pb-0">
        <h5 class="offcanvas-title"></h5>
        <i class="bi bi-chevron-left btn-outline-success px-1" data-bs-dismiss="offcanvas" aria-label="Close" ></i>
    </div>
    <div class="offcanvas-body" style="padding-top:0.5rem;">
    </div>
</div>`;

    div.innerHTML = html;

    document.body.append(div);

    bindPointersAndEvents(div);

}

function bindPointersAndEvents(div) {

    offCanvasTitle = div.querySelector('.offcanvas-title');

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

function setContent({title, subTitle, rows, isSingleBook}){

    let html = [subTitle, '<br>'];

    let tmpID = '';

    for (const row of rows) {

        if (!isSingleBook && tmpID !== row.ID) {

            if (tmpID !== "") {
                html.push('<br/>');
            }

            html.push(
              `${row.name} (${row["TimeSpan:begin"]} ~ ${row["TimeSpan:end"]}) <br> ${row.Dynasty} ${row.Period}  ${row.Edition} ${row.Volume} ${row.Author} ${row.Source}<br/>`
            );

            tmpID = row.ID;
        }

        html.push(`<img title="ID:${row.ID} Page:${row.Page} Tags:${row.Tags}" class="thumbnail-img" style="cursor:pointer;width:100px;height:150px;margin:0 5px 5px 0;" src="${row.imageURL}" />`);
    }

    offCanvasTitle.innerHTML = title;

    panelBody.innerHTML = html.join('');

    bindShowBigImage()

}

function bindShowBigImage(){

    const imgList = panelBody.querySelectorAll('.thumbnail-img');

    if(imgList){

        for(const img of imgList){

            img.onclick = (e) => {
                localEventEmitter.emit('showBigImage', img.src);
            }

        }
    }

}

function show(params){

    if(!panel){
        createUI();
    }

    setContent(params);

    panel.show();

    localEventEmitter.emit('shown', panel._element);
}

export {
    show,
    addEventListener as on,
}

/* Events

    { name: 'showBigImage', params: url-String }
    { name: 'shown', params: panelDom-Object }
    { name: 'hidden', params: panelDom-Object }

*/
