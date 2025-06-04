import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() isControl?: boolean;
  @Input() isControlOpen?: boolean;
  rowClickedItem?: any;

  @Input() isLoading?: boolean;

  @Input({ required: true }) header!: tableHeader[];
  @Input({ required: true }) rowData!: tableRow[];

  // modal table
  // @Input() modalHeader?: tableHeader[];
  // modalRow?: tableRow[];

  @Input() subHeader?: tableHeader[];
  @Input() subRow?: tableRow[];
  @Input() subRowKey?: string;
  @Output() onClickRow = new EventEmitter();

  toggleControl(row?: any) {
    this.isControlOpen = !this.isControlOpen;
    if (this.rowClickedItem) {
      if (this.rowClickedItem.id !== row?.id) {
        this.rowClickedItem = null;
        this.rowClickedItem = row;
        this.clickedRow(row);
      } else {
        this.rowClickedItem = null;
      }
    } else {
      this.rowClickedItem = row;
      this.clickedRow(row);
    }
  }

  isCollapsed(row: tableRow): boolean {
    return Number(this.rowClickedItem?.id) !== Number(row['id']);
  }

  hasSubrow(row: tableRow): boolean {
    return row[`${this.subRowKey}`]?.length !== 0;
  }

  isShowSubTable(row: any): boolean {
    return row?.id === this.rowClickedItem?.id;
  }

  clickedRow(row: any) {
    this.onClickRow.emit(row);
  }
}
