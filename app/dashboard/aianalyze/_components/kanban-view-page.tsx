import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import ProductCard from './product-card';
import NewTaskDialog from './new-task-dialog';

export default function KanbanViewPage() {
  type cardData = {
    name: string;
    link: string;
    category: string;
    image: string;
  };

  const cardData1: cardData[] = [
    {
      name: 'Essential AntiHair Fall Kit',
      link: 'https://mamaearth.in/product/essential-anti-hair-fall-kit',
      category: 'Hair Kit',
      image:
        'https://images.mamaearth.in/catalog/product/1/_/1_white_bg_32.jpg?format=auto&height=600'
    },
    {
      name: 'Onion Shampoo and Oil Combo - 250ml + 250ml',
      link: 'https://mamaearth.in/product/onion-shampoo-oil-combo',
      category: 'Hair Kit',
      image:
        'https://images.mamaearth.in/catalog/product/o/n/onion_shampoo_and_oil_combo_250li_white_bg.jpg?format=auto&height=600'
    },
    {
      name: 'Vitamin C Foaming Face Wash with Vitamin C and Turmeric for Skin Illumination - 150ml',
      link: 'https://mamaearth.in/product/vitamin-c-foaming-face-wash-with-vitamin-c-turmeric-for-skin-illumination-150ml',
      category: 'Face Wash',
      image:
        'https://images.mamaearth.in/catalog/product/v/i/vitamin_c_foaming_face_wash_1.jpeg?format=auto&height=600'
    },
    {
      name: 'Ubtan Face Scrub with Turmeric and Walnut for Tan Removal - 100g',
      link: 'https://mamaearth.in/product/ubtan-scrub-for-face-with-turmeric-walnut-for-tan-removal-100g',
      category: 'Face Wash',
      image:
        'https://images.mamaearth.in/catalog/product/u/b/ubtan_face_scrub_1.jpg?format=auto&height=600'
    },
    {
      name: 'Aloe Vera Gel with Pure Aloe Vera & Vitamin E for Skin and Hair - 300 ml (Pack of 2)',
      link: 'https://mamaearth.in/product/aloe-vera-gel-with-pure-aloe-vera-vitamin-e-for-skin-and-hair-300-ml-pack-of-2',
      category: 'Body Kit',
      image:
        'https://images.mamaearth.in/catalog/product/a/l/aloe-vera-gel---pack-of-2_white_bg.jpg?format=auto&height=600'
    },
    {
      name: 'Vitamin C Face Mask With Vitamin C & Kaolin Clay for Skin Illumination',
      link: 'https://mamaearth.in/product/vitamin-c-face-mask-with-vitamin-c-kaolin-clay-for-skin-illumination-100-g',
      category: 'Face Mask',
      image:
        'https://images.mamaearth.in/catalog/product/v/i/vit_c_face_mask.jpg?format=auto&height=600'
    },
    {
      name: 'Onion Hair Oil for Hair Regrowth and Hair Fall Control - 250ml (Pack of 2)',
      link: 'https://mamaearth.in/product/onion-hair-oil-for-hair-regrowth-hair-fall-control-with-redensyl-250ml-pack-of-2',
      category: 'Hair Oil',
      image:
        'https://images.mamaearth.in/catalog/product/f/o/fop_white_bg_22.jpg?format=auto&height=600'
    },
    {
      name: 'Onion Shampoo for Hair Fall Control and Hair Growth with Onion & Plant Keratin - 650 ml',
      link: 'https://mamaearth.in/product/onion-shampoo-for-hair-fall-control-and-hair-growth-with-onion-plant-keratin-650-ml',
      category: 'Hair Shampoo',
      image:
        'https://images.mamaearth.in/catalog/product/w/h/white_bg.jpg?format=auto&height=600'
    }
  ];

  const arrayDataItems: any = cardData1.map((data) => {
    <ProductCard
      name={data.name}
      category={data.category}
      link={data.link}
      image={data.image}
    />;
  });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`AI Analyze`} description="See product score" />
          <NewTaskDialog />
        </div>
        <div className="grid grid-cols-3 space-x-8 space-y-8 p-12">
          {cardData1.map((data) => (
            <ProductCard
              key={data.name}
              name={data.name}
              category={data.category}
              link={data.link}
              image={data.image}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
