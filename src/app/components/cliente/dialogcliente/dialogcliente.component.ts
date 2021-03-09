import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-dialogcliente',
  templateUrl: './dialogcliente.component.html',
  styleUrls: ['./dialogcliente.component.css']
})
export class DialogclienteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogclienteComponent>,
              public clienteService: ClienteService,
              public snackBar: MatSnackBar) { }

  ngOnInit(): void {
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

  addCliente(form: NgForm){
    if(confirm('Estas seguro de enviar correo electronico a cliente y cambiar estado factura')){
       if( form.value.estado === 'Primer Recordatorio'){
      form.value.estado = 'Segundo Recordatorio';
      this.clienteService.putCliente(form.value).subscribe(
        res => console.log(res),
        err => console.error(err),
      );
      this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra en Segundo Recordatorio por favor cancelar ', 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.close();
      this.getClientes();

    } else if ( form.value.estado === 'Segundo Recordatorio'){
      form.value.estado = 'Usuario Desactivado';
      this.clienteService.putCliente(form.value).subscribe(
        res => console.log(res),
        err => console.error(err),
      );
      this.snackBar.open('Correo electronico enviado informando al usuario que sera Desactivada su cuenta por favor cancelar ', 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.close();
      this.getClientes();
    }
    else if ( form.value.estado === 'Usuario Desactivado' && form.value.pagada === 'False'){
      form.value.estado = 'Usuario Activo';
      form.value.pagada = 'True';
      this.clienteService.putCliente(form.value).subscribe(
        res => console.log(res),
        err => console.error(err),
      );
      this.snackBar.open('Correo electronico enviado informando al usuario que sera Activada su cuenta', 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.close();
      this.getClientes();
    }
    else if ( form.value.estado === 'Usuario Activo' && form.value.pagada === 'True'){
      form.value.estado = 'Primer Recordatorio';
      form.value.pagada = 'False';
      this.clienteService.putCliente(form.value).subscribe(
        res => console.log(res),
        err => console.error(err),
      );
      this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra Primer Recordatorio por favor cancelar ', 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.close();
      this.getClientes();
    }
    this.getClientes();
   }
 }

  close(){
    this.dialogRef.close();
  }

}
