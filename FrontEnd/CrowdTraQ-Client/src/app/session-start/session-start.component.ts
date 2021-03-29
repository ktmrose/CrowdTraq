import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-start',
  templateUrl: './session-start.component.html',
  styleUrls: ['./session-start.component.css']
})
export class SessionStartComponent implements OnInit {

  public roomCode = "";
  
  constructor() { }

  ngOnInit(): void {
  }

}
