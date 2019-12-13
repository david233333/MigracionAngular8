import {Component, OnInit} from '@angular/core';

import {menuItems} from './menu-items';
import {NbMenuService} from '@nebular/theme';

@Component({
  selector: 'sura-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public menu = menuItems;

  constructor(menu: NbMenuService) {
    menu.onItemClick().subscribe(event => {
      console.log(event.item.title);
    });
  }

  ngOnInit() {
  }
}
