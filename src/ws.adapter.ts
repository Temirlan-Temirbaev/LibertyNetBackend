import { Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import * as socketio from "socket.io";

export class WsAdapter extends IoAdapter {
    private readonly logger = new Logger("WsAdapter");

    createIOServer(port: number, options?: socketio.ServerOptions & { namespace?: string; server?: any }): any {
        const server = super.createIOServer(port, options);

        server.use((socket, next) => {
            this.logger.log(`Client connected: ${socket.id}`);

            socket.on("disconnect", () => {
                this.logger.log(`Client disconnected: ${socket.id}`);
            });

            return next();
        });

        return server;
    }
}