import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class MatPaginatorIntlCustom extends MatPaginatorIntl {
  itemsPerPageLabel = "Stavki po stranici";
  nextPageLabel = "Slijedeća stranica";
  previousPageLabel = "Prethodna stranica";

  constructor(private readonly translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  public getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant("RANGE_PAGE_LABEL_1", { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return this.translate.instant("RANGE_PAGE_LABEL_2", {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  };

  public getAndInitTranslations(): void {
    this.translate
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
      });
  }
}

/*export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = this.translate.instant(
    "ITEMS_PER_PAGE_LABEL"
  );
  paginatorIntl.nextPageLabel = this.translate.instant("NEXT_PAGE_LABEL");
  paginatorIntl.previousPageLabel = this.translate.instant(
    "PREVIOUS_PAGE_LABEL"
  );
  paginatorIntl.firstPageLabel = this.translate.instant("FIRST_PAGE_LABEL");
  paginatorIntl.lastPageLabel = this.translate.instant("LAST_PAGE_LABEL");
  paginatorIntl.getRangeLabel = getRangeLabel;

  return paginatorIntl;
}*/
