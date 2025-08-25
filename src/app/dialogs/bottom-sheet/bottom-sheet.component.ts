import { Component, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";

import { AddDirectoryDialogComponent } from "../add-directory-dialog/add-directory-dialog.component";
import { AddEntityDialogComponent } from "../add-entity-dialog/add-entity-dialog.component";
import { AddPageDialogComponent } from "../add-page-dialog/add-page-dialog.component";
import { AddTagDialogComponent } from "../add-tag-dialog/add-tag-dialog.component";
import { AddUserDialogComponent } from "../add-user-dialog/add-user-dialog.component";
import { AddWebsiteDialogComponent } from "../add-website-dialog/add-website-dialog.component";
import { UpdateA11yStatementDialogComponent } from "../update-a11y-statement-dialog/update-a11y-statement-dialog.component";
import { AddGovUserDialogComponent } from "../add-gov-user-dialog/add-gov-user-dialog.component";
import { UploadEvaluationCSVComponent } from "../upload-evaluation-csv/upload-evaluation-csv.component";

@Component({
  selector: "app-bottom-sheet",
  templateUrl: "./bottom-sheet.component.html",
  styleUrls: ["./bottom-sheet.component.css"],
})
export class BottomSheetComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>
  ) { }

  ngOnInit() {}
  
  openAddGovUserDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddGovUserDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddUserDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddUserDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddDirectoryDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddDirectoryDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddTagDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddTagDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddEntityDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddEntityDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddWebsiteDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddWebsiteDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openAddPageDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddPageDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }

  openUpdateAS(e): void {
    this.dialog.open(UpdateA11yStatementDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });

    this.bottomSheetRef.dismiss();
    e.preventDefault();

  }
   
  openUploadEvaluation(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(UploadEvaluationCSVComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });
  }
}
