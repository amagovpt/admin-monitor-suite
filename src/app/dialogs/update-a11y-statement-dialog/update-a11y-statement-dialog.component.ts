import { Component, OnInit } from '@angular/core';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-update-a11y-statement-dialog',
  templateUrl: './update-a11y-statement-dialog.component.html',
  styleUrls: ['./update-a11y-statement-dialog.component.css']
})
export class UpdateA11yStatementDialogComponent implements OnInit {

  constructor(private update: UpdateService) { }

  ngOnInit(): void {
    this.update.a11yStatementUpdateAll().subscribe(data => {});
  }
}
