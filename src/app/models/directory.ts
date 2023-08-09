interface IDirectory {
  name: string;
  Pages: Array<number>;
}

export class Directory implements IDirectory {
  name: string;
  Pages: Array<number>;

  constructor(name: string, Pages: Array<number>) {
    this.name = name;
    this.Pages = Pages;
  }
}
