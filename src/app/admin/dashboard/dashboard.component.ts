import { Component, OnInit } from '@angular/core';
import { DashboardService, IBot, IApi } from './dasboard.service';
import { AlertService } from '../../common/alert/alert.service';
import { AlertConfigModel } from 'src/app/common/alert/alert-config.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotModalComponent } from './bot-modal/bot-modal.component';
import { Router } from '@angular/router';
import { ApiCreateModalComponent } from './api-create-modal/api-create-modal.component';

type Tabs = 'bot' | 'api' | 'channel';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  public activeTab: Tabs = 'api';
  public botList: IBot[];
  public apiList: IApi[];
  public loading: boolean;

  ngOnInit(): void {
    this.getBotList();
    this.getApiList();
    this.addNewApi();
  }
  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router) {
  }

  public changeTab(tab: Tabs) {
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
  public viewBot(botId: number) {
    this.router.navigate(['/bot', botId]);
  }
  public editBot(botId: number) {
    this.router.navigate(['/edit', botId]);
  }
  public editApiDetails(api: IApi) {

  }
  public viewApi(api: IApi) {

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
            message: error.error,
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
            message: error.error,
          };
          this.alertService.configSubject.next(config);
        });
    }
  }

  private getBotList() {
    this.loading = true;
    this.dashboardService.getBotList().subscribe((res: IBot[]) => {
      this.botList = res;
    },
      (error) => {
        const config: AlertConfigModel = {
          type: 'danger',
          message: error.error,
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
          message: error.error,
        };
        this.alertService.configSubject.next(config);
      }).add(() => this.loading = false);
  }
}
