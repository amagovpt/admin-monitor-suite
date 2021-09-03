import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;

  constructor() {
    const endpoint = localStorage.getItem("server");
    if (endpoint) {
      this.server = endpoint + "/api";
    } else {
      this.server = "http://localhost:3000";
    }
  }

  setEndpoint(endpoint: string): void {
    if (endpoint === "localhost") {
      this.server = "http://localhost:3000";
    } else {
      localStorage.setItem("server", endpoint);
      this.server = endpoint + "/api";
    }
  }

  getServer(service: string): string {
    if (!this.server) {
      const endpoint = localStorage.getItem("server");
      if (endpoint) {
        this.server = endpoint + "/api";
      } else {
        this.server = "http://localhost:3000";
      }
    }
    return this.server + service;
  }
}
