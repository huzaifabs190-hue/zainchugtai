"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = { id: string; author: string; authorUrl?: string; rating: number; text: string; relativeTime: string; publishTime: string };
type ReviewData = { configured: boolean; available?: boolean; businessName?: string; rating?: number; reviewCount?: number; reviews: Review[] };

const verifiedReviews: Review[] = [
  { id: "nicoli-monroe", author: "Nicoli Monroe", rating: 5, relativeTime: "6 months ago", publishTime: "", text: "Zain was patient and explained everything so we knew exactly what was going on. Got us a far better rate than anyone else. 10/10 recommend him for all your insurance needs!" },
  { id: "azar-latif", author: "Azar Latif", rating: 5, relativeTime: "7 months ago", publishTime: "", text: "Very helpful broker. He helped me find a great price on my business insurance, spent a lot of time helping me review everything and discussing all options. I would highly recommend their services to all business owners." },
  { id: "ayesha-zain", author: "Ayesha Zain", rating: 5, relativeTime: "8 months ago", publishTime: "", text: "Insurance & Financial Realty LLC has helped me save money on my BOP/Auto policy. The owner is very knowledgeable and friendly. I would definitely recommend him to my family and friends. Plus, he is mobile too." },
];

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

  const hasLiveReviews = Boolean(data?.available && data.reviews.length);
  const reviews = hasLiveReviews ? data!.reviews : verifiedReviews;
  const rating = hasLiveReviews ? (data?.rating || 5) : 5;
  const reviewCount = hasLiveReviews ? (data?.reviewCount || reviews.length) : 9;

  return <section className="reviews-section section" id="reviews">
    <div className="reviews-heading reveal"><p className="eyebrow dark"><span/> GOOGLE REVIEWS</p><h2>Trusted by our<br/><em>local clients.</em></h2><p>Real feedback from customers of Insurance &amp; Financial Realty LLC, displayed directly on our website.</p><div className="rating-summary"><strong>{rating.toFixed(1)}</strong><div><Stars value={rating}/><span>{reviewCount.toLocaleString()} Google reviews</span></div></div><div className="reviews-attribution" aria-label="Reviews sourced from Google"><b>G</b><span>Reviews from Google</span></div></div>
    <div className="reviews-grid" aria-live="polite">
      {reviews.map(review => <article className="review-card" key={review.id}><div className="review-top"><span className="review-avatar">{review.author.slice(0,1).toUpperCase()}</span><div><strong>{review.author}</strong><small>{review.relativeTime}</small></div><span className="google-g">G</span></div><Stars value={review.rating}/><p>“{review.text}”</p></article>)}
    </div>
  </section>;
}
