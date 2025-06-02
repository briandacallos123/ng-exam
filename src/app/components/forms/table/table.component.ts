import { Component, Input } from '@angular/core';
import {
  type tableRow,
  type tableHeader,
} from '../../../shared/models/table.models';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-table',
  imports: [ModalComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() controlled?: boolean;
  @Input() isControlOpen?: boolean;
  rowClicked?: any;

  @Input() isLoading?: boolean;

  @Input({ required: true }) header!: tableHeader[];
  @Input({ required: true }) rowData!: tableRow[];

  // modal table
  // @Input() modalHeader?: tableHeader[];
  // modalRow?: tableRow[];

  @Input() subHeader?: tableHeader[];

  toggleControl(row?: any) {
    this.isControlOpen = !this.isControlOpen;
    // assign hobbies to modal row temporary
    // this.modalRow = row?.hobbies;
    if (this.rowClicked) {
      if (this.rowClicked.id !== row?.id) {
        this.rowClicked = null;
        this.rowClicked = row;
      } else {
        this.rowClicked = null;
      }
    } else {
      this.rowClicked = row;
    }
  }

  isCollapsed(row: any): boolean {
    return row['hobbies']?.length && this.rowClicked?.id !== row['id'];
  }

  isShowSubTable(row: any): boolean {
    return row?.id === this.rowClicked?.id;
  }
}
