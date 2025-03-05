import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {

  company = {
    name: 'Longbottom Transport',
    address: 'Quebec, QC, CA',
    founded: '03/2011',
    founder: 'Neville'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
