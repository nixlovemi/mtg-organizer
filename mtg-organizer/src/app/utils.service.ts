import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  webServicePath = '';
  appkey         = '';

  constructor(
    public alertCtr: AlertController,
  ) {
    this.webServicePath = 'http://crochepassoapasso.com.br/magic-app/';
    this.appkey         = '960b8735446c07f53e9b90d4202a4e0d';
  }

  getWsPath() {
    return this.webServicePath;
  }

  getAppKey() {
    return this.appkey;
  }

  async showAlert(header, subHeader, message, buttons) {
    const alert = await this.alertCtr.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,

    });
    return await alert.present();
  }

  getDateString() {
    var arrInfo =
    {
      monthNames: 'Janeiro, Fevereiro, Março, Abril, Maio, Junho, Julho, Agosto, Setembro, Outubro, Novembro, Dezembro',
      monthShortNames: 'Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez',
      dayNames: 'Domingo, Segunda-Feira, Terça-Feira, Quarta-Feira, Quinta-Feira, Sexta-Feira, Sábado',
      dayShortNames: 'Dom, Seg, Ter, Qua, Qui, Sex, Sáb'
    };

    return arrInfo;
  }

  /*
   * date: tem que ser no formato ISO String (new Date().toISOString())
   * 2019-05-24T19:29:44.645
  */
  formatDate(date, format = 'YYYY-MM-DD') {
    let strDate = '' + date.replace('Z', '');
    let ano = strDate.substr(0, 4);
    let mes = strDate.substr(5, 2);
    let dia = strDate.substr(8, 2);
    let hora = strDate.substr(11, 2);
    let minuto = strDate.substr(14, 2);
    let segundo = strDate.substr(17, 2);

    let strDateFmt = format.replace('YYYY', ano).replace('MM', mes).replace('DD', dia).replace('HH', hora).replace('MI', minuto).replace('SS', segundo);
    return strDateFmt;
  }

  /*
  * valor: valor desejado para a formatação
  * decimais: quantidade de casas decimais, por padrão será 2
  * simbolo: tipo de moeda, por padrão é vazia
  */
  formatMoney(valor, decimais = 2, simbolo = '') {
    if (isNaN(valor)) return '';
    else {
      let vValor = parseFloat(valor);
      let numero = vValor.toFixed(decimais).split('.');
      numero[0] = simbolo + numero[0].split(/(?=(?:...)*$)/).join('.');
      return numero.join(',');
    }
  }

  /*
  * Pega a data atual do dispositivo
  */
  getDateAtual() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  /*
  * Converte uma data do formato retornado pelo JS
  */
  converteData(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
}
