import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

function Dashboard() {
  return (
    <ScrollArea className="h-[calc(100dvh-48px)]">
      <main className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-36" />
          <Card className="h-36" />
          <Card className="h-36" />
          <Card className="h-36" />
        </div>
        <div className="space-y-4">
          <Card className="h-96" />
          <Card className="h-96" />
        </div>
      </main>
    </ScrollArea>
  )
}

export default Dashboard
