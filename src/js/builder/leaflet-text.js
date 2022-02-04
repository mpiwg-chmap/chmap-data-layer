import { setExtraProps } from './text-layer-extra-props';

if (L.Photo) {

  L.Text = L.Photo.extend({

    createMarker: function(node) {

      setExtraProps(node);

      const marker = L.marker(node, {
        icon: L.divIcon(
          L.extend(
            {
              html: node.iconHTML || `<div style="text-align:center;background-color:#34495E;color:white;">${node.caption}</div>`,
              className: "leaflet-marker-photo"
            },
            this.options.icon
          )
        ),
        title: node.caption || ''
      });

      marker.node = node;

      return marker;

    },

  });

  L.text = function (nodes, options) {
    return new L.Text(nodes, options);
  };

}

if (L.Photo.Cluster) {

  L.Text.Cluster = L.Photo.Cluster.extend({

    options: {
      featureGroup: L.text,
      iconCreateFunction: function(cluster) {

        const markers = cluster.getAllChildMarkers();

        const firstNode = markers[0].node;

        return new L.DivIcon(
          L.extend(
            {
              className: "leaflet-marker-photo",
              html:
`<div style="vertical-align:middle;text-align:center;background-color:${firstNode.bgColor || '#34495E'};color:${firstNode.wordColor || 'white'}">
  <span>${firstNode.shortCaption || firstNode.caption}</span>
  <span style="font-size: 8pt;white-space: nowrap;" >${this.getYears(markers)}</span>
</div>
<b>${cluster.getChildCount()}</b>`

            },
            this.icon
          )
        );
      },
      getYears: function(markers) {

        let years = [];

        for (const marker of markers) {
          years.push(parseInt(marker.node.date.getFullYear()));
        }

        const startYear = Math.min.apply(null, years);

        const endYear = Math.max.apply(null, years);

        let result = '';

        if (startYear === endYear) {
          result = startYear;
        } else if (startYear === -99999) {
          result = endYear;
        } else if (startYear !== NaN && endYear !== NaN) {
          result = `${startYear}-${endYear}`;
        }

        return result;
      }
    },
  });

  L.text.cluster = function(options) {
    return new L.Text.Cluster(options);
  };

}

