interface IWebsite {
  websiteId: number;
  name: string;
}

export class Website implements IWebsite {
  websiteId: number;
  name: string;

  constructor(websiteId: number, name: string) {
    this.websiteId = websiteId;
    this.name = name;
  }
}
