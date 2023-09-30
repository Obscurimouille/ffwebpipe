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

  private defaultLineOptions = {
    color: 'black',
    endPlugSize: 1,
    startPlug: 'square',
    endPlug: 'hand',
    startSocket: 'right',
    endSocket: 'left',
  };

  constructor() { }

  create(startAnchor: HTMLElement, endAnchor: HTMLElement, options?: any): any {
    const calculatedOptions = {...this.defaultLineOptions, ...options};
    return new LeaderLine(startAnchor, endAnchor, calculatedOptions);
  }

  public addWire(wire: WireRef) {
    const existingWire = this.getWire({sourceId: wire.sourceNodeId, targetId: wire.targetNodeId});
    if (existingWire) return;
    this.wireArray.push(wire);
    console.log('wire added', this.wireArray);
  }

  public getWire(data: {sourceId?: number, targetId?: number}): WireRef | undefined {
    const wires = this.getWires(data);
    if (!wires.length) return undefined;
    return wires[0];
  }

  public getWires(data?: {sourceId?: number, targetId?: number}): WireRef[] {
    const wires = this.wireArray.filter(w => {
      if (!!data?.sourceId) {
        if (w.sourceNodeId !== data.sourceId) return false;
      }
      if (!!data?.targetId) {
        if (w.targetNodeId !== data.targetId) return false;
      }
      return true;
    });
    return wires;
  }

  public deleteWire(wireRef: WireRef) {
    const index = this.wireArray.indexOf(wireRef);
    if (index == -1) return;
    this.wireArray[index].lineObject.remove();
    this.wireArray.splice(index, 1);
  }

  public getWiresForNode(nodeId: number): WireRef[] {
    return this.wireArray.filter(w => w.sourceNodeId === nodeId || w.targetNodeId === nodeId);
  }

}
