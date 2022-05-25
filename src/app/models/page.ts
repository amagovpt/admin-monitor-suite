interface IPage {
  PageId: number;
  WebsiteId: number;
  Uri: string;
  Score: number;
  A: number;
  AA: number;
  AAA: number;
  Creation_Date: Date;
  Evaluation_Date: Date;
}

export class Page implements IPage {
  PageId: number;
  WebsiteId: number;
  Uri: string;
  Score: number;
  A: number;
  AA: number;
  AAA: number;
  Creation_Date: Date;
  Evaluation_Date: Date;

  constructor(PageId: number, WebsiteId: number, Uri: string, Score: number,
    A: number, AA: number, AAA: number, Creation_Date: Date, Evaluation_Date: Date) {

    this.PageId = PageId;
    this.WebsiteId = WebsiteId;
    this.Uri = Uri;
    this.Score = Score;
    this.A = A;
    this.AA = AA;
    this.AAA = AAA;
    this.Creation_Date = Creation_Date;
    this.Evaluation_Date = Evaluation_Date;
  }
}
