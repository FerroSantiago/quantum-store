This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

  ☺ Abrir proyecto:
  	npm run web --open
  
  ☺ Levantar entorno dev local:
  	ngrok http 3000 (reemplazar la nueva URL en .env)
  
  ☺ Actualizar el esquema de prisma:
  	Remove-Item -Recurse -Force node_modules, .prisma, package-lock.json(elimina prisma con el esquema viejo)
  	npm install(reinstala prisma normalmente con el esquema nuevo)
  	npx prisma generate(por si no se genero el nuevo esquema)
  	npx prisma db push(sincroniza prisma con los modulos)
   
