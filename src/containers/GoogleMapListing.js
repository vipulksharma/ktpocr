import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class GoogleMapListing extends Component {

    componentWillReceiveProps(newProps) {
      if(newProps.addresses && !this.props.addresses && newProps.categories) {
        const markers = newProps.addresses;
        const categories = newProps.categories;
        const {google} = window;
        let geocoder = new google.maps.Geocoder();
        let mapOptions;

        geocoder.geocode({
            'address': markers[0].Address + ',' + markers[0].City
        }, function(results, status) {
          if(status === google.maps.GeocoderStatus.OK) {
            mapOptions = {
                zoom: 8,
                center: {lat : results[0].geometry.location.lat(), lng : results[0].geometry.location.lng()},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            let infoWindow = new google.maps.InfoWindow();
            let latlngbounds = new google.maps.LatLngBounds();
            let map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
            for ( let i = 0; i < markers.length; i++) {
              let data = markers[i];
              geocoder.geocode({
                'address': data.Address + ',' + data.City
              }, function(results1, status1) {
                if(status1 === google.maps.GeocoderStatus.OK) {
                  const latlng = results1[0].geometry.location
                  let myLatlng = new google.maps.LatLng(latlng.lat(), latlng.lng());
                  let icon = categories[data.Category];
                  icon = "http://maps.google.com/mapfiles/ms/icons/" + icon + ".png";

                  let marker = new google.maps.Marker({
                      position: myLatlng,
                      map: map,
                      title: data.Address,
                      animation: google.maps.Animation.DROP,
                      icon: new google.maps.MarkerImage(icon)
                  });
                  (function (marker, data) {
                      google.maps.event.addListener(marker, "click", function (e) {
                          infoWindow.setContent(data.Address + ',' + data.City + ',' + data.state);
                          infoWindow.open(map, marker);
                      });
                  })(marker, data);
                  latlngbounds.extend(marker.position);

                  if (i === markers.length) {
                      var bounds = new google.maps.LatLngBounds();
                      map.setCenter(latlngbounds.getCenter());
                      map.fitBounds(latlngbounds);
                  }
                  map.fitBounds(bounds);
                }
              })
            }
          }
        });
      }
    }

    render(){
        const {addresses} = this.props;
        return (
          addresses ? <div className={"map-responsive"}>
            <div id='dvMap'></div>
          </div>: null)

    }

}
const mapStateToProps = state => ({
  addresses : state.addressReducer.addresses,
  categories : state.addressReducer.categories
})

export default withRouter(connect(mapStateToProps ,{})(GoogleMapListing));
