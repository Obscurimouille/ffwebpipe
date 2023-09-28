import { ComponentRef, Injectable } from '@angular/core';
import { NodeComponent } from 'src/app/view/node/node.component';

@Injectable({
  providedIn: 'root',
})
export class NodeService {

  private nodeMap = new Map<number, ComponentRef<NodeComponent>>();

  constructor() {}

  public static newId(): number {
    return Math.round(Math.random() * 100000);
  }

  addNode(node: ComponentRef<NodeComponent>) {
    this.nodeMap.set(node.instance.id, node);
  }

  getNode(id: number): ComponentRef<NodeComponent> | undefined {
    return this.nodeMap.get(id);
  }
  
}
