import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { GetService } from "../../services/get.service";

@Component({
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.css"],
})
export class TagsComponent implements OnInit {
  loading: boolean;

  tags: any;

  constructor(
    private readonly get: GetService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.getListOfTags();
  }

  refreshTags(): void {
    this.loading = true;
    this.getListOfTags();
  }

  private getListOfTags(): void {
    this.get.listOfTags().subscribe((tags) => {
      this.tags = tags;
      this.loading = false;
      this.cd.detectChanges();
    });
  }
}
