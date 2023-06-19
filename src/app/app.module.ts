import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { HelloThreeComponent } from './components/hello-three/hello-three.component'

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HelloThreeComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
