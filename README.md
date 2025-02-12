This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Desarrollo en dev

	1.Levantar entorno dev local:
  		ngrok http 3000 (reemplazar la nueva URL en .env)

	2.Reemplazar la direccion que abre ngrok en la variable del .env de NEXTAUTH_URL

	3.Abrir proyecto:
		npm run web --open
  
## Actualizar el esquema de prisma:
	npx prisma generate(por si no se genero el nuevo esquema)
	npx prisma db push(sincroniza prisma con los modulos)
