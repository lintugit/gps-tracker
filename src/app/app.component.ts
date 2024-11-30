import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    // SplashScreen.show({
    //   showDuration: 3000,  // Duration of splash screen in milliseconds
    //   autoHide: true,      // Whether to automatically hide the splash screen
    // });
  } 
}
