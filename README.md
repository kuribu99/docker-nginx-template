# docker-nginx-template

This repository contains a template to automate the creation of reverse proxies on NGINX using handlebars templating engine.

## How it Works

1. Define all templates in `templates` folder that can be reused
2. Define all hosts in `src/hosts.json` file, each host will use the created template
3. Run `build.js` to generate respective sites
4. Build the Docker image
5. Run the Docker image

## Folder Structure

```md
root
|   config.json: stores configuration for `build.js`
|   build.js: build script that will generate all sites based on `hosts.json`
|   nginx.conf: NGINX root configuration
|
└───nginx: Contains all NGINX related configurations
|   |
|   └───conf.d: stores configuration files
|       |
|       └───ssl: stores SSL certificates
|
└───snippets: usesful configuration snippets
|
└───systemd: stores all services that should be launched in Docker image
|   |   nginx.service: default NGINX service
|
└───templates: stores all templates
|
└───src: stores all source code
|       |   hosts.json: JSON file that is used to generate sites
|
|
└───sites-enabled: stores all sites that are configured. *Do not add files here* - it should be managed by script
```

## JSON schema for hosts.json

`hosts.json` contains an `array`, in which each item is an JSON object with the fields:

- `serverName: name of the server. Will be injected to template. E.g. `www.localhost.com`
- `backendUrl: URL of the proxied server. Will be injected to template
- `template: name of the template used. Template must be present in `templates` folder
- `data`: JSON object to supply additional data used in template.

### Sample

```JSON
[
    {
        "serverName": "www.localhost.com",
        "backendUrl": "http://www.w.kd-krsko.si/",
        "template": "reverse-proxy-https",
        "data": {}
    }
]
```

## Commands

### Build Docker Image:  `npm run build`

 This command will build the Docker image. Before all, `prebuild` hook will run `build.js` and generate all sites from `hosts.json`. These sites are created in `nginx/sites-enabled` folder. These files will be copied into the Docker image.

### Run Docker Image: `npm start`

This command will run the Docker image

### Stop Docker Instance: `npm run stop`

This command will stop the running Docker instance

### Delete Docker Instance: `npm run rm`

This command will delete the instance

### Connect to the Docker Instance: `npm run bash`

This command will run `bash` in the current running Docker instance

### Rebuild and Restart: `npm run restart`

This command will:

- Remove current running image
- Recreate all the sites
- Rebuild the Docker image
- Run the Docker instance

## Helper Commands

### Generate self signed SSL:  `npm run generate-ssl`

This command will generate self-signed SSL certificate
