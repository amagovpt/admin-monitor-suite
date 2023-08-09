interface ITag {
  name: string;
  Pages: Array<number>;
}

export class Tag implements ITag {
  name: string;
  Pages: Array<number>;

  constructor(name: string, Pages: Array<number>) {
    this.name = name;
    this.Pages = Pages;
  }
}
