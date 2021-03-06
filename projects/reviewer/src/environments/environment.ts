// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyACDBR28kYB0-zdtUrAF55VLI6jQ6zPb_s',
    authDomain: 'restaurant-suite-dweitz43.firebaseapp.com',
    databaseURL: 'https://restaurant-suite-dweitz43.firebaseio.com',
    projectId: 'restaurant-suite-dweitz43',
    storageBucket: 'restaurant-suite-dweitz43.appspot.com',
    messagingSenderId: '40172248779',
    appId: '1:40172248779:web:2df06fce7b70658726454e',
    measurementId: 'G-PG3233CC0Z',
  },
  base: 'http://localhost:5001/restaurant-suite-dweitz43/us-central1/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
