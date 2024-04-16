import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  imports: [
    NatsModule,
    // // Conectar con el microservice
    // ClientsModule.register([
    //   // Conexion al microservicio
    //   // con su ubicacion host y el puerto donde esta corriendo
    //   {
    //     name: NATS_SERVICE,
    //     transport: Transport.NATS,
    //     options: {
    //       servers: envs.natsServers
    //     }
    //   },

    // ]),
  ]
})
export class ProductsModule {}
