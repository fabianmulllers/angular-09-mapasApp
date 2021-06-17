import { HtmlParser } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }

    .list-group{
      position: fixed;
      top:20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer;
      color: #ffff
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  
  zoomLevel: number = 15;
  center: [number, number] = [ -73.16391967693966, -37.00614468853044];
 
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  marker1!: mapboxgl.Marker;

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola marcador';

    // this.marker1= new mapboxgl.Marker({// element: markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);

  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable:true, color: color
    })
    .setLngLat( [ -73.16874095850582,-37.006985273176745] )
    .addTo(this.mapa);

    this.marcadores.push( { color: color, marker: nuevoMarcador} );
    nuevoMarcador.on('dragend', (ev) =>{
      this.guardarMarcadoresLocalstorage();
    });
    // this.guardarMarcadoresLocalstorage();
  }

  irMarcador(marcador: mapboxgl.Marker){
    this.mapa.flyTo({
      center:marcador.getLngLat(),
      zoom:15,
      essential: true,
      // speed:0.2,
      // curve:1,
    })
  }

  guardarMarcadoresLocalstorage(){
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach((m) =>{
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })
    });

    localStorage.setItem( 'marcadores', JSON.stringify(lngLatArr) );
  }

  leerLocalStorage(){

    if(!localStorage.getItem('marcadores')){ return }

    const lngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')! );
    lngLatArr.forEach(marcador => {
      const newMarker = new mapboxgl.Marker({
        draggable:true, color: marcador.color
      })
      .setLngLat( marcador.centro! )
      .addTo(this.mapa);

      this.marcadores.push({ color: marcador.color, marker: newMarker })

      newMarker.on('dragend', (ev) =>{
        this.guardarMarcadoresLocalstorage();
      });

    });

  }

  borrarMarcador(indice: number){
    this.marcadores[indice].marker?.remove();
    this.marcadores.splice(indice,1);
    this.guardarMarcadoresLocalstorage();

  }

}
