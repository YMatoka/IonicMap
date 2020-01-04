// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDW0aTtIIxoTSPz0Dnj57IoTr_b9yxKpCQ",
    authDomain: "ionicmap-e79cc.firebaseapp.com",
    databaseURL: "https://ionicmap-e79cc.firebaseio.com",
    projectId: "ionicmap-e79cc",
    storageBucket: "ionicmap-e79cc.appspot.com",
    messagingSenderId: "980081207811"
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoibWF0b2thIiwiYSI6ImNrMGR1b2ExYTA4dzIzZHRpMmF1Z2Z2ZGIifQ.OS0j05uEsw2TikicCyZqHg'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
