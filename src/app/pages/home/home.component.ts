import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CreateService } from "../../services/create.service";
import { EvaluationService } from "../../services/evaluation.service";
import { GetService } from "../../services/get.service";
import { MessageService } from "../../services/message.service";
import { VerifyService } from "../../services/verify.service";

import { DeleteEvaluationListConfirmationDialogComponent } from "../../dialogs/delete-evaluation-list-confirmation-dialog/delete-evaluation-list-confirmation-dialog.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  access_studies_users: number;
  access_studies_tags: number;
  access_studies_websites: number;

  my_monitor_users: number;
  my_monitor_websites: number;

  observatory_directories: number;
  observatory_tags: number;
  observatory_entities: number;
  observatory_websites: number;
  observatory_pages: number;

  ams_date: Date;
  mm_date: Date;
  sm_date: Date;
  am_date: Date;

  ams_counter: number;
  mm_counter: number;
  sm_counter: number;
  am_counter: number;

  admin_total: number;
  admin_evaluating: number;
  admin_waiting: number;
  admin_error: number;

  user_total: number;
  user_evaluating: number;
  user_waiting: number;
  user_error: number;

  constructor(
    private readonly dialog: MatDialog,
    private readonly create: CreateService,
    private readonly get: GetService,
    private readonly evaluation: EvaluationService,
    private readonly message: MessageService,
    private readonly cd: ChangeDetectorRef,
    private readonly verify: VerifyService
  ) {
    this.access_studies_users = 0;
    this.my_monitor_users = 0;
    this.access_studies_tags = 0;
    this.observatory_directories = 0;
    this.observatory_tags = 0;
    this.observatory_entities = 0;
    this.observatory_websites = 0;
    this.observatory_pages = 0;

    this.access_studies_websites = 0;
    this.my_monitor_websites = 0;

    this.ams_date = new Date();
    this.mm_date = new Date();
    this.sm_date = new Date();
    this.am_date = new Date();

    this.ams_counter = 0;
    this.mm_counter = 0;
    this.sm_counter = 0;
    this.am_counter = 0;

    this.admin_evaluating = 0;
    this.admin_waiting = 0;
    this.admin_error = 0;

    this.user_evaluating = 0;
    this.user_waiting = 0;
    this.user_error = 0;
  }

  ngOnInit(): void {
    this.get.numberOfStudyMonitorUsers().subscribe((total) => {
      this.access_studies_users = total;
      this.cd.detectChanges();
    });

    this.get.numberOfStudyMonitorTags().subscribe((total) => {
      this.access_studies_tags = total;
      this.cd.detectChanges();
    });

    this.get.numberOfStudyMonitorWebsites().subscribe((total) => {
      this.access_studies_websites = total;
      this.cd.detectChanges();
    });

    this.get.numberOfMyMonitorUsers().subscribe((total) => {
      this.my_monitor_users = total;
      this.cd.detectChanges();
    });

    this.get.numberOfMyMonitorWebsites().subscribe((total) => {
      this.my_monitor_websites = total;
      this.cd.detectChanges();
    });

    this.get.numberOfObservatoryDirectories().subscribe((total) => {
      this.observatory_directories = total;
      this.cd.detectChanges();
    });

    this.get.numberOfObservatoryTags().subscribe((total) => {
      this.observatory_tags = total;
      this.cd.detectChanges();
    });

    this.get.numberOfObservatoryEntities().subscribe((total) => {
      this.observatory_entities = total;
      this.cd.detectChanges();
    });

    this.get.numberOfObservatoryWebsites().subscribe((total) => {
      this.observatory_websites = total;
      this.cd.detectChanges();
    });

    this.get.numberOfObservatoryPages().subscribe((total) => {
      this.observatory_pages = total;
      this.cd.detectChanges();
    });

    this.get.numberOfAdminPagesBeingEvaluated().subscribe((total: number) => {
      this.admin_evaluating = total;
      this.cd.detectChanges();
    });

    this.get
      .numberOfAdminPagesWaitingForEvaluation()
      .subscribe((total: number) => {
        this.admin_waiting = total;
        this.cd.detectChanges();
      });

    this.get.numberOfAdminPagesWithError().subscribe((total: number) => {
      this.admin_error = total;
      this.cd.detectChanges();
    });

    this.get.numberOfUserPagesBeingEvaluated().subscribe((total: number) => {
      this.user_evaluating = total;
      this.cd.detectChanges();
    });

    this.get
      .numberOfUserPagesWaitingForEvaluation()
      .subscribe((total: number) => {
        this.user_waiting = total;
        this.cd.detectChanges();
      });

    this.get.numberOfUserPagesWithError().subscribe((total: number) => {
      this.user_error = total;
      this.cd.detectChanges();
    });

    this.evaluation.getAMSObservatoryRequestCounter().subscribe((data: any) => {
      this.ams_date = data.date;
      this.ams_counter = data.counter;
      this.cd.detectChanges();
    });

    this.evaluation.getMyMonitorRequestCounter().subscribe((data: any) => {
      this.mm_date = data.date;
      this.mm_counter = data.counter;
      this.cd.detectChanges();
    });

    this.evaluation.getStudyMonitorRequestCounter().subscribe((data: any) => {
      this.sm_date = data.date;
      this.sm_counter = data.counter;
      this.cd.detectChanges();
    });

    this.evaluation.getAccessMonitorRequestCounter().subscribe((data: any) => {
      this.am_date = data.date;
      this.am_counter = data.counter;
      this.cd.detectChanges();
    });
  }

  generateObservatoryData(): void {
    this.create.observatoryData().subscribe((success) => {
      if (success) {
        this.message.show("HOME_PAGE.generate_observatory_data_message");
      }
    });
  }

  resetAdminEvaluationList(): void {
    this.evaluation.resetAdminList().subscribe((success) => {
      if (success) {
        this.message.show("HOME_PAGE.reset_evaluation_list_message");
      }
    });
  }

  deleteAdminEvaluationList(): void {
    const deleteDialog = this.dialog.open(
      DeleteEvaluationListConfirmationDialogComponent,
      {
        disableClose: false,
        hasBackdrop: true,
      }
    );

    deleteDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.evaluation.deleteAdminList().subscribe((success) => {
          if (success) {
            this.message.show("HOME_PAGE.delete_evaluation_list_message");
          }
        });
      }
    });
  }

  resetMyMonitorEvaluationList(): void {
    this.evaluation.resetMyMonitorList().subscribe((success) => {
      if (success) {
        this.message.show("HOME_PAGE.reset_evaluation_list_message");
      }
    });
  }

  deleteMyMonitorEvaluationList(): void {
    const deleteDialog = this.dialog.open(
      DeleteEvaluationListConfirmationDialogComponent,
      {
        disableClose: false,
        hasBackdrop: true,
      }
    );

    deleteDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.evaluation.deleteMyMonitorList().subscribe((success) => {
          if (success) {
            this.message.show("HOME_PAGE.delete_evaluation_list_message");
          }
        });
      }
    });
  }

  resetStudyMonitorEvaluationList(): void {
    this.evaluation.resetStudyMonitorList().subscribe((success) => {
      if (success) {
        this.message.show("HOME_PAGE.reset_evaluation_list_message");
      }
    });
  }

  deleteStudyMonitorEvaluationList(): void {
    const deleteDialog = this.dialog.open(
      DeleteEvaluationListConfirmationDialogComponent,
      {
        disableClose: false,
        hasBackdrop: true,
      }
    );

    deleteDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.evaluation.deleteStudyMonitorList().subscribe((success) => {
          if (success) {
            this.message.show("HOME_PAGE.delete_evaluation_list_message");
          }
        });
      }
    });
  }

  loadDataFromFile() {
    // Open file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        this.processFileContent(content as string);
        };
      reader.readAsText(file);
    };
    input.click();
  }

  processFileContent(content: string) {
    const lines = content.split("\n");
    // Remove first line if it does not include the string http
    if (!lines[0].includes("http")) {
      lines.shift();
    }
    const numberLines = lines.length;
    this.processLine(0, lines, numberLines);
  }

  processLine(index: number, lines: string[], numberLines: number) {
    const parts = lines[index].split(";");
    const directory = parts[0];
    const category = parts[1];
    const name = parts[2];
    const url = parts[3];
    this.processDirectoryData(directory, category, name, url, index, lines, numberLines);
  }

  processDirectoryData(directory: string, category: string, name: string, url: string, index: number, lines: string[], numberLines: number) {
    this.get.listOfDirectories().subscribe((directories) => {
      let dirId : number = this.getDirectoryId(directory, directories);
      if (dirId === -1) {
        const directoryData = { name: directory, observatory: 0, method: "0", tags: [] };
        this.create.newDirectory(directoryData).subscribe(() => {
          this.get.listOfDirectories().subscribe((newDirectories) => {
            dirId = this.getDirectoryId(directoryData.name, newDirectories);
            this.processCategoryData(category, dirId, name, url, index, lines, numberLines);
          });
        });
      } else {
        this.processCategoryData(category, dirId, name, url, index, lines, numberLines);
      }
    });
  }

  processCategoryData(category: string, directory: number, name: string, url: string, index: number, lines: string[], numberLines: number) {
    this.get.listOfTags().subscribe((tags) => {
      let tagId : number = this.getTagId(category, tags);
      if (tagId === -1) {
        const tagData = { name: category, directories: [directory], websites: [] };
        this.create.newTag(tagData).subscribe(() => {
          this.get.listOfTags().subscribe((newTags) => {
            tagId = this.getTagId(tagData.name, newTags);
            this.processSiteData(name, url, tagId, category, index, lines, numberLines);
          });
        });
      } else {
        this.processSiteData(name, url, tagId, category, index, lines, numberLines);
      }
    });
  }

  processSiteData(name: string, url: string, tagId: number, tag: string, index: number, lines: string[], numberLines: number) {
    this.get.listOfTagWebsites(null, tag).subscribe((websites) => {
      for (const website of websites) {
        if (website.Name === name) {
          if (index + 1 < numberLines){
            this.processLine(index + 1, lines, numberLines);
          }
          return;
        }
      }
      const websiteData = {
        name: name,
        startingUrl: url,
        declaration: null,
        declaration_Update_Date: null,
        stamp: null,
        stamp_Update_Date: null,
        entities: null,
        userId: null,
        tags: [tagId],
      };
      this.create.newWebsite(websiteData).subscribe();
      if (index + 1 < numberLines){
        this.processLine(index + 1, lines, numberLines);
      }
});
  }
  

  private getDirectoryId(name: string, directories: any[]) : number {
    for (const directory of directories) {
      if (directory.Name === name) {
        return directory.DirectoryId;
      }
    }
    return -1;
  }

  private getTagId(name: string, tags: any[]) : number {
    for (const tag of tags) {
      if (tag.Name === name) {
        return tag.TagId;
      }
    }
    return -1;
  }

}
