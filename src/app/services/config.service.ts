import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;
  defaultURL = "/api2";

  constructor() {
    const endpoint = localStorage.getItem("server");
    if (endpoint) {
      this.server = endpoint + this.getCorrectApi(endpoint);
    } else {
      this.server = this.defaultURL;
    }
    console.log("construção" + this.server);
  }

  setEndpoint(endpoint: string): void {
    if (endpoint === "localhost") {
      this.server = this.defaultURL;
    } else {
      localStorage.setItem("server", endpoint);
      this.server = endpoint + this.getCorrectApi(endpoint);
    }
    console.log("set" + this.server);
  }

  getServer(service: string): string {
    console.log("get" + this.server);
    if (!this.server) {
      const endpoint = localStorage.getItem("server");
      console.log("storage" + endpoint);

      if (endpoint) {
        this.server = endpoint + this.getCorrectApi(endpoint);
      } else {
        this.server = this.defaultURL;
      }
    }
    return this.server + service;
  }
  private getCorrectApi(endpoint: string): string {
    let api = "/api";
    if (endpoint === "https://preprodaccessmonitor.acessibilidade.gov.pt" || endpoint === "https://accessmonitor.acessibilidade.gov.pt")
      api = "/api";
    return api;
  }
}
