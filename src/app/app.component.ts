import { Component } from '@angular/core';
import { AudioPlayerComponent } from "./audio-player/audio-player.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AudioPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'link-player';
}
