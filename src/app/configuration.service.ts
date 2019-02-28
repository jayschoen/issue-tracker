import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from './configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private app_settings: AppConfig;

  constructor(private httpClient: HttpClient) { }

  loadConfig() {
    const jsonFile = `assets/configuration.json`;
    return this.httpClient.get(jsonFile)
      .toPromise()
      .then(
        data => {
          this.settings = data;
      });

  }

  get settings() {
    return this.app_settings;
  }

  set settings(updatedSettings: Object) {
    this.app_settings = { ...this.app_settings, ...updatedSettings };
  }
}
