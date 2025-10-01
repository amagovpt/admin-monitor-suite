import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private server: string;
  defaultURL = "/api";
  private environment = new BehaviorSubject<string>("");
  currentEnvironment = this.environment.asObservable(); 

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
    // console.log("server:", this.server, " service:", service)
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

  setEnvironment() : void {
    const endpoint = localStorage.getItem("server");
    if (endpoint.includes("preprod")) {
      this.environment.next("PPR");
    } else if (endpoint.includes("acessibilidade.gov.pt")) {
      this.environment.next("PRD");
    } else {
      this.environment.next("DEV");
    }
  }

  getEnvironment() : string {
    const endpoint = localStorage.getItem("server");
    if (endpoint.includes("preprod")) {
      return "PPR";
    } else if (endpoint.includes("acessibilidade.gov.pt")) {
      return "PRD";
    } else {
      return "DEV";
    }
  }


  private getCorrectApi(endpoint: string): string {
    let api = "/api";
    if (endpoint.startsWith("http://localhost")) 
      api = "";
    // if (endpoint === "https://preprodaccessmonitor.acessibilidade.gov.pt" || endpoint === "https://accessmonitor.acessibilidade.gov.pt")
    //   api = "/api";
    return api;
  }
}
