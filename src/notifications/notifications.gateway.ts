import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ path: '/notifications' })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  broadcast(payload: any) {
    const msg = JSON.stringify(payload);
    this.server?.clients?.forEach((client: any) => {
      if (client.readyState === 1) client.send(msg);
    });
  }
}
