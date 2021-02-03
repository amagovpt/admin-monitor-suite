import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import tests from "../../tests";

@Component({
  selector: "app-success-criteria-counter",
  templateUrl: "./success-criteria-counter.component.html",
  styleUrls: ["./success-criteria-counter.component.css"],
})
export class SuccessCriteriaCounterComponent implements OnInit {
  @Input("data") data: any;

  scs: any;
  scsSuccess: string[];
  scsErrors: string[];
  loading: boolean;

  constructor(private readonly cd: ChangeDetectorRef) {
    this.scs = {
      success: {},
      errors: {},
    };
    this.loading = true;
  }

  ngOnInit(): void {
    for (const key in this.data.success || {}) {
      const scs = tests[key].scs.split(",");
      for (const sc of scs || []) {
        if (this.scs.success[sc] !== undefined) {
          this.scs.success[sc]++;
        } else {
          this.scs.success[sc] = 1;
        }
      }
    }

    this.scsSuccess = Object.keys(this.scs.success).sort();

    for (const key in this.data.errors || {}) {
      const scs = tests[key].scs.split(",");
      for (const sc of scs || []) {
        if (this.scs.errors[sc] !== undefined) {
          this.scs.errors[sc]++;
        } else {
          this.scs.errors[sc] = 1;
        }
      }
    }

    this.scsErrors = Object.keys(this.scs.errors).sort();

    this.loading = false;
    this.cd.detectChanges();
  }
}
