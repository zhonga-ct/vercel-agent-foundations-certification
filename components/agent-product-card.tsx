"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: ProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const id = invocation.input?.productId;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up{id ? ` "${id}"` : ""}…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output && output.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const product = "product" in output ? output.product : undefined;
  if (!product) return null;

  const stock = "stock" in output ? output.stock : undefined;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {product.image && (
        <div className="relative aspect-4/3 bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </div>
        {stock && (
          <p className="text-xs text-muted-foreground">
            {stock.inStock
              ? `${stock.stock} in stock`
              : stock.lowStock
                ? "Low stock"
                : "Out of stock"}
          </p>
        )}
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          View product →
        </Link>
      </div>
    </div>
  );
}