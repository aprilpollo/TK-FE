import { Skeleton } from "@/components/ui/skeleton"

export function TaskDetailSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-7 w-64 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-6 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
