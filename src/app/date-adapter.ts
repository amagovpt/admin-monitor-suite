import { NativeDateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";

export interface DateDisplay {
  year: string;
  month: string;
  day: string;
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: { month: "long", year: "numeric", day: "numeric" },
  },
  display: {
    //dateInput: { month: "long", year: "numeric", day: "numeric" },
    dateInput: "customInput",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};

export class CustomDatePickerAdapter extends NativeDateAdapter {
  parse(value: string): Date | null {
    /*if (typeof value === "string" && value.indexOf(".") > -1) {
      const str: string[] = value.split(".");
      if (
        str.length < 2 ||
        isNaN(+str[0]) ||
        isNaN(+str[1]) ||
        isNaN(+str[2])
      ) {
        return null;
      }
      return new Date(Number(str[2]), Number(str[1]) - 1, Number(str[0]));
    }
    const timestamp: number =
      typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? new Date(value) : new Date(timestamp);*/
    try {
      let split: Array<string>;
      if (value.includes("-")) {
        split = value.split("-");
      } else if (value.includes("/")) {
        split = value.split("/");
      }

      return new Date([split[1], split[0], split[2]].join("/"));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  format(date: Date, display: string | DateDisplay): string {
    if (display === "customInput") {
      return new DatePipe(this.locale).transform(date, "shortDate");
    } else {
      return new DatePipe(this.locale).transform(date, "MMMM yyyy");
    }
  }
}
