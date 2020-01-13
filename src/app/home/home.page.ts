import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { Plugins } from '@capacitor/core';
import * as mapboxgl from 'mapbox-gl';


const { Geolocation } = Plugins;
 
declare var google;
declare var Mapbox;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // Firebase Data
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  locationList: any;
  espion:any;
  

  // Map related
  @ViewChild('map',{static: false}) mapElement: ElementRef;
  map: any;
  dict = [];
  markers = [];
  compteur=0;
  coordo:any;
  
  // Misc
  isTracking = false;
  watch: string;
  user = null;
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    
    //this.anonLogin();
  }
 
  ionViewDidEnter() {
    //this.showMap();
}

ionViewWillLeave() {
    //this.hideMap();
}

  ionViewWillEnter() {
    this.loadMap();
  }
 
// Perform an anonymous login and load data
anonLogin() {
  this.afAuth.auth.signInAnonymously().then(res => {
    this.user = res.user;
    
    this.locationsCollection = this.afs.collection(
      `locaTest/${this.user.uid}/lastTest`,
      ref => ref.orderBy('name')
    );

    // Make sure we also get the Firebase item ID!
    this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
 
    
    // Update Map marker on every change
    // this.locations.subscribe(locations => {
    //   this.updateMap(locations,this.map);
    // });
  });
}
 
  // Initialize a blank map
  loadMap() {
   
    mapboxgl.accessToken = environment.mapbox.accessToken   

    if ("geolocation" in navigator) { 
      
      navigator.geolocation.getCurrentPosition(position => {
        
        let coord = [position.coords.longitude,position.coords.latitude];
  

        //Initializing Map
        mapboxgl.accessToken = 'pk.eyJ1IjoibWF0b2thIiwiYSI6ImNrMGt4cTk2aTBvYWkzZG16NDZxdnV0b2YifQ.LHErlha2xH9OmAFDGn3hUA';
        this.map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/dark-v10',
        center: coord,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coord
        },
        zoom: 16,
        pitch: 80,
        minZoom: 4, //restrict map zoom - buildings not visible beyond 13
        maxZoom: 30,
        setView: true,
        container: 'map'
        
      })
      let marker = new mapboxgl.Marker()
      .setLngLat(coord)
      .setPopup(new mapboxgl.Popup({ offset: 50 })
      .setHTML('<h3>' + "Yann MATOKA" + '</h3><p>' + coord  + '</p>'+ '<button onclick="deleteMarkers()" class="favorite styled" type="button">' + "Ajouter en Ami(e)" +'</button>'))
      .addTo(this.map);

      this.markers.push(marker);
      this.dict.push({
        key:   coord,
        value: this.compteur
      });
      this.compteur= this.compteur+1;

      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    //Mise à jour de la carte avec les positions présentes dans la base
    this.locations.subscribe(locations => {
      this.updateMap(locations);
    });
  });
}
  else{ 
    console.log("geolocation not actived")}
}
// Use Capacitor to track our geolocation
startTracking() {
  this.isTracking = true;
  this.watch = Geolocation.watchPosition({}, (position, err) => {
    if (position) {
      this.addNewLocation(
        position.coords.latitude,
        position.coords.longitude,
        "Alain MATOKA"
      );
    }
  });
}
 
// Unsubscribe from the geolocation watch using the initial ID
stopTracking() {
  Geolocation.clearWatch({ id: this.watch }).then(() => {
    this.isTracking = false;
  });
}
 
// Save a new location to Firebase and center the map
addNewLocation(lat, lng, name) {
  this.locationsCollection.add({
    lat,
    lng,
    name
  });
  //this.locationsCollection.get
  // let position = new mapboxgl.Map({center: [lng,lat]});
  // this.map.setCenter(position);
  // this.map.setZoom(5);
}
 
// Delete a location from Firebase
deleteLocation(pos) {
  this.locationsCollection.doc(pos.id).delete();
}
 
deleteMarkers(){
  if (this.markers!==null) {
    for (var i = this.markers.length - 1; i >= 0; i--) {
      this.markers[i].remove();
    }
  }
}
// Redraw all markers on the map
updateMap(locations) {
  
  // this.markers.map(marker => marker.Remove);
  
  for (let loc of locations) {
    this.coordo = [loc.lng,loc.lat];

    let marker = new mapboxgl.Marker()
    .setLngLat(this.coordo)
    .setPopup(new mapboxgl.Popup({ offset: 50 })
    .setHTML('<h3>' + loc.name + '</h3><p>' + this.coordo  + '</p>'+ '<button class="favorite styled" type="button">' + "Ajouter en Ami(e)" +'</button>'))
    .addTo(this.map);

    this.markers.push(marker);
    this.dict.push({
      key:   this.coordo,
      value: this.compteur
    });
    this.compteur= this.compteur+1;

  }
  // Remove all current marker
  let indice=this.dict.keys()
  // if (this.markers!==null) {
  //   for (var i = this.markers.length - 1; i >= 0; i--) {
  //     this.markers[i].remove();
  //   }
  // }
}


}