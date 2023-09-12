import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";

import { EditTagDialogComponent } from "../../../dialogs/edit-tag-dialog/edit-tag-dialog.component";
import { ChoosePagesToReEvaluateDialogComponent } from "./../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";
import { DeleteService } from "../../../services/delete.service";
import { CrawlerService } from "../../../services/crawler.service";
import { TagCrawlerInformationDialogComponent } from "../../../dialogs/tag-crawler-information-dialog/tag-crawler-information-dialog.component";
import { MessageService } from "../../../services/message.service";

@Component({
  selector: "app-list-of-tags",
  templateUrl: "./list-of-tags.component.html",
  styleUrls: ["./list-of-tags.component.css"],
})
export class ListOfTagsComponent implements OnInit {
  @Output("refreshTags") refreshTags = new EventEmitter<boolean>();
  @Input() directory: string;
  @Input() tags: any;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "Name",
    "Creation_Date",
    "Websites",
    //"re-evaluate",
    "edit",
    //"crawler",
    "delete",
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private readonly dialog: MatDialog,
    private readonly deleteService: DeleteService,
    private readonly crawler: CrawlerService,
    private readonly message: MessageService
  ) {
    this.loading = false;
    this.error = false;
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.tags);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateTagsWebsites(): void {
    const tagsId = this.selection.selected.map((t) => t.TagId);
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: tagsId,
        dialog: "tag",
      },
    });
  }

  edit(id: number, userId: number): void {
    const editDialog = this.dialog.open(EditTagDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      data: {
        id,
        userId,
      },
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTags.next(true);
      }
    });
  }

  openCrawlerDialog(): void {
    const tagsId = this.selection.selected.map((t) => t.TagId);
    this.crawler.crawlTag(tagsId).subscribe(() => {
      this.dialog.open(TagCrawlerInformationDialogComponent);
    });
  }

  deleteTags(): void {
    const tagsId = this.selection.selected.map((t) => t.TagId);
    this.deleteService
      .tags({
        tagsId: JSON.stringify(tagsId),
      })
      .subscribe((result) => {
        if (result) {
          this.refreshTags.next(true);
          this.message.show("TAGS_PAGE.DELETE.messages.tags_success");
        }
      });
  }

  deleteTagsPages(): void {
    const tagsId = this.selection.selected.map((t) => t.TagId);
    this.deleteService
      .tagsPages({
        tagsId: tagsId,
      })
      .subscribe((result) => {
        if (result) {
          this.message.show("TAGS_PAGE.DELETE.messages.pages_success");
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) =>
          this.selection.select(row)
        );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
}
