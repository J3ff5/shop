import React from "react";
import "./App.css";
import axios from "axios";
import {Product} from "./interface.ts";

const baseUrl = axios.create({
	baseURL:
		"https://app.landingpage.com.br/Ajax/buscarDetalhesProdutoNuvemshop/LPL2gc",
});

function App() {
	const splitedUrl = window.location.pathname.split("/");
	const productId = splitedUrl[splitedUrl.length - 1];

	const [product, setProduct] = React.useState({} as Product);
	const [values, setValues] = React.useState<string[]>([]);
	const [quantity, setQuantity] = React.useState(1 as number);

	const fetchProduct = React.useCallback(async () => {
		const { data } = await baseUrl.get(`/${productId}`);
		setProduct(data);
	}, [productId]);

	React.useEffect(() => {
		void fetchProduct();
	}, [fetchProduct]);

	const checkVariant = (variantValues: string[]) => variantValues.every((value, index) => {
		return value === values[index];
	});

	const buy = React.useCallback(async () => {
		const body = [{
			product_id: productId,
			quantity,
			variant_id: product.variants?.find((variant) => checkVariant(variant.values))?.id,
			values: values,
		}]

		const url = "https://app.landingpage.com.br/api/checkoutloja/LPL2gc/5d87eb644e5631bc6a03f1e43a804e1"
		const response = await axios.post(url, body);
		console.log(response);
	}, [checkVariant, product.variants, productId, quantity, values])

	const renderProduct = React.useMemo(() => {
		return (
			<>
				<span className="product_name">{product.title}</span>
				<div className="product_image_container">
					<img src={product.image_url} alt="product_image" className="product_image" loading="lazy" />
					<div className="product_image_variant_container">
						{
							product.variants?.map((variant, index) => {
								return (
									<div onClick={() => {
										setValues(variant.values);
									}} key={index}>
										<img src={variant.image_url} alt="product_image" className={`product_image_variant${checkVariant(variant.values) ? "_selected" : ""}`} loading="lazy" />
									</div>
								)
							})
						}
					</div>
					{
						product.options?.map((option, i) => {
							return (
								<div className="product_option_container" key={i}>
									<span className="product_option_name">{option}</span>
									<div className="product_option_values_container">
										{
											product.values[i].map((value, index) => {
												return (
													<div className="product_option_value_container" key={index}>
														<input type="checkbox" name={option} checked={value === values[i]} value={value} onChange={() => {
															setValues((prev) => {
																const newValues = [...prev];
																newValues[i] = value;
																return newValues;
															});
														}} />
														<span className="product_option_alue">{value}</span>
													</div>
												)
											})
										}
									</div>
								</div>
							)
						})
					}
					<div>
						<span className="product_quantity_name">Quantidade</span>
						<div className="product_quantity_container">
							<button className="product_quantity_button" onClick={() => {
								if (quantity > 1) {
									setQuantity((prev) => prev - 1);
								}
							}}>-</button>
							<span className="product_quantity">{quantity}</span>
							<button className="product_quantity_button" onClick={() => {
								setQuantity((prev) => prev + 1);
							}}>+</button>
						</div>
					</div>
				</div>
			</>
		)
	}, [product.image_url, product.options, product.title, product.values, product.variants, values, quantity]);

	return (
		<div className="App">
			<div className="product_container">
				{renderProduct}
				<button disabled={values.length === 0} className="product_button" onClick={() => {
					void buy();
				}}>Comprar</button>
			</div>
		</div>
	)
}

export default App;
