import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { MatTableModule } from '@angular/material/table'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatPaginatorModule } from '@angular/material/paginator'

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
