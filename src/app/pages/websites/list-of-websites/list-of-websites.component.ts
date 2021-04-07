import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { Overlay } from "@angular/cdk/overlay";
import * as _ from "lodash";

import { MessageService } from "./../../../services/message.service";
import { DigitalStampService } from "./../../../services/digital-stamp.service";

import { EditWebsiteDialogComponent } from "../../../dialogs/edit-website-dialog/edit-website-dialog.component";
import { ChoosePagesToReEvaluateDialogComponent } from "../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";
import { DeleteService } from "../../../services/delete.service";
import { CrawlerDialogComponent } from "../../../dialogs/crawler-dialog/crawler-dialog.component";

@Component({
  selector: "app-list-of-websites",
  templateUrl: "./list-of-websites.component.html",
  styleUrls: ["./list-of-websites.component.css"],
})
export class ListOfWebsitesComponent implements OnInit {
  @Output("refreshWebsites") refreshWebsites = new EventEmitter<boolean>();
  @Input("directory") directory: string;
  @Input("websites") websites: any;

  displayedColumns = [
    "Name",
    //"User",
    "Pages",
    "Creation_Date",
    "re-evaluate",
    "edit",
    "crawler",
    "stamp",
    "see",
    "delete"
  ];

  // data source of domains
  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    private message: MessageService,
    private digitalStamp: DigitalStampService,
    private readonly deleteService: DeleteService,
  ) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.websites);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateWebsitePages(domainId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: domainId,
        dialog: "website",
      },
    });
  }

  edit(id: number, userType: string): void {
    const editDialog = this.dialog.open(EditWebsiteDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: { id, userType },
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshWebsites.next(true);
      }
    });
  }

  openCrawlerDialog(e: Event, url: string, domainId: number): void {
    e.preventDefault();

    this.dialog.open(CrawlerDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: {url, domainId}
    });
  }

  generateDigitalStamps(): void {
    this.digitalStamp.generateForAll().subscribe((errors) => {
      if (_.size(errors) === 0) {
        this.message.show("DIGITAL_STAMP.messages.generate_all_success");
      }
    });
  }

  generateWebsiteDigitalStamp(websiteId: number, name: string): void {
    this.digitalStamp
      .generateForWebsite({ websiteId, name })
      .subscribe((success) => {
        if (success) {
          this.message.show("DIGITAL_STAMP.messages.generate_website_success");
        }
      });
  }

  getDigitalStampUrl(websiteId: number): string {
    return this.digitalStamp.getDigitalStampUrl(websiteId);
  }

  openDeleteWebsitesDialog(): void {
    const websitesId = this.selection.selected.map(w => w.WebsiteId);
    this.deleteService.websites({
      websitesId: JSON.stringify(websitesId)
    }).subscribe(result => {
      if (result) {
        this.refreshWebsites.next(true);
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
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
