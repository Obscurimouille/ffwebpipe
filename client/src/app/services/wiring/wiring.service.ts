import { ComponentRef, ElementRef, HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WireRef } from 'src/app/types/types';
import { NodeComponent } from 'src/app/view/node/node.component';

declare var LeaderLine: any;


@Injectable({
  providedIn: 'root'
})
export class WiringService {

  private wireArray: WireRef[] = [];

  public wiring = false;

  constructor() { }

  create(startAnchor: HTMLElement, endAnchor: HTMLElement): any {
    return new LeaderLine(startAnchor, endAnchor, {
      color: 'black',
      endPlugSize: 1,
      startPlug: 'square',
      endPlug: 'hand'
    });
  }

  doWireExists(sourceNodeId: number, targetNodeId: number): boolean {
    const existingWire = this.wireArray.find(
      w => w.sourceNodeId === sourceNodeId && w.targetNodeId === targetNodeId
    );
    return !!existingWire;
  }

  addWire(wire: WireRef) {
    const existingWire = this.doWireExists(wire.sourceNodeId, wire.targetNodeId);
    if (existingWire) return;
    this.wireArray.push(wire);
  }

  getWires(): WireRef[] {
    return this.wireArray;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    // this.done();
  }

}
