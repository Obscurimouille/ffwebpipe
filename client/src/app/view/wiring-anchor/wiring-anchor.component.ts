import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NodeService } from 'src/app/services/node/node.service';
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
  public sourceNodeId!: number;

  @Input()
  public sourceElement?: HTMLElement;

  @Input()
  public targetNodeId?: number;

  @Input()
  public attached = false;

  @Output()
  public removedEvent: EventEmitter<void> = new EventEmitter<void>();

  private line: any;

  constructor(
    private nodeService: NodeService,
    private wiringService: WiringService
  ) { }

  onDragStarted(event: CdkDragStart) {
    const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
    console.log('start drag anchor source:', this.sourceNodeId)
    if (this.attached) {
      const existingWire = this.wiringService.getWire({sourceId: this.sourceNodeId, targetId: this.targetNodeId});
      this.wiringService.deleteWire(existingWire!);
    }
    const sourceNode = this.nodeService.getNode(this.sourceNodeId)!;
    const sourceNodeElement = sourceNode.instance.nodeContentRef.nativeElement;
    this.line = this.wiringService.create(sourceNodeElement, preview);
  }

  onDragMoved(event: CdkDragMove) {
    this.line.position();
  }

  onDragEnded(event: CdkDragEnd) {
    this.line.remove();
    if (this.attached) {
      this.removedEvent.emit();
    }
  }

}
