import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;

  constructor() {
    const host = location.hostname;
    const endpoint = localStorage.getItem("server");
    if (host === "localhost" && !endpoint) {
      this.server = "http://localhost:3000";
    } else {
      this.server = localStorage.getItem("server") + "/api";
    }
  }

  setEndpoint(endpoint: string): void {
    if (endpoint === "localhost") {
      this.server = "http://localhost:3000";
    } else {
      localStorage.setItem('server', endpoint);
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
