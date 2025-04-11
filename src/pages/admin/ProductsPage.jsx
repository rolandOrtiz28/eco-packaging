import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { ArrowUp, ArrowDown, Trash2, Plus, Loader2, Search, Pencil } from 'lucide-react';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  price: '',
  bulkPrice: '',
  moq: '',
  pcsPerCase: '',
  category: '',
  tags: '',
  featured: false,
  inStock: true,
  details: {
    size: '',
    color: '',
    material: '',
    pricing: [{ case: '', pricePerUnit: '' }],
    useCase: '',
    note: '',
  },
  images: [],
  existingImages: [],
  mainImageIndex: 0,
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        showToast('Error', 'Failed to fetch products', 'destructive');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (title, description, variant = 'default') => {
    toast({ title, description, variant });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('details.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));
    } else if (name.includes('pricing')) {
      const [_, index, field] = name.split('.');
      const newPricing = [...formData.details.pricing];
      newPricing[index] = { ...newPricing[index], [field]: value };
      setFormData(prev => ({ ...prev, details: { ...prev.details, pricing: newPricing } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name) => (checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const addPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, pricing: [...prev.details.pricing, { case: ` (${prev.pcsPerCase}pcs)`, pricePerUnit: '' }] },
    }));
  };

  const removePricingTier = (index) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, pricing: prev.details.pricing.filter((_, i) => i !== index) },
    }));
  };

  const handleAddProduct = async () => {
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'details') data.append('details', JSON.stringify(formData.details));
      else if (key === 'images') formData.images.forEach(file => data.append('images', file));
      else if (key !== 'existingImages' && key !== 'mainImageIndex') data.append(key, formData[key]);
    });
    try {
      const newProduct = await createProduct(data);
      setProducts(prev => [...prev, newProduct]);
      setOpenAddModal(false);
      setFormData(INITIAL_FORM_DATA);
      showToast('Success', 'Product added successfully');
    } catch (error) {
      showToast('Error', 'Failed to add product', 'destructive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'details') data.append('details', JSON.stringify(formData.details));
      else if (key === 'images') formData.images.forEach(file => data.append('images', file));
      else if (key === 'existingImages') data.append('existingImages', JSON.stringify(formData.existingImages));
      else if (key !== 'mainImageIndex') data.append(key, formData[key]);
    });
    data.append('mainImageIndex', formData.mainImageIndex);
    try {
      const updatedProduct = await updateProduct(currentProduct.id, data);
      setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
      setOpenEditModal(false);
      setCurrentProduct(null);
      setFormData(INITIAL_FORM_DATA);
      showToast('Success', 'Product updated successfully');
    } catch (error) {
      showToast('Error', 'Failed to update product', 'destructive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Success', 'Product deleted successfully');
    } catch (error) {
      showToast('Error', 'Failed to delete product', 'destructive');
    }
  };

  const openEditModalWithProduct = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      bulkPrice: product.bulkPrice,
      moq: product.moq,
      pcsPerCase: product.pcsPerCase,
      category: product.category,
      tags: product.tags.join(','),
      featured: product.featured,
      inStock: product.inStock,
      details: product.details,
      images: [],
      existingImages: product.images || [],
      mainImageIndex: product.images ? product.images.indexOf(product.image) : 0,
    });
    setOpenEditModal(true);
  };

  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setOpenAddModal(true);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = formData.existingImages.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      existingImages: newExistingImages,
      mainImageIndex: prev.mainImageIndex === index ? 0 : prev.mainImageIndex > index ? prev.mainImageIndex - 1 : prev.mainImageIndex,
    }));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    const newExistingImages = [...formData.existingImages];
    [newExistingImages[index - 1], newExistingImages[index]] = [newExistingImages[index], newExistingImages[index - 1]];
    setFormData(prev => ({
      ...prev,
      existingImages: newExistingImages,
      mainImageIndex: prev.mainImageIndex === index ? index - 1 : prev.mainImageIndex === index - 1 ? index : prev.mainImageIndex,
    }));
  };

  const moveImageDown = (index) => {
    if (index === formData.existingImages.length - 1) return;
    const newExistingImages = [...formData.existingImages];
    [newExistingImages[index], newExistingImages[index + 1]] = [newExistingImages[index + 1], newExistingImages[index]];
    setFormData(prev => ({
      ...prev,
      existingImages: newExistingImages,
      mainImageIndex: prev.mainImageIndex === index ? index + 1 : prev.mainImageIndex === index + 1 ? index : prev.mainImageIndex,
    }));
  };

  const setMainImage = (index) => {
    setFormData(prev => ({ ...prev, mainImageIndex: index }));
  };

  const renderProductTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-eco-paper">
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Name</TableHead>
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Category</TableHead>
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Price</TableHead>
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">In Stock</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProducts.map(product => (
          <TableRow key={product.id} className="hover:bg-eco-light/20">
            <TableCell className="py-3 px-4 text-sm text-eco-dark">{product.name}</TableCell>
            <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{product.category}</TableCell>
            <TableCell className="py-3 px-4 hidden md:table-cell text-sm">${product.price.toFixed(2)}</TableCell>
            <TableCell className="py-3 px-4 hidden md:table-cell text-sm">
              {product.inStock ? 'Yes' : 'No'}
            </TableCell>
            <TableCell className="py-3 px-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModalWithProduct(product)}
                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderFormSection = (title, children) => (
    <div className="space-y-2">
      <h3 className="text-base font-heading text-eco-dark">{title}</h3>
      <div className="space-y-3 p-3 bg-eco-paper rounded-md border border-eco-light">
        {children}
      </div>
    </div>
  );

  const renderFormField = (label, id, name, value, type = 'text', extraProps = {}) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-eco-dark">{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        className="h-8 text-sm border-eco-light focus:ring-eco focus:border-eco"
        {...extraProps}
      />
    </div>
  );

  const renderCheckboxField = (label, id, name, checked) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={handleCheckboxChange(name)}
      />
      <Label htmlFor={id} className="text-sm text-eco-dark">{label}</Label>
    </div>
  );

  const renderPricingTiers = () => (
    <div className="space-y-2">
      <Label className="text-sm text-eco-dark">Pricing Tiers</Label>
      {formData.details.pricing.map((tier, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Case (e.g., 1 to 5)"
            name={`pricing.${index}.case`}
            value={tier.case}
            onChange={handleInputChange}
            className="flex-1 h-8 text-sm border-eco-light"
          />
          <Input
            placeholder="Price per Unit"
            name={`pricing.${index}.pricePerUnit`}
            value={tier.pricePerUnit}
            onChange={handleInputChange}
            className="flex-1 h-8 text-sm border-eco-light"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePricingTier(index)}
            className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addPricingTier}
        className="w-full h-8 text-sm border-eco text-eco-dark hover:bg-eco-light"
      >
        <Plus size={16} className="mr-1" />
        Add Pricing Tier
      </Button>
    </div>
  );

  const renderImageManagement = () => (
    <div className="space-y-2">
      <Label className="text-sm text-eco-dark">Current Images</Label>
      {formData.existingImages.length > 0 ? (
        <div className="space-y-2">
          {formData.existingImages.map((imageUrl, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-eco-light rounded">
              <img src={imageUrl} alt={`Product ${index + 1}`} className="w-12 h-12 object-cover rounded border-eco-light" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{imageUrl}</p>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveImageUp(index)}
                    disabled={index === 0}
                    className="text-eco-dark hover:text-eco p-1"
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveImageDown(index)}
                    disabled={index === formData.existingImages.length - 1}
                    className="text-eco-dark hover:text-eco p-1"
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    variant={formData.mainImageIndex === index ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMainImage(index)}
                    className={formData.mainImageIndex === index ? 'bg-eco text-white h-8 text-sm' : 'text-eco-dark hover:text-eco h-8 text-sm'}
                  >
                    {formData.mainImageIndex === index ? 'Main' : 'Set Main'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExistingImage(index)}
                    className="text-eco-dark hover:text-eco p-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No images available.</p>
      )}
      <div className="pt-2">
        <Label htmlFor="images" className="text-sm text-eco-dark">Upload New Images</Label>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          onChange={handleFileChange}
          className="h-8 text-sm border-eco-light"
        />
      </div>
    </div>
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenAddModal} className="bg-eco text-white hover:bg-eco-dark h-8">
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-eco" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="rounded-md border border-eco-light overflow-x-auto">
            {renderProductTable()}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No products found</p>
        )}
      </CardContent>

      {/* Add Product Modal */}
      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
        <DialogContent className="sm:max-w-4xl w-[90%] bg-eco-paper border-eco-light max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {renderFormSection('Basic Information', (
                  <>
                    {renderFormField('Name', 'name', 'name', formData.name)}
                    {renderFormField('Description', 'description', 'description', formData.description)}
                    {renderFormField('Price', 'price', 'price', formData.price, 'number')}
                    {renderFormField('Bulk Price', 'bulkPrice', 'bulkPrice', formData.bulkPrice, 'number')}
                  </>
                ))}
              </div>
              <div className="space-y-3">
                {renderFormSection('Inventory', (
                  <>
                    {renderFormField('MOQ', 'moq', 'moq', formData.moq, 'number')}
                    {renderFormField('Pieces per Case', 'pcsPerCase', 'pcsPerCase', formData.pcsPerCase, 'number')}
                    {renderFormField('Category', 'category', 'category', formData.category)}
                    {renderFormField('Tags (comma-separated)', 'tags', 'tags', formData.tags)}
                    {renderCheckboxField('In Stock', 'inStock', 'inStock', formData.inStock)}
                  </>
                ))}
              </div>
            </div>
            {renderFormSection('Product Details', (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderFormField('Size', 'details.size', 'details.size', formData.details.size)}
                {renderFormField('Color', 'details.color', 'details.color', formData.details.color)}
                {renderFormField('Material', 'details.material', 'details.material', formData.details.material)}
                {renderFormField('Use Case', 'details.useCase', 'details.useCase', formData.details.useCase)}
                {renderFormField('Note', 'details.note', 'details.note', formData.details.note)}
              </div>
            ))}
            {renderFormSection('Pricing Structure', renderPricingTiers())}
            {renderFormSection('Images', (
              <>
                <Label htmlFor="images" className="text-sm text-eco-dark">Upload Images</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="h-8 text-sm border-eco-light"
                />
              </>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAddModal(false)}
              disabled={isSubmitting}
              className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={isSubmitting}
              className="bg-eco text-white hover:bg-eco-dark text-sm h-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-4xl w-[90%] bg-eco-paper border-eco-light max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {renderFormSection('Basic Information', (
                  <>
                    {renderFormField('Name', 'name', 'name', formData.name)}
                    {renderFormField('Description', 'description', 'description', formData.description)}
                    {renderFormField('Price', 'price', 'price', formData.price, 'number')}
                    {renderFormField('Bulk Price', 'bulkPrice', 'bulkPrice', formData.bulkPrice, 'number')}
                  </>
                ))}
              </div>
              <div className="space-y-3">
                {renderFormSection('Inventory', (
                  <>
                    {renderFormField('MOQ', 'moq', 'moq', formData.moq, 'number')}
                    {renderFormField('Pieces per Case', 'pcsPerCase', 'pcsPerCase', formData.pcsPerCase, 'number')}
                    {renderFormField('Category', 'category', 'category', formData.category)}
                    {renderFormField('Tags (comma-separated)', 'tags', 'tags', formData.tags)}
                    {renderCheckboxField('In Stock', 'inStock', 'inStock', formData.inStock)}
                  </>
                ))}
              </div>
            </div>
            {renderFormSection('Product Details', (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderFormField('Size', 'details.size', 'details.size', formData.details.size)}
                {renderFormField('Color', 'details.color', 'details.color', formData.details.color)}
                {renderFormField('Material', 'details.material', 'details.material', formData.details.material)}
                {renderFormField('Use Case', 'details.useCase', 'details.useCase', formData.details.useCase)}
                {renderFormField('Note', 'details.note', 'details.note', formData.details.note)}
              </div>
            ))}
            {renderFormSection('Pricing Structure', renderPricingTiers())}
            {renderFormSection('Images', renderImageManagement())}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditModal(false)}
              disabled={isSubmitting}
              className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              disabled={isSubmitting}
              className="bg-eco text-white hover:bg-eco-dark text-sm h-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductsPage;