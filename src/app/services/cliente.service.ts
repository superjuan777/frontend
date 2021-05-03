import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Cliente } from '../models/cliente';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private _refresh$ = new Subject<void>();

  URL_API = 'https://localhost:44313/books'


  selectedCliente: Cliente = {
    ciudad: "",
    cliente: "",
    codigofactura: 0,
    estado: "",
    fechacreacion: 0,
    fechapago: 0,
    iva: 0,
    nit: 0,
    pagada: true,
    retencion: 0,
    subtotal: 0,
    totalfactura: 0,
    email: "",
    mensaje: "",
    por: 0,
    Exito: 0,
  }

  clientes : Cliente[];

  constructor(private http: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  getClientes(){
    return this.http.get<Cliente[]>(this.URL_API);
  }

  putCliente(cliente: Cliente){
    return this.http.put(`${this.URL_API}/${cliente.Id}`, cliente)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
      )
  }
}
