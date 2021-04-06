import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

//const = variabel tetap dan tidak berubah isinya
const { camera, Filesystem, Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public selectedphoto : photo[] = [];
  public datafoto : photo[] = [];
  private keyfoto : string = "foto";
  private platform : Platform; //platform untuk mengenali dia dibuat dimana
  
  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async tambahfoto() {
    const foto = await Camera.getPhoto ({
      resultType : CameraResultType.Uri, //ambil uri dari kamera
      source : CameraSource.Camera,
      quality : 100
    });
    console.log(foto);

    //untuk menambahkan foto ke dalam data foto
    const filefoto = await this.simpanfoto(foto);
    
    this.datafoto.unshift(filefoto); //unshift utk memasukan foto paling ditaruh paling atas

    Storage.set({
      key : this.keyfoto,
      value : JSON.stringify(this.datafoto) //json.stringify = data diubah jadi bentuk json
    })
  }

  public async simpanfoto(foto : CameraPhoto) {
    const base64Data = await this.readAsBase64(foto);

    const namafile = new Date().getTime()+'.jpeg';
    const simpanfile = await Filesystem.writeFile({
      path : namafile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const datafoto = new File([blob], foto.path, {
      type : "image/jpeg"
    })

    if (this.platform.is('hybrid')) {
      return {
        filepath : simpanfile.uri, //identifikasi nama / url
        webviewpath : Capacitor.convertFileSrc(simpanfile.uri), //capacitor digunakan waktu utk mau convert ke android / buat camera
        dataimage : datafoto,
        statusfoto : false
      }
    } else {
      return {
        filepath  : namafile,
        webviewpath : foto.webPath,
        dataimage : datafoto,
        statusfoto : false
      }
    }
  }

  //biar bisa dipakai di android, dalam android harus base64
  private async readAsBase64(foto : CameraPhoto) {
    if(this.platform.is('hybrid')) { //untuk compile ke android / ios, biar bisa compatible
      const file = await Filesystem.readFile({ //kalau mau save di firebase storage pakai filesystem
        path : foto.path
      });
      return file.data;
    }
    else { //berbasis web
      const response = await fetch(foto.webPath); //fetch untuk ambil
      const blob = await response.blob(); //blob menyimpan data foto, dibutuhkan kalau mau bentuk datafoto
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    }; //() => {} itu lamda function, lebih singkat
  reader.readAsDataURL(blob);
  });

  public async loadfoto() {
    const listfoto = await Storage.get({ //storage.get artinya ambil data dari key, khusus storage sytax nya pakai :
      key : this.keyfoto
    });
    this.datafoto = JSON.parse(listfoto.value) || []; //JSON.parse dilakukan setelah getdata, di convert ke array/data

    if (!this.platform.is('hybrid')) {
      for (let foto of this.datafoto) {
        const readfile = await Filesystem.readFile({
          path : foto.filepath,
          directory : FilesystemDirectory.Data 
        });
        foto.webviewpath = `data:image/jpeg;base64, ${readfile.data}`; //${} buat mau konket, tiap pakai ${} kebanyakan pakai ``

        const response = await fetch(foto.webviewpath);
        const blob = await response.blob();

        //utk buat fotonya, nanti di upload ke firebase storage
        foto.dataimage = new File([blob], foto.filepath, {
          type: "image/jpeg"
        });
      }
    }

    console.log(this.datafoto);
  }
}

//cara menampilkan hasil foto ke web
//kalau gabung pakai export interface
export interface photo {
  filepath : string; //sebagai folder/alamatnya
  webviewpath : string; //file name
  dataimage : File;
  statusfoto : boolean
}
