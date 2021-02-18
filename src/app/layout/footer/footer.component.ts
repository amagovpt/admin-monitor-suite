import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DateAdapter } from "@angular/material/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  selectedLang: string;

  langCodes: any = {
    English: "en",
    Portuguese: "pt",
  };

  constructor(
    public translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.selectedLang = this.translate.currentLang;
  }

  changeLanguage(): void {
    this.translate.use(this.selectedLang);
    this.dateAdapter.setLocale(this.langCodes[this.selectedLang]);
    localStorage.setItem("language", this.selectedLang);
  }
}
