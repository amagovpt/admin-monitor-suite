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
    "re-evaluate",
    "edit",
  ];

  dataSource: any;
  selection: any;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) {
    this.loading = false;
    this.error = false;
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

  reEvaluateTagWebsites(tagId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: tagId,
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
}
