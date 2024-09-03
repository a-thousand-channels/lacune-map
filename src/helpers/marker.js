/*
call me like this:

var params = {
  color: "red",
  opacity: 1,
  stroke: "black",
  stroke_width: 1,
  stroke_opacity: 1,
  defs_with_gradient: ""
};

var icon = LargeMarkerIcon.create(params);

*/

import L from 'leaflet'

export var LargeMarkerIcon = {
  CustomLargeIcon: L.Icon.extend({
    options: {
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    }
  }),
  iconSVG: function (params) {
    var svg = ''
    if (params.mtype === 'biography') {
      svg = `<svg height="${params.marker_size}" width="${params.marker_width}" xmlns="http://www.w3.org/2000/svg" ><path fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path></svg>`
    } else if (params.mtype === 'information') {
      svg = `<svg height="${params.marker_size}" width="${params.marker_width}" xmlns="http://www.w3.org/2000/svg" ><path fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" d="M0.5,25.6c-0.3-0.3-0.3-0.9,0-1.2L11.4,3.5c0.3-0.3,0.9-0.3,1.2,0l10.9,20.9c0.3,0.3,0.3,0.9,0,1.2"></path></svg>`
    } else {
      svg = `<svg height="${params.marker_size}" width="${params.marker_size}" xmlns="http://www.w3.org/2000/svg">${params.defs_with_gradient}<circle class="cls-1" cx="${params.marker_size / 2}" cy="${params.marker_size / 2}" r="${params.marker_size / 2}" fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" shape-rendering="geometricPrecision"></circle></svg>`
    }
    return encodeURI('data:image/svg+xml,' + svg).replace(new RegExp('#', 'g'), '%23')
  },
  create: function (params) {
    var defaultParams = {
      marker_size: 30,
      color: 'black',
      opacity: 0.76,
      stroke: 'transparent',
      stroke_width: 0,
      stroke_opacity: 0,
      defs_with_gradient: ''
    }
    if (params.mtype === 'biography') {
      params.marker_width = 30
    } else if (params.mtype === 'information') {
      params.marker_width = 30
    }

    params = Object.assign({}, defaultParams, params)
    // console.log("PARAMS",params);
    return new this.CustomLargeIcon({ iconUrl: this.iconSVG(params) })
  }
}
