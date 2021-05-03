import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-dialogcliente',
  templateUrl: './dialogcliente.component.html',
  styleUrls: ['./dialogcliente.component.css']
})


export class DialogclienteComponent implements OnInit, OnDestroy {



   activado = true;

   suscription: Subscription;

   constructor(public dialogRef: MatDialogRef<DialogclienteComponent>,
              public clienteService: ClienteService,
              public snackBar: MatSnackBar) {  }

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


   pago(form: NgForm){
    if(confirm('Estas seguro que la factura esta pagada')){
     form.value.fechapago = new Date();
     form.value.estado = 'Usuario Activo';
     form.value.pagada = true;
     form.value.mensaje = " le informamos que su cuenta fue Activada"
     form.value.totalfactura = 0;
     form.value.iva = 0;
     form.value.subtotal = 0;
       this.clienteService.putCliente(form.value).subscribe(res => {
         if(res["Exito"] == 1){
           this.snackBar.open('Correo electronico enviado usuario informando que su cuenta sera activada', 'Cerrar', {
             duration: 10000,
             horizontalPosition: 'center',
             verticalPosition: 'top'
           });
           this.close();
          } else {
            this.snackBar.open('Sin conexion a internet verifica y vuelve a enviar correo', 'Cerrar', {
             panelClass: ["success-dialog"],
             duration: 10000,
             horizontalPosition: 'center',
             verticalPosition: 'top',
          });
          this.close();
         }
       }
     );
    }
   }


    async addCliente(form: NgForm){
    const cero = 0;
    const cien = 100;

      if(form.value.pagada === true){
        this.activado = false;
      } else {
        this.activado = true;
      }

    var menp = " le informamos que el estado de su cuenta se encuentra en Primer Recordatorio por favor cancelar por valor de ";
    var mens = " le informamos que el estado de su cuenta se encuentra en Segundo Recordatorio por favor cancelar por valor de ";
    var mend = " le informamos que el estado de su cuenta se encuentra en mora y por consiguiente sera Desactivada por favor cancelar por valor de ";

    var estado = form.value.estado;
    var pagada = form.value.pagada;
    var por = form.value.por;


    var iva = 0;
    var sub = 0;
    var tot = 0;


    if(form.value.totalfactura === 0 || form.value.totalfactura === null){
      this.snackBar.open('El valor de total de la factura debe ser mayor que cero para enviar correo', 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } else {
      if(confirm('Estas seguro de enviar correo electronico al cliente y cambiar estado factura')){
        if(estado === 'Primer Recordatorio'){
          form.value.estado = 'Segundo Recordatorio';
          form.value.mensaje = mens;
          this.clienteService.putCliente(form.value).subscribe(res => {
               if(res["Exito"] == 1){
                 this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra en Segundo Recordatorio por favor cancelar', 'Cerrar', {
                   duration: 10000,
                   horizontalPosition: 'center',
                   verticalPosition: 'top'
                 });
                 this.close();
               } else {
                 this.snackBar.open('Sin conexion a internet verifica y vuelve a enviar correo', 'Cerrar', {
                  panelClass: ["success-dialog"],
                  duration: 10000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
                this.close();
              }
            }
          );
        } else if (estado === 'Segundo Recordatorio'){
            form.value.estado = 'Usuario Desactivado';
            form.value.mensaje = mend;
             this.clienteService.putCliente(form.value).subscribe(res => {
              if(res["Exito"] == 1){
                this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta sera Desactivada por favor cancelar', 'Cerrar', {
                  duration: 10000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                });
                this.close();
              } else {
                this.snackBar.open('Sin conexion a internet verifica y vuelve a enviar correo', 'Cerrar', {
                  panelClass: ["success-dialog"],
                  duration: 10000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
                this.close();
               }
            }
         );
        } else if (estado === 'Usuario Desactivado' && pagada == false){
          this.pago(form);
        } else if (estado === 'Usuario Activo' && pagada == true){
          form.value.estado = 'Primer Recordatorio';
          form.value.pagada = false;
          form.value.mensaje = menp;
          tot = form.value.totalfactura;
          iva = (tot * por)/cien;
          sub = tot - iva;
          tot = iva + sub;
          if(tot === 0){
            tot = 19550;
          }
          form.value.totalfactura = tot;
          form.value.iva = iva;
          form.value.subtotal = sub;
          this.clienteService.putCliente(form.value).subscribe(res => {
            if(res["Exito"] == 1){
              this.snackBar.open('Correo electronico enviado usuario informando el estado de su cuenta se encuentra en Primer Recordatorio por favor cancelar', 'Cerrar', {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.close();
            } else {
              this.snackBar.open('Sin conexion a internet verifica y vuelve a enviar correo', 'Cerrar', {
               panelClass: ["success-dialog"],
               duration: 10000,
               horizontalPosition: 'center',
               verticalPosition: 'top',
             });
             this.close();
           }
         }
        );
       }
      }
    }


   }
   close(){
    this.dialogRef.close();
    this.getClientes();
   }


}
