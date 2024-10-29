import { Component, Inject, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TRACKS_KEY } from '../consts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AudioTrack {
  id: string;
  url: string;
  name: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  public tracks: AudioTrack[] = [];
  public currentTrack: AudioTrack | null = null;
  public audioUrl = '';
  private audio = new Audio();
  private volume = 1;

  constructor(@Inject(StorageService) private storageService: StorageService) {}
  
  // -------------------
  // Track management methods

  async addTrack(track: AudioTrack) {
    this.tracks.push(track);
    await this.saveTracks();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    this.addTracks(files);
  }

  addTracks(files: File[]) {
    for (const file of Array.from(files)) {
      this.addAudioUrl(URL.createObjectURL(file))
    }
  }
  
  async addAudioUrl(url: string) {
    if (url) {
      this.addTrack({
        id: Date.now().toString(),
        url,
        name: url
      });
    }
  }

  // Remove track
  async removeTrack(id: string) {
    this.tracks = this.tracks.filter(track => track.id !== id);
    await this.saveTracks();
  }

  // -------------------
  // Control methods

  playTrack(track: AudioTrack) {
    this.currentTrack = track;
    this.audio.src = track.url;
    this.audio.play();
  }

  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.volume = parseFloat(value);
    this.audio.volume = this.volume;
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  getVolume() {
    return this.volume;
  }

  // -------------------
  // Chrome storage methods

  private async saveTracks() {
    await this.storageService.saveData(TRACKS_KEY, this.tracks);
  }

  private async loadTracks() {
    this.tracks = (await this.storageService.getData<{ [key: string]: AudioTrack[] }>(TRACKS_KEY) || {})[TRACKS_KEY] || [];
  }

  ngOnInit() {
    this.loadTracks();
  }
}
