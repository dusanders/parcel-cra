# parcel-cra
Simple CRA app template with Parcel - uses Parcel's setup guide for simple react-client typescript project

## Template for a REST api (Node + Express) and Parcel 'react-client' template as a front end

Project is structured as a mono-repo with `server`, `shared`, and `client` directories.

The `tsconfig.json` file in both `server` and `client` are setup to accept the `shared` folder as a core logic directory and should properly pull in types and source files during compilation.

```ascii
|--root
    |--template
        |-- client
        |-- serveer
        |-- shared
```

# Client

Directory containing the Parcel React project. ANT Design is used to provide easier styling and UI components.

# Server

Directory containing the Node + Express server project.

Server is structured as either standalone (`node main.js <config-file>`) OR as an importable module for other TS/JS files (exports `start(config)` and `stop()` methods).

### Configuration

The server is configured with the `config.json` file. This can be changed to read ENV vars if needed. Check the `IConfiguration` interface and how the `IServer` interface uses the configuration.

Provides SSL entries and basic Database entries.

### REST API

The server project comes with basic REST endpoints for user create and auth.

Middleware is typed with interfaces; check the `IMiddleware` and `IApiHandler` interfaces.

# Shared

Directory containing the models and definitions shared between backend and frontend.