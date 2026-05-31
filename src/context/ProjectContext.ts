import { createContext } from "react"
import type { ProjectContextType } from "@/types"

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export default ProjectContext
