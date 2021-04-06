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

  upload() {
    this.urlimagestorage=[];
    for (var index in this.FotoService.datafoto) {
    const imgfilepath = `storageimg/${this.FotoService.selectedphoto[index].filepath}`;
    this.afStorage.upload(imgfilepath, this.FotoService.selectedphoto[index].dataimage).then(() => {
      this.afStorage.storage.ref().child(imgfilepath).getDownloadURL().then((url) => { 
        this.urlimagestorage.unshift(url);
      });
    });
    }
  }

  selected(i) {
    this.FotoService.datafoto[i].statusfoto = true;
    this.FotoService.selectedphoto.unshift(this.FotoService.datafoto[i]);
  }
  
}

export interface photo {
  filepath : string; //sebagai folder/alamatnya
  webviewpath : string; //file name
  dataimage : File;
  statusfoto : boolean
}