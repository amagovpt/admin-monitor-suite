import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CreateService } from "../../services/create.service";
import { GetService } from "../../services/get.service";
import { MessageService } from "../../services/message.service";

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

  evaluations: number;

  constructor(
    private readonly create: CreateService,
    private readonly get: GetService,
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

    this.evaluations = 0;
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

    this.get.numberOfPagesWaitingForEvaluation().subscribe((total) => {
      this.evaluations = total;
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
}
