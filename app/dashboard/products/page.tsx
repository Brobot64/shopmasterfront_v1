"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Plus,
	Search,
	Eye,
	Edit,
	Trash2,
	MoreHorizontal,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ownerDashboardService, productsService } from "@/services";
import { useAuth } from "@/contexts/auth-context";

interface Product {
	id: string;
	name: string;
	category: string;
	price: string;
	quantity: number;
	status: string;
	skuNumber: string;
	description: string;
	createdAt: string;
	tags: string[];
	imageUrl: string;
	minPrice: string;
	reOrderPoint: number;
	outlet: {
		name: string;
	};
}

interface ProductsResponse {
	status: string;
	data: Product[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
}

export default function ProductsPage() {
	const { user } = useAuth();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const itemsPerPage = 10;
	const [selectedOutlet, setSelectedOutlet] = useState<string>("");
	const [outlets, setOutlets] = useState<any[]>([]);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		quantity: 0,
		category: "",
		tags: [] as string[],
		imageUrl: "",
		minPrice: 0,
		skuNumber: "",
		reOrderPoint: 0,
		status: "active",
	});

	const fetchProducts = async (page: number = 1) => {
		try {
			setLoading(true);
			const response: ProductsResponse = await productsService.getProducts({
				page,
				limit: itemsPerPage,
				search: searchTerm,
				category: categoryFilter !== "all" ? categoryFilter : undefined,
				status: statusFilter !== "all" ? statusFilter : undefined,
			});

			setProducts(response.data);
			setTotalPages(response.totalPages);
			setTotalItems(response.totalItems);
			setCurrentPage(response.currentPage);
		} catch (error) {
			console.error("Error fetching products:", error);
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	const getAllOutlets = async () => {
		try {
			const allOutlets = await ownerDashboardService.getAllOutletsByBiz(
				user.businessId
			);
			setOutlets(allOutlets.data);
		} catch (error) {
			console.error("Error fetching outlets:", error);
		}
	};

	const handleCreateProduct = async () => {
		try {
			if (!selectedOutlet) {
				alert("Please select an outlet");
				return;
			}

			const productData = {
				...formData,
				price: parseFloat(formData.price.toString()),
				minPrice: parseFloat(formData.minPrice.toString()),
				quantity: parseInt(formData.quantity.toString()),
				reOrderPoint: parseInt(formData.reOrderPoint.toString()),
			};

			await productsService.addProduct(productData, selectedOutlet);

			setIsCreateModalOpen(false);
			setFormData({
				name: "",
				description: "",
				price: 0,
				quantity: 0,
				category: "",
				tags: [],
				imageUrl: "",
				minPrice: 0,
				skuNumber: "",
				reOrderPoint: 0,
				status: "active",
			});
			setSelectedOutlet("");

			fetchProducts(currentPage);
		} catch (error) {
			console.error("Error creating product:", error);
			alert("Failed to create product");
		}
	};

	const handleDelete = async (product: Product) => {
		if (confirm(`Are you sure you want to delete ${product.name}?`)) {
			try {
				await productsService.deleteProduct(product.id);
				fetchProducts(currentPage);
			} catch (error) {
				console.error("Error deleting product:", error);
				alert("Failed to delete product");
			}
		}
	};

	const handleView = (product: Product) => {
		setSelectedProduct(product);
		setIsViewModalOpen(true);
	};

	const handleCloseViewModal = () => {
		setIsViewModalOpen(false);
		setSelectedProduct(null);
    window.location.reload();
	};

	useEffect(() => {
		getAllOutlets();
		fetchProducts(1);
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchProducts(1);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, categoryFilter, statusFilter]);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
			case "available":
				return <Badge className="bg-green-500">Available</Badge>;
			case "inactive":
				return <Badge variant="secondary">Inactive</Badge>;
			case "out_of_stock":
				return <Badge variant="destructive">Out of Stock</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const categories = Array.from(
		new Set(products.map((p) => p.category).filter(Boolean))
	);

	if (loading && products.length === 0) {
		return (
			<ProtectedRoute
				allowedUserTypes={["owner", "store_executive", "sales_rep"]}
			>
				<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
					<div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
					<div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="h-12 bg-gray-200 rounded animate-pulse"
							></div>
						))}
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute
			allowedUserTypes={["owner", "store_executive", "sales_rep"]}
		>
			<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Products</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Products</h1>
						<p className="text-muted-foreground">Manage your product catalog</p>
					</div>

					<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Product
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Add New Product</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid">
									<Select
										value={selectedOutlet}
										onValueChange={(value) => setSelectedOutlet(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select outlet" />
										</SelectTrigger>
										<SelectContent>
											{outlets.map((outlet) => (
												<SelectItem key={outlet.id} value={outlet.id}>
													{outlet.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="name">Product Name *</Label>
										<Input
											id="name"
											placeholder="Enter product name"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
										/>
									</div>
									<div>
										<Label htmlFor="skuNumber">SKU Number *</Label>
										<Input
											id="skuNumber"
											placeholder="Enter SKU number"
											value={formData.skuNumber}
											onChange={(e) =>
												setFormData({ ...formData, skuNumber: e.target.value })
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="category">Category *</Label>
										<Select
											value={formData.category}
											onValueChange={(value) =>
												setFormData({ ...formData, category: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="price">Price ($) *</Label>
										<Input
											id="price"
											type="number"
											placeholder="0.00"
											step="0.01"
											min="0"
											value={formData.price}
											onChange={(e) =>
												setFormData({
													...formData,
													price: parseFloat(e.target.value),
												})
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="minPrice">Minimum Price ($)</Label>
										<Input
											id="minPrice"
											type="number"
											placeholder="0.00"
											step="0.01"
											min="0"
											value={formData.minPrice}
											onChange={(e) =>
												setFormData({
													...formData,
													minPrice: parseFloat(e.target.value),
												})
											}
										/>
									</div>
									<div>
										<Label htmlFor="quantity">Stock Quantity *</Label>
										<Input
											id="quantity"
											type="number"
											placeholder="0"
											min="0"
											value={formData.quantity}
											onChange={(e) =>
												setFormData({
													...formData,
													quantity: parseInt(e.target.value),
												})
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="reOrderPoint">Re-order Point</Label>
										<Input
											id="reOrderPoint"
											type="number"
											placeholder="0"
											min="0"
											value={formData.reOrderPoint}
											onChange={(e) =>
												setFormData({
													...formData,
													reOrderPoint: parseInt(e.target.value),
												})
											}
										/>
									</div>
									<div>
										<Label htmlFor="status">Status</Label>
										<Select
											value={formData.status || "active"}
											onValueChange={(value) =>
												setFormData({ ...formData, status: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor="imageUrl">Image URL</Label>
									<Input
										id="imageUrl"
										placeholder="https://example.com/image.jpg"
										value={formData.imageUrl}
										onChange={(e) =>
											setFormData({ ...formData, imageUrl: e.target.value })
										}
									/>
								</div>

								<div>
									<Label htmlFor="tags">Tags (comma-separated)</Label>
									<Input
										id="tags"
										placeholder="headphones, noise cancelling, electronics"
										value={formData.tags ? formData.tags.join(", ") : ""}
										onChange={(e) =>
											setFormData({
												...formData,
												tags: e.target.value
													.split(",")
													.map((tag) => tag.trim())
													.filter((tag) => tag),
											})
										}
									/>
									<p className="text-xs text-muted-foreground mt-1">
										Separate tags with commas
									</p>
								</div>

								<div>
									<Label htmlFor="description">Description *</Label>
									<Textarea
										id="description"
										placeholder="Product description"
										rows={3}
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setIsCreateModalOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleCreateProduct}>Create Product</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search products by name or SKU..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-8"
									/>
								</div>
							</div>
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="available">Available</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
									<SelectItem value="out_of_stock">Out of Stock</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Stock</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Outlet</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="w-[100px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<div>
													<div className="font-medium">{product.name}</div>
													<div className="text-sm text-muted-foreground">
														{product.skuNumber}
													</div>
												</div>
											</TableCell>
											<TableCell>{product.category || "N/A"}</TableCell>
											<TableCell>
												${parseFloat(product.price).toFixed(2)}
											</TableCell>
											<TableCell>{product.quantity}</TableCell>
											<TableCell>{getStatusBadge(product.status)}</TableCell>
											<TableCell>{product.outlet?.name || "N/A"}</TableCell>
											<TableCell>
												{new Date(product.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => handleView(product)}
															className="cursor-pointer hover:bg-[#a09c9c1f]"
														>
															<Eye className="h-4 w-4 mr-2" />
															View
														</DropdownMenuItem>
														<DropdownMenuItem className="cursor-pointer hover:bg-[#a09c9c1f]">
															<Edit className="h-4 w-4 mr-2" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDelete(product)}
															className="text-red-600 cursor-pointer hover:bg-[#a09c9c1f]"
														>
															<Trash2 className="h-4 w-4 mr-2" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{products.length === 0 && !loading && (
							<div className="p-6 text-center text-muted-foreground">
								No products found
							</div>
						)}

						<div className="flex items-center justify-between px-6 py-4 border-t">
							<div className="text-sm text-muted-foreground">
								Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
								{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
								{totalItems} products
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => fetchProducts(currentPage - 1)}
									disabled={currentPage === 1}
								>
									<ChevronLeft className="h-4 w-4" />
									Previous
								</Button>
								<span className="text-sm">
									Page {currentPage} of {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => fetchProducts(currentPage + 1)}
									disabled={currentPage === totalPages}
								>
									Next
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModal}>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Product Details</DialogTitle>
						</DialogHeader>
						{selectedProduct && (
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Name</Label>
										<p className="text-sm font-semibold">
											{selectedProduct.name}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium">SKU</Label>
										<p className="text-sm">{selectedProduct.skuNumber}</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Category</Label>
										<p className="text-sm">
											{selectedProduct.category || "N/A"}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium">Price</Label>
										<p className="text-sm">
											${parseFloat(selectedProduct.price).toFixed(2)}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Min Price</Label>
										<p className="text-sm">
											${parseFloat(selectedProduct.minPrice || "0").toFixed(2)}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium">Stock</Label>
										<p className="text-sm">{selectedProduct.quantity}</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">
											Re-order Point
										</Label>
										<p className="text-sm">{selectedProduct.reOrderPoint}</p>
									</div>
									<div>
										<Label className="text-sm font-medium">Status</Label>
										<div className="mt-1">
											{getStatusBadge(selectedProduct.status)}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Outlet</Label>
										<p className="text-sm">
											{selectedProduct.outlet?.name || "N/A"}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium">Created Date</Label>
										<p className="text-sm">
											{new Date(selectedProduct.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								{selectedProduct.tags && selectedProduct.tags.length > 0 && (
									<div>
										<Label className="text-sm font-medium">Tags</Label>
										<div className="flex flex-wrap gap-1 mt-1">
											{selectedProduct.tags.map((tag, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="text-xs"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
								)}

								{selectedProduct.imageUrl && (
									<div>
										<Label className="text-sm font-medium">Image</Label>
										<div className="mt-2">
											<img
												src={selectedProduct.imageUrl}
												alt={selectedProduct.name}
												className="w-32 h-32 object-cover rounded-md"
												onError={(e) => {
													e.currentTarget.style.display = "none";
												}}
											/>
										</div>
									</div>
								)}

								<div>
									<Label className="text-sm font-medium">Description</Label>
									<p className="text-sm text-muted-foreground mt-1">
										{selectedProduct.description || "No description provided"}
									</p>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</ProtectedRoute>
	);
}
