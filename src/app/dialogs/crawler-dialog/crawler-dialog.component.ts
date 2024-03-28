import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CrawlerService } from "../../services/crawler.service";
import { MessageService } from "../../services/message.service";
import { CreateService } from "../../services/create.service";
import { VerifyService } from "../../services/verify.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { GetService } from "../../services/get.service";
import { Observable } from "rxjs";
import * as _ from "lodash";

@Component({
  selector: "app-crawler-dialog",
  templateUrl: "./crawler-dialog.component.html",
  styleUrls: ["./crawler-dialog.component.css"],
})
export class CrawlerDialogComponent implements OnInit {
  separatorKeysCodes = [ENTER, COMMA];
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;
  error: boolean;
  crawlExecuting: boolean;
  pageForm: FormGroup;

  websites: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private create: CreateService,
    private get: GetService,
    private crawl: CrawlerService,
    private msg: MessageService,
    private verify: VerifyService,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<CrawlerDialogComponent>,
    private cd: ChangeDetectorRef
  ) {
    this.websites = this.data;
    this.pageForm = this.formBuilder.group({
      maxDepth: new FormControl("", [
        Validators.pattern("^[0-9]*[0-9][0-9]*$"),
        Validators.required,
      ]),
      maxPages: new FormControl("", [
        Validators.pattern("^[0-9]*$"),
        Validators.required,
      ]),
      waitJS: new FormControl()
    });
    this.error = false;
    this.crawlExecuting = false;
  }

  ngOnInit() {
    this.get.getCrawlerConfig().subscribe((result) => {
      if (result !== null) {
        this.pageForm.controls.maxDepth.setValue(result.maxDepth);
        this.pageForm.controls.maxPages.setValue(result.maxPages);
      }
    });
  }

  executeCrawler() {
    const data = {
      websites: this.websites,
      maxDepth: this.pageForm.value.maxDepth,
      maxPages: this.pageForm.value.maxPages,
      waitJS: this.pageForm.value.waitJS ? 1 : 0,
    };
    this.crawl.callCrawler(data).subscribe((response) => {
      this.crawlExecuting = !!response;
    });
  }

  resetForm() {
    //this.pageForm.controls.maxDepth.setValue('1');
    //this.pageForm.controls.maxPages.setValue('0');
    this.pageForm.reset();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  goToCrawlerList() {
    this.closeDialog();
    this.router.navigateByUrl("/console/crawler");
  }
}
