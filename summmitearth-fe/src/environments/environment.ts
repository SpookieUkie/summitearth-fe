// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  
  production: false,
  appURL:  "http://localhost:8100/#/",
  apiURL:  "http://ukie.local:3000/api",
  mapURL: "http://localhost:8888/maps/index.html?job_id=0&land_uid=0&prov=AB&key_id=4r4fw802Xext4Zm&view_type=readonly&",
  seMapApiURL: 'http://localhost:8888/maps/services/dfrtracking/request_app.php?request_type=track_user&job_id=0&land_uid=0&user_id=',
  

  /*
  production: false,
  appURL:  "https://dfrdemo.summitearth.com/#/",
  apiURL: "https://dfrdemo.summitearth.com:444/api",
  mapURL: "https://demo.summitearth.com/maps/index.html?job_id=0&land_uid=0&prov=AB&view_type=readonly&user_id=",
  seMapApiURL: "https://dfrdemoauth.summitearth.com/request_app.php?request_type=track_user&job_id=0&land_uid=0&user_id=", 
*/

/*
  production: true,
  appURL:  "https://dfr.summitearth.com/#/",
  apiURL: "https://dfr.summitearth.com:444/api",
  mapURL: "https://dwm.summitearth.com/mapsV2/index.html?job_id=0&land_uid=0&prov=AB&view_type=readonly&user_id=",
  seMapApiURL: "https://dfrauth.summitearth.com/request_app.php?request_type=track_user&job_id=0&land_uid=0&user_id=", 
  */
  appVersion: '1.0.9'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/dist/zone-error';  // Included with Angular CLI.
