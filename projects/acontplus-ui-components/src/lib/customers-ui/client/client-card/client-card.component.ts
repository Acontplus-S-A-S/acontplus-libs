import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { ClientListDTO } from 'acontplus-core';
import { MatButtonModule } from '@angular/material/button';
import { MatThemeButtonComponent } from '../../../components';

@Component({
  selector: 'acp-client-card',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatButtonModule,
    MatThemeButtonComponent,
  ],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss',
})
export class ClientCardComponent {
  client = input.required<ClientListDTO>();

  getLogoSliceBusinessName = computed(() => {
    const name = this.client()?.customer.businessName || '';
    return name.slice(0, 1);
  });

  editClient = output<ClientListDTO>();
  deleteClient = output<ClientListDTO>();

  editClientClick(): void {
    const c = this.client();
    if (c) this.editClient.emit(c);
  }

  deleteClientClick(): void {
    const c = this.client();
    if (c) this.deleteClient.emit(c);
  }
}
