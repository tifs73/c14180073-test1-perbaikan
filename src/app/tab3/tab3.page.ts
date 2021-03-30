import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

export interface filefoto {
  name : string; //di isi filepath
  path : string //di isi webview path
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  urlimagestorage : string[] = [];
  namafile : string;

  ngOnInit() {
  }

  constructor(
    private afStorage : AngularFireStorage,
    public fotoservice : FotoService
  ) { }

  async ionViewDidEnter() {
    await this.fotoservice.loadfoto();
    this.tampilkandata();
    this.tampilkannama();
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

  tampilkannama() {
    for (var i = 0; i < this.fotoservice.datafoto.length; i++) {
      console.log(this.fotoservice.datafoto[i].filepath); //yang di console bener ce, tapi yang di html masih salah
      this.namafile = this.fotoservice.datafoto[i].filepath;
    }
  }
}
