import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeComponent } from './view/node/node.component';
import { WiringAnchorDirective } from './directives/wiring-anchor.directive';
import { WiringAnchorComponent } from './view/wiring-anchor/wiring-anchor.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    WiringAnchorDirective,
    WiringAnchorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
