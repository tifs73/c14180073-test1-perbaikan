import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

export interface filefoto {
  name : string; //di isi filepath
  path : string //di isi webview path
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  urlimagestorage : string[] = [];

  ngOnInit() {
  }

  constructor(
    private afStorage : AngularFireStorage,
    public fotoservice : FotoService
  ) { }

  async ionViewDidEnter() {
    await this.fotoservice.loadfoto();
    this.tampilkandata();
  }

  tampilkandata() {
    this.urlimagestorage=[]; //kosongkan semua tampungan url
    var refimage = this.afStorage.storage.ref('storageimg');
    refimage.listAll()
    .then((res) => {
      res.items.forEach((itemref) => {
        itemref.getDownloadURL().then(url => {
          this.urlimagestorage.unshift(url);
        })
      });
    }).catch((error) => { //utk menampilkan error
      console.log(error);
    });    
  }
}
