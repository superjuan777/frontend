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
    var menp = " le informamos que el estado de su cuenta se encuentra en Primer Recordatorio por favor cancelar por valor de ";
    var mens = " le informamos que el estado de su cuenta se encuentra en Segundo Recordatorio por favor cancelar por valor de ";
    var mend = " le informamos que el estado de su cuenta se encuentra en mora y por consiguiente sera Desactivada por favor cancelar por valor de ";
    var mena = " le informamos que su cuenta sera Activada";

    var estado = form.value.estado;
    var pagada = form.value.pagada;

    if(confirm('Estas seguro de enviar correo electronico al cliente y cambiar estado factura')){
      if(estado === 'Primer Recordatorio'){
        form.value.estado = 'Segundo Recordatorio';
        form.value.mensaje = mens;
        this.clienteService.putCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err),
        );
        this.clienteService.createCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err)
        );
        this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra en Segundo Recordatorio por favor cancelar', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.getClientes();
        this.close();


      } else if (estado === 'Segundo Recordatorio'){
        form.value.estado = 'Usuario Desactivado';
        form.value.mensaje = mend;
        this.clienteService.putCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err),
        );
        this.clienteService.createCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err)
        );
        this.snackBar.open('Correo electronico enviado informando al usuario que sera Desactivada su cuenta por favor cancelar', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.getClientes();
        this.close();

      }
      else if (estado === 'Usuario Desactivado' && pagada === 'False'){
        form.value.estado = 'Usuario Activo';
        form.value.pagada = 'True';
        form.value.mensaje = mena;
        form.value.totalfactura = null;
        this.clienteService.putCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err),
        );
        this.clienteService.createCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err)
        );
        this.snackBar.open('Correo electronico enviado informando al usuario que sera Activada su cuenta', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.getClientes();
        this.close();

      }
      else if (estado === 'Usuario Activo' && pagada === 'True'){
        form.value.estado = 'Primer Recordatorio';
        form.value.pagada = 'False';
        form.value.mensaje = menp;
        form.value.totalfactura = '19.278';
        this.clienteService.putCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err),
        );
        this.clienteService.createCliente(form.value).subscribe(
          res => console.log(res),
          err => console.error(err)
        );
        this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra Primer Recordatorio por favor cancelar', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.getClientes();
        this.close();

      }
      this.getClientes();
    }
  }

  close(){
    this.dialogRef.close();
  }

}

