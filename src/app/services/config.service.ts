import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;
  defaultURL = "";

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
    console.log("set " + this.server);
  }

  getServer(service: string): string {
    console.log("get " + this.server);
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

  getEnvironment() : string {
    let environment : string = "";
    const endpoint = localStorage.getItem("server");
    if (endpoint.includes("preprod")) {
      environment = "PPR";
    } else if (endpoint.includes("acessibilidade.gov.pt")) {
      environment = "PRD";
    } else {
      environment = "DEV";
    }
    return environment;
  }

  private getCorrectApi(endpoint: string): string {
    let api = "";
    if (endpoint === "https://preprodaccessmonitor.acessibilidade.gov.pt" || endpoint === "https://accessmonitor.acessibilidade.gov.pt")
      api = "/api";
    return api;
  }
}
