import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  urlimagestorage : photo[] = [];
  constructor(private afStorage : AngularFireStorage,
    public FotoService:FotoService) {}

  async ngOnInit() {
    await this.FotoService.loadfoto();
  }

  tambahfoto() {
    this.FotoService.tambahfoto();
  }

  upload(i) {
    this.urlimagestorage=[];
    const imgfilepath = `storageimg/${this.FotoService.datafoto[i].filepath}`;
    this.afStorage.upload(imgfilepath, this.FotoService.datafoto[i].dataimage).then(() => {
      this.afStorage.storage.ref().child(imgfilepath).getDownloadURL().then((url) => { 
        var dtphoto = {filepath:url.toString()}
        this.urlimagestorage.unshift(dtphoto);
      });
    });
  }
  
}

export interface photo {
  filepath : string; //sebagai folder/alamatnya
}
