import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NodeService } from 'src/app/services/node/node.service';
import { WiringService } from 'src/app/services/wiring/wiring.service';
import { WireRef } from 'src/app/types/types';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit, AfterViewInit {

  @ViewChild('nodeContent', { read: ElementRef })
  public nodeContentRef!: ElementRef;

  public id: number = NodeService.newId();

  constructor(
    private wiringService: WiringService,
    private nodeService: NodeService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onMove() {
    this.wiringService.getWires().forEach(wire => {
      if (wire.targetNodeId === this.id || wire.sourceNodeId === this.id) {
        wire.lineObject.position();
      }
    });
  }

  onDropListDropped(event: CdkDragDrop<any>) {
    const sourcetNodeId = Number(event.item.element.nativeElement.id);
    if (sourcetNodeId === this.id) return;

    const sourceNode = this.nodeService.getNode(sourcetNodeId);
    if (!sourceNode) return;

    console.log('from', sourcetNodeId, 'to', this.id);
    if (this.wiringService.doWireExists(sourcetNodeId, this.id)) {
      console.log('wire already exists');
      return;
    }

    this.wiringService.addWire({
      sourceNodeId: sourcetNodeId,
      targetNodeId: this.id,
      lineObject: this.wiringService.create(
        sourceNode.instance.nodeContentRef.nativeElement,
        this.nodeContentRef.nativeElement
      )
    });
  }

}
