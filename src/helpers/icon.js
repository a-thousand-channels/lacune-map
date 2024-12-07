export function Icon(iconData,layerId=0,layerTitle='') {
    /* -4 -4 34 28 */
    let offset = 0;
    if ( (iconData.subtitle == 'autobiografisch') || (iconData.subtitle == 'selbstaussage') || ( layerId === 83 )) {
        // offset for all non-circle symbols
        offset = -1;
    }
    if ( !layerTitle) {
        layerTitle= iconData.layerTitle;
    }
    const svg_header = `<svg height="27" width="21" viewBox="${offset} 0 30 30" xmlns="http://www.w3.org/2000/svg" data-layer-id="${layerId}" data-layer-title="${iconData.layerTitle ? iconData.layerTitle : layerTitle }"><title>${iconData.subtitle ? iconData.subtitle : layerTitle}</title>`;
    let svg_body = '';
    console.log('LayerId',layerId);
    if (( layerId === 83 ) || ( iconData.layerId === 83 )) {
        svg_body = `
            <path fill="${iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()}" fill-opacity="${iconData.checked === true ? 1 : 0}" stroke="${iconData.color.toString()}" stroke-width="${iconData.strokeWidth ? iconData.strokeWidth.toString() : 4}" stroke-opacity="1" d="M23.3,24.2L12.6,3.7c-0.3-0.3-0.9-0.3-1.2,0L1.7,24.2c-0.3,0.3-0.4,1,0,1.2c0.6,0.2,21.3,0.4,21.6,0C23.5,25,23.6,24.5,23.3,24.2z"></path>`;
    } else if (iconData.subtitle == 'autobiografisch') {  
        svg_body = `        
            <path fill="${iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()}" fill-opacity="${iconData.checked === true ? 1 : 0}" stroke="${iconData.color.toString()}" stroke-width="${iconData.strokeWidth ? iconData.strokeWidth.toString() : 4}" stroke-opacity="1" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path>`;
    } else if (iconData.subtitle == 'selbstaussage') {  
        svg_body = `                          
            <path fill="${iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()}" fill-opacity="${iconData.checked === true ? 1 : 0}" stroke="${iconData.color.toString()}" stroke-width="${iconData.strokeWidth ? iconData.strokeWidth.toString() : 4}" stroke-opacity="1" d="M0,23.5L3.9,4.9c0-.6.6-1.1,1.2-1h18.6c.6.1,1,.7,1,1.3l-3.9,18.6c0,.6-.6,1.1-1.2,1H1c-.6,0-1-.6-1-1.2Z"></path>`;
    } else {
        svg_body = `          
            <circle v-else class="cls-1" cx="15" cy="15" r="13" fill="${iconData.checked === true ? iconData.colorChecked.toString() : iconData.color.toString()}" fill-opacity="${iconData.checked === true ? 1 : 0}" stroke="${iconData.color.toString()}" stroke-width="${iconData.strokeWidth ? iconData.strokeWidth.toString() : 4}" stroke-opacity="1" shape-rendering="geometricPrecision"></circle>`;
    }
    return svg_header + svg_body + `</svg>`;
}