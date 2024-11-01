import Transport, { TransportStreamOptions } from "winston-transport";
import prisma from "@/db";

export class WinstonTransportPostgres extends Transport {
  constructor(opts: TransportStreamOptions) {
    super(opts);

    /*
     * Consume any custom options here. e.h:
     * Connection information for databases
     * Authentication information for APIs
     */
  }

  // this functions run when something is logged so here's where you can add you custom logic to do stuff when something is logged.
  async log(info: any, callback: any) {
    const splat = info[Symbol.for("splat")];
    var email: string = "";
    if (splat && splat[0]) {
      email = splat[0];
    }

    await prisma.log.create({
      data: {
        level: info.level,
        message: info.message,
        email: email!,
        label: info.label,
      },
    });

    // make sure you installed `@types/node` or this will give a typerror
    // this is the basic default behavior don't forget to add this.
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;
    // here you can add your custom logic, e.g. ingest data into database etc.

    // don't forget this one
    callback();
  }
}
