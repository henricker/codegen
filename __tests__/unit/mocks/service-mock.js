
export default`
export default class ProductService {
    constructor({
        repository: productRepository
    }) {
        this.productRepository = productRepository
    }

    create(data) {
        return this.productRepository.create(data)
    }

    update(id, data) {
        return this.productRepository.update(id, data)
    }

    delete(id) {
        return this.productRepository.delete(id)
    }

    read(id) {
        return this.productRepository.read(id)
    }
}`