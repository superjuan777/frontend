import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

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
    pagada: "",
    retencion: 0,
    subtotal: 0,
    totalfactura: 0,
  }

  clientes : Cliente[];

  constructor(private http: HttpClient) { }

  getClientes(){
    return this.http.get<Cliente[]>(this.URL_API);
  }

  putCliente(cliente: Cliente){
    return this.http.put(`${this.URL_API}/${cliente.Id}`, cliente);
  }

}
