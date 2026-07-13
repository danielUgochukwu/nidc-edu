import Link from "next/link";
import PublicLinkButton from "@/components/public/PublicLinkButton";
import { PublicSection } from "@/components/public/PublicSection";

export const metadata = {
  title: "Blog — NIDC",
  description: "Updates, announcements, and insights from the NIDC Foundation.",
};

type BlogCategory =
  | "Announcement"
  | "Cohort Update"
  | "Alumni Story"
  | "Sector Insight";

type BlogPostSummary = {
  title: string;
  slug: string;
  date: string;
  category: BlogCategory;
  excerpt: string;
};

const posts: BlogPostSummary[] = [];

function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
      <span className="inline-flex rounded-sm bg-surface-elevated px-3 py-2 text-xs font-medium uppercase text-text-accent">
        {post.category}
      </span>
      <h2 className="mt-5 font-heading text-2xl font-bold text-text-primary">
        {post.title}
      </h2>
      <p className="mt-3 text-sm text-text-secondary">{post.date}</p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        {post.excerpt}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-6 inline-flex text-sm font-medium text-text-accent hover:text-brand-lime"
      >
        Read More
      </Link>
    </article>
  );
}

export default function BlogPage() {
  return (
    <PublicSection className="bg-surface-primary">
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
            Updates & Announcements
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Cohort announcements, alumni stories, and NIDC updates will appear
            here. The first post will be published when the first cohort opens.
          </p>
          <div className="mt-8">
            <PublicLinkButton href="/apply">Get Notified</PublicLinkButton>
          </div>
        </div>
      )}
    </PublicSection>
  );
}
