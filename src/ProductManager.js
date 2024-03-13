const fs = require("fs");

class ProductManager {

    static id = 10;

    constructor() {

        this.products = [];
        this.path = "./src/products.json";

    }

    async init() {

        try {
            
            if(fs.existsSync(this.path)){

                const readProductsFromJSON = await fs.readFile(this.path, 'utf-8');
                this.products = JSON.parse(readProductsFromJSON);

                if (this.products.length > 0) {
                    const maxId = Math.max(...this.products.map(product => product.id));
                    ProductManager.id = maxId + 1;
                }

            } else {

                await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');

            }
        } catch (error){

            console.log("Error al iniciar ProductManager: ", error);

        }

    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        ProductManager.id++;

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
                id: ProductManager.id,
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

    async updateProduct(id, caracteristica, valor) {

        try {

            let colecciones = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            let productIndex = colecciones.findIndex((i)=> i.id == id);

            if (productIndex === -1) {

                return console.log(`Producto no encontrado ${id}`);

            }
    
            colecciones[productIndex][caracteristica] = valor;
            await fs.promises.writeFile(this.path, JSON.stringify(colecciones, null, 2));
            this.products = colecciones;
            console.log(`Producto ${id} editado`);

        } catch (error) {

            console.log('Error al actualizar el producto:', error.message);

        }
        
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

const producto = new ProductManager();


//producto.addProduct("Teclado", 'Logitech G413 Carbon', 55000, "https://d2r9epyceweg5n.cloudfront.net/stores/001/715/976/products/teclado-logitech1-a0d0f03734ef17c46216506377238422-1024-1024.jpg", "G413", 15);
//producto.addProduct("Microfono", 'HyperX Pulsefire Surge', 32000, "https://cellplay.com.ar/img/Public/producto-137331-0.jpg", "HX-PS", 15);


//producto.getProducts();
//producto.getProductById(4);
//producto.updateProduct(10, "title", "PC");
//producto.deleteProduct(12);



module.exports = ProductManager;