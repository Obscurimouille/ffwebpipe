import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { NodeComponent } from './view/node/node.component';
import { WiringService } from './services/wiring/wiring.service';
import { NodeService } from './services/node/node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild("nodes", { read: ViewContainerRef })
  private nodes!: ViewContainerRef;

  constructor(
    private nodeService: NodeService,
    private ref: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.addNode();
    this.addNode();
    this.addNode();
    this.addNode();
    this.ref.detectChanges();
  }

  onClick() {
    this.addNode();
  }

  private addNode() {
    const node = this.nodes.createComponent(NodeComponent);
    this.nodeService.addNode(node);
  }
}
