# Avalie Aqui API

Api para o sitema Avalie Aqui.

Para visualizar a documentação da API, acesse o [Swagger](#swagger).

## Usuários padrão

Esses usuários são criados automaticamente ao rodar os [seeders](#rodar-seeders):

- Usuário: `usuario@avalieaqui.com`
- Administrador: `admin@avalieaqui.com`

Senha de ambos: `avalieaqui123`

## Informações/comandos para o desenvolvimento

_Execute os comandos desejados a seguir neste diretório_

### Para Docker:

#### Iniciar container com o servidor e o banco de dados

```
docker-compose up
```

- Para rodar em background, adicione a flag `-d`

- Para rebuildar a imagem, adicione a flag `--build`
  - Será necessário rebuildar a imagem (caso já tenha sido buildada) sempre que houver alterações no projeto

#### Parar container

```
docker-compose down
```

---

### Para execução local:

#### Conficurar ambiente

- Renomear o arquivo `.env.example` para `.env`
- Editar `DATABASE_URL` com o endereço do seu banco de dados PostgreSQL local

#### Instalar dependências

```
npm install
```

#### Rodar migrations

```
npx prisma migrate dev
```

- Será necessário rodar as migrations sempre que houver alterações `schema.prisma`
- Este comando já ira gerar o Prisma Client com as alterações
  - Para gerar o Prisma Client manualmente, execute `npx prisma generate`

#### Rodar seeders

```
npm run seed
```

- Este comando irá popular o banco de dados com dados aleatórios

#### Iniciar servidor de desenvolvimento

```
npm run start:dev
```

- Este comando irá iniciar o servidor em modo de desenvolvimento, na porta `4000` local
- O servidor irá reiniciar automaticamente a cada alteração nos arquivos

#### Prisma Studio

O Prisma Studio é uma ferramenta de visualização de dados do banco de dados. Para iniciar o Prisma Studio, execute o comando abaixo e acesse o endereço `http://localhost:5555` no navegador.

```
npx prisma studio
```

#### Swagger

O Swagger é uma ferramenta de visualização de rotas, parâmetros e exemplos da API. Para iniciar o Swagger, inicie o servidor e acesse o endereço `http://localhost:4000/api` no navegador.
