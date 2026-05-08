import { Skeleton } from "../components/ui/skeleton"
import { Briefcase } from "lucide-react"

export default function Loading() {
  return (
    <div className="page-wrapper space-y-16 py-20">
      <div className="space-y-6">
        <div className="w-12 h-12 sapphire-gradient rounded-xl flex items-center justify-center text-white mb-6 animate-pulse">
           <Briefcase className="w-6 h-6" />
        </div>
        <Skeleton className="h-16 w-full md:w-[600px] rounded-2xl" />
        <Skeleton className="h-6 w-full md:w-[400px] rounded-xl opacity-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-surface p-10 rounded-2xl space-y-10 border-border/50">
            <div className="flex items-start justify-between gap-6">
               <div className="flex items-center gap-6 flex-1">
                  <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                  <div className="space-y-3 flex-1">
                     <Skeleton className="h-8 w-3/4 rounded-lg" />
                     <Skeleton className="h-4 w-1/2 rounded-md opacity-50" />
                  </div>
               </div>
               <Skeleton className="h-8 w-24 rounded-full opacity-40" />
            </div>
            
            <div className="space-y-4">
               <Skeleton className="h-4 w-full rounded-md opacity-30" />
               <Skeleton className="h-4 w-5/6 rounded-md opacity-30" />
            </div>

            <div className="flex gap-3">
              {[1, 2, 3].map(j => (
                <Skeleton key={j} className="h-8 w-20 rounded-xl opacity-30" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
