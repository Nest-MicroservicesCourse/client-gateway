import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateProductDto } from 'src/common/dtos/update-product.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    // Inyeccion del microservicio, utilizando el token registrado para identificar cual de los micros
    // colocale como nombre productsClient al microservicio PRODUCT_SERVICE
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  };

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    // envia al microservicio el message pertinente a la consulta que quieres ejecutar y esperar
    // send para esperar respuesta, emit para enviar evento y no esperar
    return this.client.send({ cmd: 'find_all_products' }, {...paginationDto});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
    // try {
    //   // el primer argumento que regrese esto y sino catch 'rxjs'
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  };

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }
}
