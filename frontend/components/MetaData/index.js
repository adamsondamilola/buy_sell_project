// MetaPage.js
export const metadata = {
    title: 'Custom Page Title',
    description: 'This is a custom page description.',
    openGraph: {
      title: 'Custom Page Title',
      description: 'This is a custom page description.',
      images: [
        {
          url: '/meta-image.jpg', // Replace with your actual image path
          width: 1200,
          height: 630,
          alt: 'A descriptive alt text for the image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Custom Page Title',
      description: 'This is a custom page description.',
      images: ['/meta-image.jpg'], // Replace with your actual image path
    },
  };
  
  export default function MetaPage() {
    return (
      <main>
        <h1>Welcome to the Meta Page</h1>
        <p>This page is optimized with metadata, including a meta image for social sharing.</p>
      </main>
    );
  }
  