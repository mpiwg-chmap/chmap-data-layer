//forked from https://github.com/turban/Leaflet.Photo

L.Photo = L.FeatureGroup.extend({

  initialize: function(photos, options) {

    L.setOptions(this, options);

    L.FeatureGroup.prototype.initialize.call(this, photos);

  },

  addLayers: function(photos) {

    if (photos) {

      for(const photo of photos){
        this.addLayer(photo);
      }

    }

    return this;
  },

  addLayer: function(photo) {
    L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(photo));
  },

  createMarker: function(photo) {

    const marker = L.marker(photo, {
          icon: L.divIcon(
            L.extend(
              {
                html: `<div style="background-image: url(${photo.thumbnail});cursor:pointer;"></div>`,
                className: "leaflet-marker-photo"
              },
              this.options.icon
            )
          ),
          title: photo.caption || ''
        });

    marker.photo = photo;

    return marker;
  }
});

L.photo = function(photos, options) {
  return new L.Photo(photos, options);
};

if (L.MarkerClusterGroup) {

  L.Photo.Cluster = L.MarkerClusterGroup.extend({
    options: {
      featureGroup: L.photo,
      //spiderfyOnMaxZoom: true,
      //animate: true,
      maxClusterRadius: 100,
      iconCreateFunction: function(cluster) {

        const firstThumbnail = cluster.getAllChildMarkers()[0].photo.thumbnail;

        return new L.DivIcon(
          L.extend(
            {
              className: "leaflet-marker-photo",
              html: `<div style="background-image: url(${firstThumbnail});"></div><b>${cluster.getChildCount()}</b>`
            },
            this.icon
          )
        );

      }
    },

    initialize: function(options) {

      options = L.Util.setOptions(this, options);

      L.MarkerClusterGroup.prototype.initialize.call(this);

      this._photos = options.featureGroup(null, options);
    },

    add: function(photos) {

      this.addLayer(this._photos.addLayers(photos));

      return this;
    },

    clear: function() {
      this._photos.clearLayers();
      this.clearLayers();
    }
  });

  L.photo.cluster = function(options) {
    return new L.Photo.Cluster(options);
  };
}
