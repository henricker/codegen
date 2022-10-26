export default`
import ProductRepository from '../repository/productRepository'
import ProductService from '../service/productService'

export class ProductFactory {
    static getInstance() {
        const repository = new ProductRepository()
        return new ProductService({ repository: productRepository })
    }
}
`