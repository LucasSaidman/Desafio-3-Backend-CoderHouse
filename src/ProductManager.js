//En mi caso fue necesario instalar "npm install prompt-sync" en la consola para que funcione correctamente por que la consola me decia el siguiente error: "Cannot find module 'prompt-sync'"

const fs = require("fs");

//! Solución compartida por un compañero, encontrada en "https://www.codecademy.com/article/getting-user-input-in-node-js".
const prompt = require('prompt-sync')();

class ProductManager {

    static id = 0;

    constructor() {

        this.products = [];
        this.path = "./src/products.json";

    }

    async init() {

        try {
            
            if(fs.existsSync(this.path)){

                const readProductctsFromJSON = await fs.readFile(this.path, 'utf-8');
                this.products = JSON.parse(readProductctsFromJSON);

            } else {

                await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');

            }
        } catch (error){

            console.log("Error al iniciar ProductManager: ", error);

        }

    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        //Leo el archivo JSON
        const readProductsJSON = await fs.promises.readFile(this.path, 'utf-8');

        if(readProductsJSON) {

            this.products = JSON.parse(readProductsJSON);

        }

        const codeValidation = productCode => productCode.code === code;

        if (this.products.some(codeValidation)) {

            return console.log('El producto ya existe');

        } else if (!title || title.trim() === '' || !description || description.trim() === '' || price === null || price === undefined || price === '' || !code || code.trim() === '' || stock === null || stock === undefined || stock === '') {

            return console.log('Todos los campos son obligatorios');

        } else {

            const newProduct = {
                id: ProductManager.id++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock

            };

            this.products.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));

            return ProductManager.id;

        }

    }

    async getProducts() {

        try {

            const readProductsJSON = await fs.promises.readFile(this.path, "utf-8");

            if (readProductsJSON.length > 0) {

                this.products = JSON.parse(readProductsJSON);
                console.log(this.products);
                return this.products;
                
            } else {

                console.log("No se encontro nada en el archivo JSON");
                return [];

            }

        } catch (error) {

            console.log("getProduct no pudo leer el archivo JSON: ", error.message);

        }

    }

    async getProductById(id){

        try {

            const readProductsJSON = await fs.promises.readFile(this.path, "utf-8");

            if( !readProductsJSON || readProductsJSON.trim() === "") {

                console.log("JSON esta vacio");
                return "JSON esta vacio";

            }

            this.products = JSON.parse(readProductsJSON);

            const productoEncontrado = this.products.find(product => product.id == id);

            if(productoEncontrado) {

                console.log(productoEncontrado);
                return productoEncontrado;

            } else {

                console.log("No encontrado");
                return "No encontrado";

            }

        } catch (error) {

            console.log("getProductById no pudo leer el archivo JSON: ", error.message)

        }

    }

    async updateProduct(id) {

        const updateProduct = await this.getProductById(id);
        console.log("Producto entontrado: ", updateProduct);

        console.log('Menu Update: ', '\n',
              "1 - Titulo", '\n',
              "2 - Descripción", '\n',
              "3 - Precio", '\n',
              "4 - Imagen", '\n',
              "5 - Codigo", '\n',
              "6 - Stock", '\n'
        )

        const option = parseInt(prompt('Ingrese una option: '));

        switch (option) {

            case 1:
               updateProduct.title = prompt('Ingrese el nuevo titulo: ');
               break;
            case 2:
                updateProduct.description = prompt('Ingrese nueva descripción: ');
                break;
            case 3:
                updateProduct.price = parseInt(prompt('Ingrese nuevo precio: '));
                break;
            case 4:
                updateProduct.thumbnail = prompt('Ingrese nueva ruta de imagen: ');
                break;
            case 5:
                updateProduct.code = prompt('Ingrese nuevo código: ');
                break;
            case 6:
                updateProduct.stock = parseInt(prompt('Ingrese nuevo stock: '));
                break;
            default:
                console.log(`Opción no valida ${option}. Saliendo del programa...`)
                return 'Opción no valida';

        }

        console.log('Producto actualizado: ', updateProduct);
        this.products = await this.getProducts();

        function replaceObjectById(array, IdObject, newObject) {
            let index = array.findIndex(object => object.id === IdObject);
            if(index !== -1) {
                array[index] = newObject;
                return array;
            }
         }

        replaceObjectById(this.products, id, updateProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));

        console.log('Nuevo Array ', this.products);

    }

    async deleteProduct(id) {

        const readProductsJSON = await fs.promises.readFile(this.path, 'utf-8');

        if (readProductsJSON.length > 0) {

            this.products = JSON.parse(readProductsJSON);

        } else {

            console.log("JSON file is empty");
            return [];

        }

        function deleteProduct(array, idProduct) {

            return array.filter(object => object.id !== idProduct);

        }

        this.products = deleteProduct(this.products, id);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        console.log('Array sin producto ', this.products);

    }

}



//const producto = new ProductManager();


//producto.addProduct("Procesador", 'R7 5700X', 350, "https://www.fullh4rd.com.ar/img/productos/1/micro-amd-ryzen-7-5700x-svideo-scooler-0.jpg", "R7-5", 20);
//producto.addProduct("RTX 4090", ''RTX 4090 Asus Rog Strix', 250, "https://spacegamer.com.ar/img/Public/1058/55986-producto-1.jpg", "RTX4090-A", 10);
//producto.addProduct("Monitor", 'Aorus CV27F', 7500, "https://cdn.mos.cms.futurecdn.net/WZhmwyBrt6LtrBzCdeyBuG.jpg", "CV27F", 5);
//producto.addProduct("Notebook", 'Acer Predator Helios 300', 11500, "https://i.ytimg.com/vi/GC-xa9pl6Ao/maxresdefault.jpg", "APH300", 3);


//producto.getProducts();
//producto.getProductById(4);
//producto.updateProduct(2);
//producto.deleteProduct(0);



module.exports = ProductManager;