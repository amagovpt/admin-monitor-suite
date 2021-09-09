import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CreateService } from "../../services/create.service";
import { EvaluationService } from "../../services/evaluation.service";
import { GetService } from "../../services/get.service";
import { MessageService } from "../../services/message.service";

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
  observatory_websites: number;

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

  startingDate: Date;

  constructor(
    private readonly dialog: MatDialog,
    private readonly create: CreateService,
    private readonly get: GetService,
    private readonly evaluation: EvaluationService,
    private readonly message: MessageService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.access_studies_users = 0;
    this.my_monitor_users = 0;
    this.access_studies_tags = 0;
    this.observatory_directories = 0;
    this.observatory_tags = 0;
    this.observatory_websites = 0;
    this.access_studies_websites = 0;
    this.my_monitor_websites = 0;

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

    this.startingDate = new Date();
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

    this.get.numberOfObservatoryWebsites().subscribe((total) => {
      this.observatory_websites = total;
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

    this.evaluation
      .getAMSObservatoryRequestCounter()
      .subscribe((counter: number) => {
        this.ams_counter = counter;
        this.cd.detectChanges();
      });

    this.evaluation
      .getMyMonitorRequestCounter()
      .subscribe((counter: number) => {
        this.mm_counter = counter;
        this.cd.detectChanges();
      });

    this.evaluation
      .getStudyMonitorRequestCounter()
      .subscribe((counter: number) => {
        this.sm_counter = counter;
        this.cd.detectChanges();
      });

    this.evaluation
      .getAccessMonitorRequestCounter()
      .subscribe((counter: number) => {
        this.am_counter = counter;
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
}
