import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IBot, IApi } from '../../dashboard/dasboard.service';

@Component({
  selector: 'api-modal',
  styleUrls: ['./api-modal.component.scss'],
  templateUrl: './api-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ApiModalComponent {
  @Input() apiData;
  submitAttempt: boolean;
  tempNextNodeId: string;
  nextNodeValid: boolean;
  quillConfig = {
    toolbar: {
      container: [
        ['italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
      ],
    },
  }
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  invalidNode: boolean;
  selectedApi: IApi;
  apiList: IApi[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(){
    if(!this.apiData){
      this.apiData = {
        name: null,
        content: null,
      }
    }
  }
  public onSaveNode(){

  }
  public onNextNodeSelect(node): void {
    this.tempNextNodeId = node.name;
  }

  public isNextNodeValid(isValid: boolean): void {
    this.nextNodeValid = isValid;
  }
  
  search: OperatorFunction<string, readonly IApi[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.invalidNode = false;
        return (term === '' ? this.apiList
          : this.apiList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)
      })
    );
  };

  public formatter = (result: IBot) => result.name;

  // public onUpdateValue(event) {
  //   this.onNextNodeSelect.emit(event.item);
  // }

  public checkValidity(nodename: string): void {
    if (nodename && nodename !== '') {
      const nodeIndex = this.apiList.findIndex(v => v.name === nodename);
      if (nodeIndex === -1) this.invalidNode = true;
      else this.invalidNode = false;
      // this.isNextNodeValid.emit(!this.invalidNode);
    }
  }
}