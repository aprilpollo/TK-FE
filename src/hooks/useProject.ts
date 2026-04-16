import { useContext } from "react"
import ProjectContext, { type ProjectContextType } from "@/context/ProjectContext"

function useProject(): ProjectContextType {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider")
  }

  return context
}

export default useProject