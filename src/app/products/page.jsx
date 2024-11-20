import { conexion } from "@/Libs/mysql"
import ProductCards from "../components/ProductCards"


async function loadproducts() {
    const products = await conexion.query('SELECT * FROM product')
    
    return products
}

export const dynamic = 'force-dynamic';

async function ProductsPage() {
    const products = await loadproducts()
    return<div className='grid gap-4 grid-cols-3'>
            {products.map(product => (
                <ProductCards product={product} key={product.id}/>
            ))}
        </div>

}

export default ProductsPage