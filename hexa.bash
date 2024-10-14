/src
  ├── /users
  │     ├── /adapters
  │     │     ├── /http
  │     │     │     ├── user.controller.ts
  │     │     ├── /database
  │     │           └── user.repository.ts
  │     ├── /ports
  │     │     ├── /in
  │     │     │     └── user.service.interface.ts
  │     │     └── /out
  │     │           └── user.repository.interface.ts
  │     ├── /domain
  │     │     ├── /models
  │     │     │     └── user.model.ts
  │     │     ├── /services
  │     │     │     └── user.service.ts
  │     │     └── /dtos
  │     │           └── user.dto.ts
  ├── /posts
  │     ├── /adapters
  │     │     ├── /http
  │     │     │     ├── post.controller.ts
  │     │     ├── /database
  │     │           └── post.repository.ts
  │     ├── /ports
  │     │     ├── /in
  │     │     │     └── post.service.interface.ts
  │     │     └── /out
  │     │           └── post.repository.interface.ts
  │     ├── /domain
  │     │     ├── /models
  │     │     │     └── post.model.ts
  │     │     ├── /services
  │     │     │     └── post.service.ts
  │     │     └── /dtos
  │     │           └── post.dto.ts
  ├── /config
  │     ├── database.config.ts
  │     └── app.config.ts
  ├── /shared
  │     ├── /exceptions
  │     │     └── http.exception.ts
  │     ├── /interceptors
  │     │     └── logging.interceptor.ts
  │     └── /middlewares
  │           └── auth.middleware.ts
  └── main.ts
