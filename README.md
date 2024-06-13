1. **Test**
  - Para ejecutar pruebas ejecutamos: ng test acontplus-libs.
2. **Publicación:**
  - Ejecutamos el comando: npm run build-library.
  - Para usarlo localmente en otro projecto ejecutamos: npm run pack-lib.
3. **Usando la libreria local:**
  - Copiamos el archivo acontplus-utils-x.x.x.tgz al directorio dist del proyecto de frontend donde se vaya a usar.
  - Para instalarlo ejecutamos el comando:  npm install ./dist/acontplus-utils-0.0.1.tgz
4. **Subir a npm:**
  - Ejecutamos: npm login.
  - npm publish dist/acontplus-utils/acontplus-utils-x.x.x.tgz

