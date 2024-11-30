import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = 'testkunde@paj-gps.de';
  password = 'App123###...';
  loginError: boolean = false;
  loginErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  // Function to handle login
  async login() {
    if (!this.email || !this.password) {
      this.showToast('Please enter both email and password');
      return;
    }

    // Show loading spinner while logging in
    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    // Call auth service for login
    this.authService.login(this.email, this.password).subscribe(
      async (response) => {
        await loading.dismiss();
        console.log('Login success:', response);

        // Save token securely (you can use a more secure method like Ionic Secure Storage)
        localStorage.setItem('token', response.success.token);

        // Navigate to the map page after successful login
        this.router.navigate(['/map']);
      },
      async (error) => {
        await loading.dismiss();
        this.loginError = true;
        this.loginErrorMessage = 'Invalid email or password';

        // Show error toast
        this.showToast('Login failed. Please try again.');
        console.error('Login failed:', error);
      }
    );
  }

  // Helper function to display toast messages
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
