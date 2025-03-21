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
      popupAnchor: [0, -10]
    }
  }),
  iconSVG: function (params) {
    var svg = ''
    if (params.mtype === 'biography') {
      svg = `<svg height="${params.marker_size}px" width="${params.marker_width}px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" d="M11.6,29.7l-11.3-14c-0.4-0.4-0.4-1.1,0-1.5L11.6,0.3c0.4-0.4,1.1-0.4,1.5,0l11.3,13.9c0.4,0.4,0.4,1.1,0,1.5l-11.3,14C12.7,30.1,12,30.1,11.6,29.7z"></path></svg>`
    } else if (params.mtype === 'recherchiert') {
      svg = `<svg height="${params.marker_size}px" width="${params.marker_width}px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" d="M0,23.5L3.9,4.9c0-.6.6-1.1,1.2-1h18.6c.6.1,1,.7,1,1.3l-3.9,18.6c0,.6-.6,1.1-1.2,1H1c-.6,0-1-.6-1-1.2Z"></path></svg>`
    } else if (params.mtype === 'information') {
      svg = `<svg height="${params.marker_size}px" width="${params.marker_width}px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" ><path fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" d="M0.5,25.6c-0.3-0.3-0.3-0.9,0-1.2L11.4,3.5c0.3-0.3,0.9-0.3,1.2,0l10.9,20.9c0.3,0.3,0.3,0.9,0,1.2"></path></svg>`
    } else if (params.mtype === 'selbstaussage') {
      svg = `<svg height="${params.marker_size}px" width="${params.marker_width}px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" ><path fill="${params.color.toString()}" fill-opacity="${params.opacity}" stroke="${params.color.toString()}" stroke-width="${params.strokeWidth ? params.strokeWidth.toString() : 0}" stroke-opacity="1" d="M4.4,7c0.1-0.7,0.3-2,2-2h14.6c1.5,0,2,1.2,1.9,2.3L19.6,23c0,0.6-0.6,2-2,2H2.8C1.4,25,1,24.5,1,23.8L4.4,7z"/></svg>`      
    } else {
      svg = `<svg height="${params.marker_size}" width="${params.marker_size}" viewBox="0 0 ${params.marker_width} ${params.marker_size}" xmlns="http://www.w3.org/2000/svg">${params.defs_with_gradient}<circle class="cls-1" cx="${params.marker_size / 2}" cy="${params.marker_size / 2}" r="${params.marker_size / 2}" fill="${params.color}" fill-opacity="${params.opacity}" stroke="${params.stroke}" stroke-width="${params.stroke_width}" stroke-opacity="${params.stroke_opacity}" shape-rendering="geometricPrecision"></circle></svg>`
    }
    return encodeURI('data:image/svg+xml,' + svg).replace(new RegExp('#', 'g'), '%23')
  },
  create: function (params) {
    var defaultParams = {
      marker_size: 30,
      color: 'black',
      opacity: 0.8,
      stroke: 'transparent',
      stroke_width: 0,
      stroke_opacity: 0,
      defs_with_gradient: ''
    }
    if (params.mtype === 'biography') {
      params.marker_size = 40
      params.marker_width = 40      
    } else if (params.mtype === 'selbstaussage') {
      params.marker_size = 40
      params.marker_width = 40
    } else if (params.mtype === 'information') {
      params.marker_size = 40
      params.marker_width = 40
    }

    params = Object.assign({}, defaultParams, params)
    // console.log("PARAMS",params);
    return new this.CustomLargeIcon({ iconUrl: this.iconSVG(params), iconSize: [params.marker_size, params.marker_size] })
  }
}
