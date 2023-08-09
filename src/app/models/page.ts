interface IPage {
  pageId: number;
  websiteId: number;
  uri: string;
  score: number;
  A: number;
  AA: number;
  AAA: number;
  creationDate: Date;
  evaluationDate: Date;
}

export class Page implements IPage {
  pageId: number;
  websiteId: number;
  uri: string;
  score: number;
  A: number;
  AA: number;
  AAA: number;
  creationDate: Date;
  evaluationDate: Date;

  constructor(pageId: number, websiteId: number, uri: string, score: number,
    A: number, AA: number, AAA: number, creationDate: Date, evaluationDate: Date) {

    this.pageId = pageId;
    this.websiteId = websiteId;
    this.uri = uri;
    this.score = score;
    this.A = A;
    this.AA = AA;
    this.AAA = AAA;
    this.creationDate = creationDate;
    this.evaluationDate = evaluationDate;
  }
}
