import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;

  constructor() {
    const host = location.hostname;

    if (host === "localhost") {
      this.server = "http://localhost:3000";
    } else {
      this.server = localStorage.getItem("server") + "/api";
    }
  }

  setEndpoint(endpoint: string): void {
    localStorage.setItem('server', endpoint);
    if (endpoint === "localhost") {
      this.server = "http://localhost:3000";
    } else {
      this.server = endpoint + "/api";
    }
  }

  getServer(service: string): string {
    if (!this.server) {
      this.server = localStorage.getItem("server") + '/api';
    }
    return this.server + service;
  }
}
