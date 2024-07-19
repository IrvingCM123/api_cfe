import { Test, TestingModule } from '@nestjs/testing';
import { CuentasService } from './cuentas.service';
import { Repository } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estado } from 'src/common/enums/cuentas.enum';
import { Errores_Cuentas, Exito_Cuentas } from 'src/common/helpers/cuentas.helpers';
import * as bcrypt from 'bcrypt';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

describe('CuentasService', () => {
  let service: CuentasService;
  let cuentaRepository: Repository<Cuenta>;
  let transaccionService: TransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentasService,
        {
          provide: getRepositoryToken(Cuenta),
          useClass: Repository,
        },
        {
          provide: TransaccionService,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CuentasService>(CuentasService);
    cuentaRepository = module.get<Repository<Cuenta>>(getRepositoryToken(Cuenta));
    transaccionService = module.get<TransaccionService>(TransaccionService);
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const usuario = new Usuario()
      usuario.id_Usuario = 1
      usuario.usuario_Nombre = 'boby dev'
      usuario.usuario_Apellidos = "el prots"
      usuario.usuario_Edad = 12

      const createCuentaDto: CreateCuentaDto = {
        cuenta_Identificador: 'test@example.com',
        cuenta_Contraseña: 'password',
        id_Usuario: usuario,
      };
      const cuenta = new Cuenta();
      jest.spyOn(cuentaRepository, 'create').mockReturnValue(cuenta);
      jest.spyOn(cuentaRepository, 'save').mockResolvedValue(cuenta);

      expect(await service.create(createCuentaDto)).toEqual(cuenta);
      expect(cuentaRepository.create).toHaveBeenCalledWith(createCuentaDto);
      expect(cuentaRepository.save).toHaveBeenCalledWith(cuenta);
    });
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      const cuentas = [new Cuenta(), new Cuenta()];
      jest.spyOn(cuentaRepository, 'find').mockResolvedValue(cuentas);

      expect(await service.findAll()).toEqual(cuentas);
      expect(cuentaRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return an account by email', async () => {
      const cuenta = new Cuenta();
      cuenta.id_Cuenta = 1;
      cuenta.cuenta_Identificador = 'test@example.com';
      cuenta.cuenta_Contraseña = 'password';
      cuenta.cuenta_Estado_Cuenta = Estado.ACTIVO;
      cuenta.cuenta_Rol = 'user';
      cuenta.id_Usuario = { id_Usuario: 1, usuario_Nombre: 'Test', usuario_Apellidos: 'User', usuario_Edad: 18 };
      jest.spyOn(cuentaRepository, 'findOne').mockResolvedValue(cuenta);

      expect(await service.findOneByEmail('test@example.com')).toEqual({
        cuenta: {
          cuenta_ID: 1,
          cuenta_Identificador: 'test@example.com',
          cuenta_Contraseña: 'password',
          cuenta_Estado_Cuenta: Estado.ACTIVO,
          cuenta_Rol: 'user',
        },
        usuario: {
          usuario_ID: 1,
          usuario_Nombre: 'Test',
          usuario_Apellidos: 'User',
        },
      });
      expect(cuentaRepository.findOne).toHaveBeenCalledWith({ where: { cuenta_Identificador: 'test@example.com' } });
    });

    it('should return false if account not found', async () => {
      jest.spyOn(cuentaRepository, 'findOne').mockResolvedValue(null);

      expect(await service.findOneByEmail('notfound@example.com')).toBe(false);
      expect(cuentaRepository.findOne).toHaveBeenCalledWith({ where: { cuenta_Identificador: 'notfound@example.com' } });
    });
  });


  describe('actualizarContraseña', () => {
    it('should update password successfully', async () => {
      const cuenta = new Cuenta();
      cuenta.id_Cuenta = 1;
      cuenta.cuenta_Identificador = 'test@example.com';
      cuenta.cuenta_Codigo_Recuperacion = await bcrypt.hash('123456', 10);

      jest.spyOn(cuentaRepository, 'findOne').mockResolvedValue(cuenta);
      jest.spyOn(transaccionService, 'transaction').mockResolvedValue('Éxito');

      const result = await service.actualizarContraseña('test@example.com', 'newpassword', 123456);

      expect(result).toEqual({
        status: 201,
        message: Exito_Cuentas.CONTRASEÑA_ACTUALIZADA,
      });
      expect(cuentaRepository.findOne).toHaveBeenCalledWith({ where: { cuenta_Identificador: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', cuenta.cuenta_Codigo_Recuperacion);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(transaccionService.transaction).toHaveBeenCalledWith(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, 'newhashedpassword', 'cuenta_Contraseña', 1);
    });

    it('should return error if account not found', async () => {
      jest.spyOn(cuentaRepository, 'findOne').mockResolvedValue(null);

      const result = await service.actualizarContraseña('notfound@example.com', 'newpassword', 123456);

      expect(result).toEqual({
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND,
      });
      expect(cuentaRepository.findOne).toHaveBeenCalledWith({ where: { cuenta_Identificador: 'notfound@example.com' } });
    });

    it('should return error if activation code is invalid', async () => {
      const cuenta = new Cuenta();
      cuenta.id_Cuenta = 1;
      cuenta.cuenta_Identificador = 'test@example.com';
      cuenta.cuenta_Codigo_Recuperacion = await bcrypt.hash('123456', 10);

      jest.spyOn(cuentaRepository, 'findOne').mockResolvedValue(cuenta);

      const result = await service.actualizarContraseña('test@example.com', 'newpassword', 123456);

      expect(result).toEqual({
        status: 400,
        message: Errores_Cuentas.NUMERO_ACTIVACION_NO_VALIDO,
      });
      expect(cuentaRepository.findOne).toHaveBeenCalledWith({ where: { cuenta_Identificador: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', cuenta.cuenta_Codigo_Recuperacion);
    });
  });

});