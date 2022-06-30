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

  getCSVData(){
    this.get.getCSVData()
      .subscribe(result => {
        console.log(result);
        var blob = new Blob([JSON.stringify(result,null,2)], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "data.json");
      });
  }

  /*private createCSVFile(json) {
  // convert JSON array to CSV string
  const fields = ['type', 'elem', 'test', 'testAtt', 'score', 'level', 'trust', 'ref', 'scs', 'dis', 'result', 'qwAssertion', 'qwAssertionUrl', 'resultsPT.s', 'resultsPT.p', 'resultsEN.s', 'resultsEN.p', 'elemPT', 'techUrl', 'techPT', 'techTxtPT', 'elemEN', 'techEN', 'techTxtEN', 'testColors'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(json);
  const BOM = "\uFEFF";
  fs.writeFileSync("./result.csv", BOM + csv, { "encoding": "utf8" });
}*/

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
