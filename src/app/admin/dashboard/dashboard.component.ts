import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService, IBot, IApi } from './dasboard.service';
import { AlertService } from '../../common/alert/alert.service';
import { AlertConfigModel } from 'src/app/common/alert/alert-config.model';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { BotModalComponent } from './bot-modal/bot-modal.component';
import { Router } from '@angular/router';
import { ApiCreateModalComponent } from './api-create-modal/api-create-modal.component';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

type Tabs = 'bot' | 'api' | 'channel';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  public activeTab: Tabs = 'bot';
  public botList: IBot[];
  public apiList: IApi[];
  public loading: boolean;

  // channel
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  invalidNode: boolean;
  whatsappNumber: string;

  ngOnInit(): void {
    this.getBotList();
  }
  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router) {
  }

  public changeTab(tab: Tabs) {
    switch (tab) {
      case 'bot':
        this.getBotList();
        break;
      case 'api':
        this.getApiList();
        break;
      case 'channel':
        this.getChannelDetails();
      default:
        break;
    }
    this.activeTab = tab;
  }

  public addNewBot() {
    const modalRef = this.modalService.open(BotModalComponent, { backdrop: 'static', size: 'md' });
    modalRef.closed.subscribe(res => {
      if (res !== 'close') this.botList.push(res);
    });
  }
  public addNewApi() {
    const modalRef = this.modalService.open(ApiCreateModalComponent, { backdrop: 'static', size: 'xl' });
    modalRef.closed.subscribe(res => {
      if (res !== 'close') this.apiList.push(res);
    });
  }
  public editBotDetails(bot: IBot) {
    const modalRef = this.modalService.open(BotModalComponent, { backdrop: 'static', size: 'md' });
    modalRef.componentInstance.botDetails = bot;
    modalRef.closed.subscribe(res => {
      if (res !== 'close') {
        bot.name = res.name;
        bot.description = res.description;
        bot.image = res.image;
      }
    });
  }
  public viewBot(botId: number, botName: string) {
    this.router.navigate(['/bot', botId], { queryParams: { name: botName, view: true } });
  }
  public editBot(botId: number, botName: string) {
    this.router.navigate(['/edit', botId], { queryParams: { name: botName } });
  }
  public editApiDetails(api: IApi) {
    const modalRef = this.modalService.open(ApiCreateModalComponent, { backdrop: 'static', size: 'xl' });
    modalRef.componentInstance.apiDetails = api;
    modalRef.closed.subscribe(res => {
      if (res !== 'close') {
        api = res;
      }
    });
  }

  public deleteApi(apiId: number) {
    if (confirm("Are you sure you want to delete this api?")) {
      this.dashboardService.deleteApi(apiId).subscribe(res => {
        const apiIndex = this.apiList.findIndex(v => v.id === apiId);
        this.apiList.splice(apiIndex, 1);
        const config: AlertConfigModel = {
          type: 'success',
          message: "Api deleted successfully"
        };
        this.alertService.configSubject.next(config);
      },
        (error) => {
          const config: AlertConfigModel = {
            type: 'danger',
            message: error.message,
          };
          this.alertService.configSubject.next(config);
        });
    }
  }
  public deleteBot(botId: number) {
    if (confirm("Are you sure you want to delete this bot?")) {
      this.dashboardService.deleteBot(botId).subscribe(res => {
        const botIndex = this.botList.findIndex(v => v.id === botId);
        this.botList.splice(botIndex, 1);
        const config: AlertConfigModel = {
          type: 'success',
          message: "Bot deleted successfully"
        };
        this.alertService.configSubject.next(config);
      },
        (error) => {
          const config: AlertConfigModel = {
            type: 'danger',
            message: error.message,
          };
          this.alertService.configSubject.next(config);
        });
    }
  }

  // channel methods
  search: OperatorFunction<string, readonly IBot[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.invalidNode = false;
        return (term === '' ? this.botList
          : this.botList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)
      })
    );
  };

  public formatter = (result: IBot) => result.name;

  // public onUpdateValue(event) {
  //   this.onNextNodeSelect.emit(event.item);
  // }

  public checkValidity(nodename: string): void {
    if (nodename && nodename !== '') {
      const nodeIndex = this.botList.findIndex(v => v.name === nodename);
      if (nodeIndex === -1) this.invalidNode = true;
      else this.invalidNode = false;
      // this.isNextNodeValid.emit(!this.invalidNode);
    }
  }
  // end channel methods

  private getBotList() {
    this.loading = true;
    this.dashboardService.getBotList().subscribe((res: IBot[]) => {
      this.botList = res;
    },
      (error) => {
        console.log(error);
        const config: AlertConfigModel = {
          type: 'danger',
          message: error.message,
        };
        this.alertService.configSubject.next(config);
      }).add(() => this.loading = false);
  }

  private getApiList() {
    this.loading = true;
    this.dashboardService.getApiList().subscribe((res: IApi[]) => {
      this.apiList = res;
    },
      (error) => {
        const config: AlertConfigModel = {
          type: 'danger',
          message: error.message,
        };
        this.alertService.configSubject.next(config);
      }).add(() => this.loading = false);
  }

  private getChannelDetails() {

  }
}
