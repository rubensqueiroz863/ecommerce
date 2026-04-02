type SkeletonSubCategoryProps = {
  count: number;
}

export default function SkeletonSubCategory({ count }: Readonly<SkeletonSubCategoryProps>) {
  return (
    <div className="px-4 md:px-8">
      <ul className="grid mt-6 md:mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex flex-col gap-2 animate-pulse">
            <div className="bg-[var(--bg-card)] rounded-md w-full aspect-[4/3] md:aspect-[3/4]"></div>
            <div className="h-4 bg-[var(--bg-card)] rounded w-3/4"></div>
            <div className="h-4 bg-[var(--bg-card)] rounded w-1/2"></div>
          </li>
        ))}
      </ul>
    </div>
  )
}