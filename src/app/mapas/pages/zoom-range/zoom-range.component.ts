import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }

    .row{
      background-color: white;
      position:fixed;
      bottom:50px;
      left:50px;
      padding:10px;
      border-radius:25px;
      z-index:999;
      width:400px;
      label{
        margin:0;
      }
    }

    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  zoomLevel: number = 10;
  center: [number, number] = [ -73.16391967693966, -37.00614468853044];
 
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
 
  constructor() { 
  }

  // destruimos los listening
  ngOnDestroy(): void {

    this.mapa.off('zoom',() => {});
    this.mapa.off('zoomend',() => {});
    this.mapa.off('move',() => {});

  }

  // creamos la instancia del mapa y  los listening
  ngAfterViewInit(): void {
      this.mapa = new mapboxgl.Map({
        container: this.divMapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.center,
        zoom: this.zoomLevel
      });

      this.mapa.on('zoom', (ev) => {
        const zoomActual = this.mapa.getZoom();
        this.zoomLevel = zoomActual;
      })

      this.mapa.on('zoomend',(ev) => {
        if(this.mapa.getZoom() > 18){
          this.mapa.zoomTo(18);
        }
      })

      this.mapa.on('move',(ev)=>{
        console.log(ev);
        const target = ev.target;
        const { lng, lat } = target.getCenter();
        this.center = [ lng, lat ]
      })
  }

  // cambiarZoom(numero : number){
  //   this.zoomLevel = this.zoomLevel + numero;
  //   if(this.zoomLevel < 0){
  //     this.zoomLevel = 0;
  //   }
  //   if(this.zoomLevel > 22){
  //     this.zoomLevel = 22;
  //   }

  //   this.mapa.setZoom(this.zoomLevel);
  // }

  zoomCambio(valor: string){
    this.mapa.zoomTo( Number(valor) );
  }

  zoomIn(){
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }

  zoomOut(){
    this.mapa.zoomOut()
    this.zoomLevel = this.mapa.getZoom();
  }

}
