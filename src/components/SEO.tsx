import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  cityName?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalUrl,
  cityName,
  keywords
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://yourdomain.com';
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          ...(keywords && {
            "keywords": keywords.split(',').map(k => k.trim())
          }),
          ...(cityName && {
            "about": {
              "@type": "City",
              "name": cityName
            }
          })
        })}
      </script>
    </Helmet>
  );
};