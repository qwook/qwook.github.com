const SITE_ORIGIN = "https://qwook.io";

/**
 * Standard <head> tags for a page. Use it from a page's exported Head:
 *
 *   export function Head() {
 *     return <Meta title="..." description="..." image={importedImage} />;
 *   }
 */
export default function Meta({ title, description, image }) {
  const imageUrl = image && new URL(image, SITE_ORIGIN).href;
  return (
    <>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
    </>
  );
}
