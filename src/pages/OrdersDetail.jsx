import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function OrdersDetail() {
    const { id } = useParams()
    const productId = Number(id.replace(/\D/g, ""))
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)

    // useEffect 
    useEffect(() => {
        axios
            .get(`https://dummyjson.com/products/${productId}`)
            .then((response) => {
                if (response.status !== 200) {
                    setError(response.message)
                    return
                }
                setProduct(response.data)
            })
            .catch((err) => {
                setError(err.message)
            })
    }, [productId])

    if (error) return <div className="text-red-600 p-4">{error}</div>
    if (!product) return <div className="p-4">Loading...</div>

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
            <img
                src={product.thumbnail}
                alt={product.title}
                className="rounded-xl mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-1">Kategori: {product.category}</p>
            <p className="text-gray-600 mb-1">Brand: {product.brand}</p>
            <p className="text-gray-800 font-semibold text-lg">
                Harga: Rp {product.price * 1000}
            </p>
        </div>
    )
}
