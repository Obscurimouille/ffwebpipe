import { CdkDragDrop, CdkDragExit } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NodeService } from 'src/app/services/node/node.service';
import { WiringService } from 'src/app/services/wiring/wiring.service';
import { WireRef } from 'src/app/types/types';
import { WiringAnchorComponent } from '../wiring-anchor/wiring-anchor.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit, AfterViewInit {

  @ViewChild('nodeContent', { read: ElementRef })
  public nodeContentRef!: ElementRef;

  @ViewChildren('inputAnchors')
  public inputAnchorsList!: QueryList<WiringAnchorComponent>;

  public id: number = NodeService.newId();

  public inputNodeIds: number[] = [];

  constructor(
    private wiringService: WiringService,
    private nodeService: NodeService,
    private ref: ChangeDetectorRef
    ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onMove() {
    this.getAssociatedWires().forEach(wire => {
        wire.lineObject.position();
    });
  }

  getAssociatedWires() {
    const associatedWires = this.wiringService.getWiresForNode(this.id);
    return associatedWires;
  }

  onDropListDropped(event: CdkDragDrop<any>) {
    console.log('onDropListDropped')
    console.log(event)
    const sourceNodeId = Number(event.item.element.nativeElement.id);
    console.log(sourceNodeId)
    if (sourceNodeId === this.id) return;

    const sourceNode = this.nodeService.getNode(sourceNodeId);
    if (!sourceNode) return;

    if (this.wiringService.getWire({sourceId: sourceNodeId, targetId: this.id})) {
      console.error('wire already exists');
      return;
    }

    this.inputNodeIds.push(sourceNodeId);
    this.ref.detectChanges();
    this.refreshWires();

    const anchors = this.inputAnchorsList.toArray();

    console.log(anchors);
    const anchor = anchors.find(anchor => {
      console.log('for anchor')
      console.log(anchor)
      return anchor.sourceNodeId == sourceNodeId;
    });
    if (!anchor) {
      console.error("Cannot find anchor");
      return;
    }

    console.log('selected anchor', anchor)

    const line = this.wiringService.create(
      sourceNode.instance.nodeContentRef.nativeElement,
      anchor.anchorRef.nativeElement
    );

    this.wiringService.addWire({
      sourceNodeId: sourceNodeId,
      targetNodeId: this.id,
      lineObject: line
    });
  }

  public get wires(): WireRef[] {
    return this.wiringService.getWiresForNode(this.id);
  }

  onDropListExited(event: CdkDragExit) {
    console.log('onDropListExited', event);
  }

  onInputRemoved(sourceNodeId: number) {
    console.log("onInputRemoved on node", this.id, sourceNodeId)
    const index = this.inputNodeIds.indexOf(sourceNodeId);
    if (index == -1) return;
    this.inputNodeIds.splice(index, 1);
    console.log([...this.getAssociatedWires()])
    this.ref.detectChanges();
    console.log([...this.getAssociatedWires()])
    this.refreshWires();
  }

  // TODO: Reassigner les ancres au lines
  private refreshWires(): void {
    console.log([...this.getAssociatedWires()])
    this.getAssociatedWires().forEach(wire => {
      console.log(wire.lineObject.start)
      console.log(wire.lineObject.end)
      wire.lineObject.position();
    });
    console.log('done')
    this.ref.detectChanges();
  }

  public trackInputAnchors(anchor: any, index: number): any {
    return anchor;
  }

}
