export class AlertConfigModel {
  public type: string; // OPTIONS: success, warning, error, badge-alert, notify-alert(provide cutom class along with it)
  public message: string;
  public customClass?: string; // OPTIONS: custom-example-class
}