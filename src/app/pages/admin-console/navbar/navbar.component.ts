import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import * as _ from "lodash";
import { GetService } from "../../../services/get.service";
import FileSaver from 'file-saver';


@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  sub: any;
  home: string;
  users: string;
  directories: string;
  tags: string;
  entities: string;
  websites: string;
  crawler: string;
  pages: string;
  settings: string;

  constructor(private router: Router, private get: GetService,) {
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.home = _.isEqual(_.size(_.split(event.url, "/")), 2)
          ? "primary"
          : "default";
        this.users = _.includes(event.url, "users") ? "primary" : "default";
        this.directories = _.includes(event.url, "directories")
          ? "primary"
          : "default";
        this.tags = _.includes(event.url, "tags") ? "primary" : "default";
        this.entities = _.includes(event.url, "entities")
          ? "primary"
          : "default";
        this.websites = _.includes(event.url, "websites")
          ? "primary"
          : "default";
        this.crawler = _.includes(event.url, "crawler") ? "primary" : "default";
        this.pages = _.includes(event.url, "pages") ? "primary" : "default";
        this.settings = _.includes(event.url, "settings")
          ? "primary"
          : "default";
      }
    });
  }

  getCSVData() {
    this.get.getCSVData()
      .subscribe(results => {
        console.log(results);
        const lineEnd = '\n'
        const sep = ',';
        let CSV = "WebsiteId,Name,StartingUrl,Declaration,Declaration_Update_Date,Stamp,Stamp_Update_Date,Creation_Date,Tags,numberOfPages,averagePoints" + lineEnd;
        results.map((result) => {
          CSV += result.WebsiteId + sep + result.Name.replace(',', '') + sep + result.StartingUrl + sep + result.Declaration + sep + result.Declaration_Update_Date
            + sep + result.Stamp + sep + result.Stamp_Update_Date + sep + result.Creation_Date + sep + this.getTagsStr(result.Tags) + sep + result.numberOfPages + sep + result.averagePoints + lineEnd;
        })
        const BOM = "\uFEFF";
        let blob = new Blob([BOM+CSV], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "data.csv");
      });
  }

  getTagsStr(tags) {
    return tags.reduce((res, tag, index) => {
      console.log(tag.Name);
      console.log(res);
      return res + tag.Name.replace(',','') + (index === tags.length - 1 ? '' : ';');
    }, '');
  }


  /*private createCSVFile(json) {
  // convert JSON array to CSV string
  const fields = ['type', 'elem', 'test', 'testAtt', 'score', 'level', 'trust', 'ref', 'scs', 'dis', 'result', 'qwAssertion', 'qwAssertionUrl', 'resultsPT.s', 'resultsPT.p', 'resultsEN.s', 'resultsEN.p', 'elemPT', 'techUrl', 'techPT', 'techTxtPT', 'elemEN', 'techEN', 'techTxtEN', 'testColors'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(json);
  const BOM = "\uFEFF";
  fs.writeFileSync("./result.csv", BOM + csv, { "encoding": "utf8" });
}*/

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
