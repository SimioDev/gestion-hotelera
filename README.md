# Gestión Hotelera - Sistema de Administración de Cadenas Hoteleras

## ¿Qué es este proyecto?

Este proyecto es un sistema de gestión hotelera que permite a los usuarios (propietarios de cadenas hoteleras) registrarse, iniciar sesión, gestionar su perfil y administrar hoteles asociados a su cadena. La idea principal es que un usuario pueda crear una cuenta, definir el nombre de su cadena hotelera, y luego agregar, visualizar o eliminar hoteles. Todo esto se hace a través de una interfaz web que también es accesible desde dispositivos móviles.

El sistema está dividido en dos partes principales: un **backend** que maneja la lógica, la base de datos y las APIs, y un **frontend** que ofrece una interfaz de usuario para interactuar con el sistema. El objetivo es que sea una herramienta sencilla pero funcional para gestionar cadenas hoteleras, con la posibilidad de expandirla en el futuro (por ejemplo, agregando reservas, estadísticas, etc.).

## ¿Para qué sirve?

Este sistema sirve para:

- **Registro e inicio de sesión:** Los usuarios pueden crear una cuenta con su email y contraseña, e iniciar sesión de forma segura usando un sistema de autenticación basado en JWT (JSON Web Tokens).
- **Gestión de perfil:** Una vez autenticado, el usuario puede ver su email y actualizar el nombre de su cadena hotelera.
- **Administración de hoteles:** Los usuarios pueden agregar hoteles (con detalles como nombre, dirección, etc.), ver la lista de hoteles asociados a su cadena, y eliminarlos si es necesario.
- **Acceso móvil:** La interfaz está diseñada para ser responsive, lo que significa que se puede usar desde un teléfono o tablet sin problemas, siempre que el dispositivo esté en la misma red que el servidor.

Es ideal para pequeños propietarios de cadenas hoteleras que quieran llevar un control básico de sus hoteles, o como base para un sistema más grande.

## ¿Con qué está hecho? (Stack tecnológico)

El proyecto está construido con tecnologías modernas y populares, lo que lo hace fácil de mantener y escalar. Aquí está el stack tecnológico:

### Backend
- **NestJS:** Un framework de Node.js para construir aplicaciones backend robustas y escalables. Lo usamos porque tiene una estructura modular y soporte nativo para TypeScript, lo que facilita organizar el código.
- **TypeORM:** Un ORM (Object-Relational Mapping) que usamos para interactuar con la base de datos. Nos permite definir entidades (como `User` y `Hotel`) y manejar las operaciones de base de datos de forma sencilla.
- **PostgreSQL:** La base de datos relacional que almacena toda la información (usuarios, hoteles, etc.). Es confiable y soporta relaciones complejas, lo que es útil para este tipo de sistema.
- **JWT (JSON Web Tokens):** Para la autenticación. Cuando un usuario inicia sesión, el backend genera un token que se usa para verificar su identidad en cada solicitud protegida.
- **Docker:** Usamos Docker para gestionar los servicios (backend y base de datos) de forma consistente. Esto asegura que el entorno de desarrollo sea igual en cualquier máquina.

### Frontend
- **Next.js:** Un framework de React que usamos para construir la interfaz web. Next.js es genial porque soporta renderizado del lado del servidor (SSR) y del lado del cliente (CSR), lo que hace que la app sea rápida y SEO-friendly.
- **React:** La librería principal para construir los componentes de la interfaz. Usamos hooks como `useState` y `useEffect` para manejar el estado y los efectos secundarios.
- **Axios:** Para hacer solicitudes HTTP al backend (por ejemplo, para iniciar sesión, obtener el perfil del usuario, etc.).
- **SweetAlert2:** Una librería para mostrar alertas y notificaciones bonitas (por ejemplo, "Éxito al actualizar el nombre de la cadena").
- **Tailwind CSS (opcional):** Si decides usarlo, es una librería de estilos que facilita hacer la interfaz responsive con clases utilitarias. Si no, puedes usar CSS puro con media queries.

### Otros
- **pnpm:** El manejador de paquetes que usamos en lugar de npm o Yarn. Es más rápido y eficiente con el espacio en disco.
- **Docker Compose:** Para orquestar los contenedores del backend y la base de datos.

## Requisitos para correr el proyecto

Antes de empezar, necesitas tener instalado lo siguiente en tu máquina:

- **Node.js** (versión 18 o superior): Para correr el backend y el frontend.
- **Docker** y **Docker Compose**: Para manejar el backend y la base de datos.
- **pnpm**: Puedes instalarlo con `npm install -g pnpm`.
- Un navegador web para probar la app.
