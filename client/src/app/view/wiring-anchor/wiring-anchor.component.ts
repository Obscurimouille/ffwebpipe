import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { WiringService } from 'src/app/services/wiring/wiring.service';

@Component({
  selector: 'app-wiring-anchor',
  templateUrl: './wiring-anchor.component.html',
  styleUrls: ['./wiring-anchor.component.scss']
})
export class WiringAnchorComponent {

  @ViewChild('anchor', { read: ElementRef })
  public anchorRef!: ElementRef;

  @Input()
  public node!: HTMLElement;

  @Input()
  public nodeId!: number;

  private line: any;

  constructor(private wiringService: WiringService) { }

  onDragStarted(event: CdkDragStart) {
    const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
    this.line = this.wiringService.create(this.node, preview);
  }

  onDragMoved(event: CdkDragMove) {
    this.line.position();
  }

  onDragEnded(event: CdkDragEnd) {
    this.line.remove();
  }

}
