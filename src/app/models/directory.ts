interface IDirectory {
  Name: string;
  Pages: Array<number>;
}

export class Directory implements IDirectory {
  Name: string;
  Pages: Array<number>;

  constructor(Name: string, Pages: Array<number>) {
    this.Name = Name;
    this.Pages = Pages;
  }
}
