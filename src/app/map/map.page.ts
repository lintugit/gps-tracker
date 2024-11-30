import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { Router } from '@angular/router';
import * as maplibregl from 'maplibre-gl';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  devices: any = [];
  map!: maplibregl.Map;
  selectedDevice: any;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private alertController: AlertController 
  ) {}

  ngOnInit() {
    this.initializeMap();
    this.loadDevices();
    
    // this.addCustomLayer();
  }
  addCustomLayer() {
    this.map.addLayer({
      id: 'my-custom-layer',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [-77.034084, 38.909671],
                    [-77.033941, 38.909674],
                    [-77.033948, 38.909818],
                    [-77.034091, 38.909818],
                    [-77.034084, 38.909671]
                  ]
                ]
              },
              properties: {}
            }
          ]
        }
      },
      paint: {
        'fill-color': '#FF0000',
        'fill-opacity': 0.5
      }
    });
  }

  initializeMap() {
    // Initialize map once
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
    });
  }

  async loadDevices() {
    try {
      const response = await this.deviceService.getDevices().toPromise();
      this.devices = response.success;
      const deviceIdsArray = this.devices.map((dev: any) => dev.id);
      console.log('Extracted Device IDs:', deviceIdsArray);
      this.addDevicesToMap(deviceIdsArray);
    } catch (error) {
      this.handleError(error, 'Error fetching devices');
    }
  }

  async addDevicesToMap(deviceIdsArray: any) {
    try {
      const response = await this.deviceService.getDeviceLastPosition(deviceIdsArray).toPromise();
      let last_points = response.success;

      last_points.forEach((position: any) => {
        const { lat, lng } = position;
        new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(this.map);
      });
    } catch (error) {
      this.handleError(error, 'Error fetching device positions');
    }
  }

  async flyToDevice(device: any) {
    try {
      const response = await this.deviceService.getTrackingData(device.id, 1).toPromise();
      const coordinates = response.success.map((point: any) => [point.lng, point.lat]);
      if (coordinates.length > 0) {
        this.map.flyTo({
          center: coordinates[0], 
          zoom: 4,
        });
        coordinates.forEach((coord: any) => {
          new maplibregl.Marker().setLngLat(coord).addTo(this.map);
        });
      }
    } catch (error) {
      this.handleError(error, 'Error fetching tracking data for the device');
    }
  }

  async showDeviceRoute(deviceId: string) {
    try {
      const response = await this.deviceService.getTrackingData(deviceId, 50).toPromise();
      const coordinates = response.success.map((point: any) => [point.lng, point.lat]);
      if (coordinates.length > 0) {
        this.map.flyTo({
          center: coordinates[0], 
          zoom: 14,
        });
        this.removeRouteLayer();
        this.addRouteLayer(coordinates);
        coordinates.forEach((coord: any) => {
          new maplibregl.Marker().setLngLat(coord).addTo(this.map);
        });
      }
    } catch (error) {
      this.handleError(error, 'Error fetching tracking data');
    }
  }
  removeRouteLayer() {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route'); // Remove the source too
    }
  }
  addRouteLayer(coordinates: any) {
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
          properties: {}
        },
      },
      paint: {
        'line-color': '#FF0000',        // Line color
        'line-width': 4,                // Line width
        'line-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 0,     // Fade out as zoom level decreases
          10, 1      // Fade in as zoom level increases
        ],
      },
    });
    
  }
  

  async showClientLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      this.map.flyTo({
        center: [longitude, latitude],
        zoom: 12,
      });
      new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(this.map);
    } catch (error) {
      this.handleError(error, 'Error fetching client location');
    }
  }

  zoomIn() {
    try {
      this.map.zoomIn();
    } catch (error) {
      this.handleError(error, 'Error zooming in');
    }
  }

  zoomOut() {
    try {
      this.map.zoomOut();
    } catch (error) {
      this.handleError(error, 'Error zooming out');
    }
  }

  centerMap() {
    try {
      this.map.setCenter([0, 0]); // Reset to default center
    } catch (error) {
      this.handleError(error, 'Error centering the map');
    }
  }

  async trackUserLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      this.map.setCenter([longitude, latitude]);
      this.map.setZoom(14);
    } catch (error) {
      this.handleError(error, 'Error tracking user location');
    }
  }

  // Show an error message with alert
  async handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    const alert = await this.alertController.create({
      header: 'Error',
      message: `${customMessage}: ${error.message || 'An unexpected error occurred.'}`,
      buttons: ['OK'],
    });
    await alert.present();
  }
  changeMapStyle(style: string) {
    this.map.setStyle(style);
  }
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }
}
