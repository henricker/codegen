export default`
import ProductRepository from '../repository/productRepository'
import ProductService from '../service/productService'

export default class ProductFactory {
    static getInstance() {
        const productRepository = new ProductRepository()
        return new ProductService({ repository: productRepository })
    }
}
`