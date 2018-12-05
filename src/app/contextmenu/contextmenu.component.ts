import { Component, Input } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent{

  private dashboardComponent:DashboardComponent;

  constructor(private dashboardservice:DashboardService,) {
      // this.dashboardComponent = new DashboardComponent();
  }

  handleRightClickFile(file):void {
    // this.dashboardComponent.openDialog(FileDialogComponent)
  }

  @Input() x=0;
  @Input() y=0;

}
