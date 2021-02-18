import { Injectable } from "@angular/core";
import { MatDatepickerIntl } from "@angular/material/datepicker";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class MatDatepickerIntlCustom extends MatDatepickerIntl {
  calendarBodyLabel: string;
  constructor(private readonly translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  public getAndInitTranslations(): void {
    /*this.translate
      .get([
        "ITEMS_PER_PAGE_LABEL",
        "NEXT_PAGE_LABEL",
        "PREVIOUS_PAGE_LABEL",
        "FIRST_PAGE_LABEL",
        "LAST_PAGE_LABEL",
      ])
      .subscribe((translation: any) => {
        this.itemsPerPageLabel = translation["ITEMS_PER_PAGE_LABEL"];
        this.nextPageLabel = translation["NEXT_PAGE_LABEL"];
        this.previousPageLabel = translation["PREVIOUS_PAGE_LABEL"];
        this.firstPageLabel = translation["FIRST_PAGE_LABEL"];
        this.lastPageLabel = translation["LAST_PAGE_LABEL"];

        this.changes.next();
      });*/
    this.calendarBodyLabel = "Abril";
    /*this.formatYearRange = (start: string, end: string): string => {
      return "ola";
    };*/
    this.changes.next();
  }
}
