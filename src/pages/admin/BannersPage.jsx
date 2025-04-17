import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus, Loader2, Search, Pencil, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf } from 'lucide-react';

const INITIAL_FORM_DATA = {
  title: '',
  subtitle: '',
  image: null,
  ctaText: '',
  ctaLink: '',
  bgColor: '',
  titleColor: 'light', // Default color options
  subtitleColor: 'light',
  ctaColor: 'light',
  isActive: true,
};

// Define brand colors with Tailwind class mappings
const BRAND_COLORS = [
  { name: 'Eco Default', hex: '#25553d', tailwind: 'bg-eco' },
  { name: 'Eco Light', hex: '#A4C3A2', tailwind: 'bg-eco-light' },
  { name: 'Eco Accent', hex: '#4d93a6', tailwind: 'bg-eco-accent' },
  { name: 'Eco Dark', hex: '#1A2E1A', tailwind: 'bg-eco-dark' },
  { name: 'Eco Paper', hex: '#dfddd7', tailwind: 'bg-eco-paper' },
];

// Define available CTA links
const CTA_LINKS = [
  { value: '/about', label: 'About' },
  { value: '/custombags', label: 'Custom Bags' },
  { value: '/retail', label: 'Shop' },
  { value: '/distributor', label: 'Bulk Orders' },
  { value: '/blog', label: 'Blog' },
  { value: '/contact', label: 'Contact' },
];

// Maximum file size limit in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const BannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const { toast } = useToast();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Unable to load banners. Please try again later.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller image.');
      toast({ title: 'Warning', description: 'Image size exceeds 10MB limit. Please upload a smaller image.', variant: 'destructive' });
      setFormData(prev => ({ ...prev, image: null }));
    } else {
      setErrorMessage('');
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleColorChange = (tailwindClass) => {
    setFormData(prev => ({ ...prev, bgColor: tailwindClass }));
  };

  const handleCtaLinkChange = (value) => {
    setFormData(prev => ({ ...prev, ctaLink: value }));
  };

  const handleAddBanner = async () => {
    if (formData.image && formData.image.size > MAX_FILE_SIZE) {
      setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller image.');
      toast({ title: 'Warning', description: 'Image size exceeds 10MB limit. Please upload a smaller image.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(''); // Clear previous error
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const newBanner = await createBanner(data);
      setBanners(prev => [...prev, newBanner]);
      setOpenAddModal(false);
      setFormData(INITIAL_FORM_DATA);
      toast({ title: 'Success', description: 'Banner added successfully' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
      if (errorMsg.includes('File size too large')) {
        setErrorMessage('The uploaded image is too large. Please use an image smaller than 10MB.');
      } else {
        setErrorMessage('Failed to add the banner. Please try again later.');
      }
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      console.error('Add Banner Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = async () => {
    if (formData.image && formData.image.size > MAX_FILE_SIZE) {
      setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller image.');
      toast({ title: 'Warning', description: 'Image size exceeds 10MB limit. Please upload a smaller image.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(''); // Clear previous error
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const updatedBanner = await updateBanner(currentBanner.id, data);
      setBanners(prev => prev.map(b => (b.id === updatedBanner.id ? updatedBanner : b)));
      setOpenEditModal(false);
      setCurrentBanner(null);
      setFormData(INITIAL_FORM_DATA);
      toast({ title: 'Success', description: 'Banner updated successfully' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
      if (errorMsg.includes('File size too large')) {
        setErrorMessage('The uploaded image is too large. Please use an image smaller than 10MB.');
      } else {
        setErrorMessage('Failed to update the banner. Please try again later.');
      }
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      console.error('Edit Banner Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
      toast({ title: 'Success', description: 'Banner deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete the banner. Please try again later.', variant: 'destructive' });
    }
  };

  const openEditModalWithBanner = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: null,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      bgColor: banner.bgColor,
      titleColor: banner.titleColor || 'light', // Default to 'light' if not present
      subtitleColor: banner.subtitleColor || 'light',
      ctaColor: banner.ctaColor || 'light',
      isActive: banner.isActive,
    });
    setOpenEditModal(true);
  };

  const filteredBanners = banners.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBannerTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-eco-paper">
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Title</TableHead>
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">CTA Text</TableHead>
          <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Active</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredBanners.map(banner => (
          <TableRow key={banner.id} className="hover:bg-eco-light/20">
            <TableCell className="py-3 px-4 text-sm text-eco-dark">{banner.title}</TableCell>
            <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{banner.ctaText}</TableCell>
            <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{banner.isActive ? 'Yes' : 'No'}</TableCell>
            <TableCell className="py-3 px-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModalWithBanner(banner)}
                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteBanner(banner.id)}
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

  const renderFormField = (label, id, name, value, type = 'text') => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-eco-dark">{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        className="h-8 text-sm border-eco-light focus:ring-eco focus:border-eco"
      />
    </div>
  );

  const renderColorPicker = () => (
    <div className="space-y-1">
      <Label htmlFor="bgColor" className="text-sm text-eco-dark">Background Color</Label>
      <div className="flex gap-2 flex-wrap">
        {BRAND_COLORS.map(color => (
          <button
            key={color.tailwind}
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${formData.bgColor === color.tailwind ? 'border-eco-dark' : 'border-transparent'}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorChange(color.tailwind)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );

  const renderTextColorSelect = (label, name) => (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm text-eco-dark">{label} Color</Label>
      <Select
        value={formData[name]}
        onValueChange={(value) => handleSelectChange(name, value)}
      >
        <SelectTrigger id={name} className="h-8 text-sm border-eco-light focus:ring-eco focus:border-eco">
          <SelectValue placeholder="Select color style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light (e.g., White)</SelectItem>
          <SelectItem value="dark">Dark (e.g., Black)</SelectItem>
          <SelectItem value="gradient-white-to-eco">Gradient (White to Eco)</SelectItem>
          <SelectItem value="gradient-black-to-eco">Gradient (Black to Eco)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderCtaLinkSelect = () => (
    <div className="space-y-1">
      <Label htmlFor="ctaLink" className="text-sm text-eco-dark">CTA Link</Label>
      <Select
        value={formData.ctaLink}
        onValueChange={handleCtaLinkChange}
      >
        <SelectTrigger id="ctaLink" className="h-8 text-sm border-eco-light focus:ring-eco focus:border-eco">
          <SelectValue placeholder="Select a link" />
        </SelectTrigger>
        <SelectContent>
          {CTA_LINKS.map(link => (
            <SelectItem key={link.value} value={link.value}>
              {link.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Banner Management</h1>
            <p className="text-sm text-muted-foreground">Manage homepage banners</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search banners..."
                className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setOpenAddModal(true)} className="bg-eco text-white hover:bg-eco-dark h-8">
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
        ) : filteredBanners.length > 0 ? (
          <div className="rounded-md border border-eco-light overflow-x-auto">
            {renderBannerTable()}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No banners found</p>
        )}
      </CardContent>

      {/* Add Banner Modal */}
      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl w-full bg-eco-paper border-eco-light max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Add New Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-100 p-2 rounded">
                <AlertTriangle className="w-5 h-5" />
                {errorMessage}
              </div>
            )}
            {renderFormSection('Banner Details', (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {renderFormField('Title', 'title', 'title', formData.title)}
                  {renderTextColorSelect('Title', 'titleColor')}
                  {renderFormField('Subtitle', 'subtitle', 'subtitle', formData.subtitle)}
                  {renderTextColorSelect('Subtitle', 'subtitleColor')}
                </div>
                <div className="space-y-3">
                  {renderFormField('CTA Text', 'ctaText', 'ctaText', formData.ctaText)}
                  {renderTextColorSelect('CTA', 'ctaColor')}
                  {renderCtaLinkSelect()}
                  {renderColorPicker()}
                  <div className="space-y-1">
                    <Label htmlFor="image" className="text-sm text-eco-dark">Banner Image</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-8 text-sm border-eco-light"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive" className="text-sm text-eco-dark">Active</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:flex sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setOpenAddModal(false); setErrorMessage(''); }}
              disabled={isSubmitting}
              className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBanner}
              disabled={isSubmitting || (formData.image && formData.image.size > MAX_FILE_SIZE)}
              className="bg-eco text-white hover:bg-eco-dark text-sm h-8 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Modal */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl w-full bg-eco-paper border-eco-light max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Edit Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-100 p-2 rounded">
                <AlertTriangle className="w-5 h-5" />
                {errorMessage}
              </div>
            )}
            {renderFormSection('Banner Details', (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {renderFormField('Title', 'title', 'title', formData.title)}
                  {renderTextColorSelect('Title', 'titleColor')}
                  {renderFormField('Subtitle', 'subtitle', 'subtitle', formData.subtitle)}
                  {renderTextColorSelect('Subtitle', 'subtitleColor')}
                </div>
                <div className="space-y-3">
                  {renderFormField('CTA Text', 'ctaText', 'ctaText', formData.ctaText)}
                  {renderTextColorSelect('CTA', 'ctaColor')}
                  {renderCtaLinkSelect()}
                  {renderColorPicker()}
                  <div className="space-y-1">
                    <Label htmlFor="image" className="text-sm text-eco-dark">Banner Image (Leave empty to keep existing)</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-8 text-sm border-eco-light"
                    />
                    {currentBanner?.image && (
                      <img src={currentBanner.image} alt="Current banner" className="mt-2 w-32 h-32 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive" className="text-sm text-eco-dark">Active</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:flex sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setOpenEditModal(false); setErrorMessage(''); }}
              disabled={isSubmitting}
              className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditBanner}
              disabled={isSubmitting || (formData.image && formData.image.size > MAX_FILE_SIZE)}
              className="bg-eco text-white hover:bg-eco-dark text-sm h-8 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BannersPage;