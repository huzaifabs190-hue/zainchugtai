type GoogleText = { text?: string; languageCode?: string };
type GoogleReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: GoogleText;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

const mapsFallback = "https://www.google.com/maps/search/?api=1&query=Insurance+%26+Financial+Realty+LLC+1019+Farmington+Ave+Suite+5+Bristol+CT+06010";

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return Response.json({ configured: false, mapsUrl: mapsFallback, reviews: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const fields = "id,displayName,rating,userRatingCount,reviews,googleMapsUri";
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": fields, "Accept-Language": "en-US" },
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      console.error("Google Places rejected reviews request", response.status, await response.text());
      return Response.json({ configured: true, available: false, mapsUrl: mapsFallback, reviews: [] }, { status: 502, headers: { "Cache-Control": "public, s-maxage=300" } });
    }

    const place = await response.json() as {
      displayName?: GoogleText;
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: GoogleReview[];
    };

    return Response.json({
      configured: true,
      available: true,
      businessName: place.displayName?.text || "Insurance & Financial Realty LLC",
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0,
      mapsUrl: place.googleMapsUri || mapsFallback,
      reviews: (place.reviews || []).map(review => ({
        id: review.name || crypto.randomUUID(),
        author: review.authorAttribution?.displayName || "Google reviewer",
        authorUrl: review.authorAttribution?.uri,
        rating: review.rating || 0,
        text: review.text?.text || "",
        relativeTime: review.relativePublishTimeDescription || "",
        publishTime: review.publishTime || "",
      })).filter(review => review.text),
    }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
  } catch (error) {
    console.error("Google reviews request failed", error);
    return Response.json({ configured: true, available: false, mapsUrl: mapsFallback, reviews: [] }, { status: 502 });
  }
}
