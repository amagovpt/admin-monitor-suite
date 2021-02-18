import {
  OnInit,
  OnDestroy,
  Component,
  Injectable,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { DateAdapter } from "@angular/material/core";
import * as _ from "lodash";

@Injectable()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  selectedLang: string;
  langs: {} = {
    pt: "Portuguese",
    en: "English",
  };

  langCodes: any = {
    English: "en",
    Portuguese: "pt",
  };

  showGoToTop: boolean;

  sub: Subscription;

  constructor(
    public el: ElementRef,
    public translate: TranslateService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.translate.addLangs(_.values(this.langs));
    this.translate.setDefaultLang("Portuguese");

    const lang = localStorage.getItem("language");
    if (!lang) {
      const browserLang = translate.getBrowserLang();
      const use = _.includes(_.keys(this.langs), browserLang)
        ? this.langs[browserLang]
        : "Portuguese";

      this.translate.use(use);
      localStorage.setItem("language", use);
      this.dateAdapter.setLocale(this.langCodes[use]);
    } else {
      this.translate.use(lang);
    }

    this.selectedLang = this.translate.currentLang;
    this.dateAdapter.setLocale(this.langCodes[lang]);
    this.showGoToTop = false;
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.updateLanguage();
    });
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        document.getElementById("main").scrollIntoView();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /**
   * Update the language in the lang attribute of the html element.
   */
  updateLanguage(): void {
    const lang = document.createAttribute("lang");
    lang.value = this.langCodes[this.translate.currentLang];
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(
      lang
    );
  }

  changeLanguage(): void {
    this.translate.use(this.selectedLang);
    this.dateAdapter.setLocale(this.selectedLang);
    localStorage.setItem("language", this.selectedLang);
    this.updateLanguage();
  }

  goToTop(): void {
    document.getElementById("main").scrollIntoView();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(e): void {
    if (document.documentElement.scrollTop > 300) {
      this.showGoToTop = true;
    } else {
      this.showGoToTop = false;
    }
  }
}
