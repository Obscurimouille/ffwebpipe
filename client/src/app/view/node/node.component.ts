import { CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
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

  private addInput(sourceNodeId: number): void {
    this.inputNodeIds.push(sourceNodeId);
    this.ref.detectChanges();
    this.refreshWires();
  }

  private removeInput(sourceNodeId: number): void {
    const index = this.inputNodeIds.indexOf(sourceNodeId);
    if (index == -1) return;
    this.inputNodeIds.splice(index, 1);
    this.ref.detectChanges();
    this.refreshWires();
  }

  getAssociatedWires() {
    const associatedWires = this.wiringService.getWiresForNode(this.id);
    return associatedWires;
  }

  onDropListDropped(event: CdkDragDrop<any>) {
    const sourceNodeId = Number(event.item.element.nativeElement.id);
    if (sourceNodeId === this.id) return;

    const sourceNode = this.nodeService.getNode(sourceNodeId);
    if (!sourceNode) return;

    if (this.wiringService.getWire({sourceId: sourceNodeId, targetId: this.id})) {
      console.error('wire already exists');
      return;
    }

    this.addInput(sourceNodeId);

    const anchors = this.inputAnchorsList.toArray();
    const anchor = anchors.find(anchor => {
      return anchor.sourceNodeId == sourceNodeId;
    });
    if (!anchor) {
      console.error("Cannot find anchor");
      return;
    }

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

  onDropListEntered(event: CdkDragEnter) {
    console.log('onDropListEntered', this.id, event);
    this.refreshWires();
  }

  onDropListExited(event: CdkDragExit) {
    console.log('onDropListExited', this.id, event);
    setTimeout(() => this.refreshWires(), 10);
  }

  onInputRemoved(sourceNodeId: number) {
    console.log("onInputRemoved on node", this.id, sourceNodeId)
    setTimeout(() => this.refreshWires(), 10);
  }

  // TODO: Bug multiple ancres fantomes

  private refreshWires(): void {
    console.log([...this.getAssociatedWires()])
    this.getAssociatedWires().forEach(wire => {
      wire.lineObject.position();
    });
    this.ref.detectChanges();
  }

}
