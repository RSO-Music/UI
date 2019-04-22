# vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Info

Frontend source code is inside ``./src`` folder.  Available front-end routes are inside ```./scr/router.js```. Main
router views and front-end structure are inside ``./src/views`` directory. Forms and other custom build reusable components
are inside  `./src/components/` directory.  API calls are defined
 inside `./src/utils/apiCalls.js` and inported where needed.

## Application storage

All data, that needs to be reactively shared between several components in application is stored in vue client-side storage called Vuex (https://vuex.vuejs.org/).

Vuex configuration and data scope can be found in [Vuex Store file](src/utils/store.js).

Data of the user that is currently logged in, can be accessed via Vuex getter:
```
this.$store.getters.currentUser
```

Data of the project that is currently being edited, can be accessed via Vuex getter:
```
this.$store.getters.editingProject
```

