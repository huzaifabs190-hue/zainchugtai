"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = { id: string; author: string; authorUrl?: string; rating: number; text: string; relativeTime: string; publishTime: string };
type ReviewData = { configured: boolean; available?: boolean; businessName?: string; rating?: number; reviewCount?: number; reviews: Review[] };

function Stars({ value }: { value: number }) {
  return <span className="review-stars" aria-label={`${value} out of 5 stars`}>{[1,2,3,4,5].map(star => <Star key={star} size={15} fill={star <= Math.round(value) ? "currentColor" : "none"}/>)}</span>;
}

export default function ReviewsSection() {
  const [data, setData] = useState<ReviewData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/google-reviews", { signal: controller.signal })
      .then(response => response.json())
      .then(setData)
      .catch(error => { if (error.name !== "AbortError") setData({ configured: false, reviews: [] }); });
    return () => controller.abort();
  }, []);

  const reviews = data?.reviews || [];

  return <section className="reviews-section section" id="reviews">
    <div className="reviews-heading reveal"><p className="eyebrow dark"><span/> GOOGLE REVIEWS</p><h2>Trusted by our<br/><em>local clients.</em></h2><p>Real customer feedback displayed directly inside this website and refreshed automatically from Google.</p>{data?.available && <div className="rating-summary"><strong>{data.rating?.toFixed(1)}</strong><div><Stars value={data.rating || 0}/><span>{data.reviewCount?.toLocaleString()} Google reviews</span></div></div>}<div className="reviews-attribution" aria-label="Reviews provided by Google"><b>G</b><span>Reviews from Google</span></div></div>
    <div className="reviews-grid" aria-live="polite">
      {!data && [1,2,3].map(item => <div className="review-card review-loading" key={item}/>) }
      {data && reviews.map(review => <article className="review-card" key={review.id}><div className="review-top"><span className="review-avatar">{review.author.slice(0,1).toUpperCase()}</span><div><strong>{review.author}</strong><small>{review.relativeTime}</small></div><span className="google-g">G</span></div><Stars value={review.rating}/><p>“{review.text}”</p></article>)}
      {data && reviews.length === 0 && <div className="reviews-empty"><strong>Google reviews will appear here.</strong><p>Connect the Google Places API and the actual customer reviews will populate directly in these cards—no visitor redirect required.</p></div>}
    </div>
  </section>;
}
