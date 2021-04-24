import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { NgForm} from '@angular/forms'
import { Cliente } from 'src/app/models/cliente';
import { DialogclienteComponent } from './dialogcliente/dialogcliente.component';
import {MatDialog} from '@angular/material/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit, OnDestroy {


  suscription: Subscription;

  constructor(public clienteService: ClienteService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getClientes();

    this.suscription = this.clienteService.refresh$.subscribe(() => {
      this.getClientes();
    })
  }

  ngOnDestroy() {
    this.suscription.unsubscribe();
  }


  getClientes(){
      this.clienteService.getClientes().subscribe(
        res => {
          console.log(res);
          this.clienteService.clientes = res;
        },
        err => console.error(err)
      );
  }

  editCliente(cliente: Cliente){
    this.openAdd();
    this.clienteService.selectedCliente = cliente;
  }


  openAdd(){
    const dialogRef = this.dialog.open(DialogclienteComponent, {
      height: '89%',
      width: '65%'
    });
    this.getClientes();
  }

}
