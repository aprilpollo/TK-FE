import { useState, useEffect, useRef } from "react"
import { fetchMembers } from "@/api/organization"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { User } from "lucide-react"

type UserItem = {
  id: number
  name: string
  email: string
  avatar: string
}

export function SelectMultipleUser({
  user,
  setUser,
}: {
  user: UserItem[]
  setUser: (user: UserItem[]) => void
}) {
  const [items, setItems] = useState<UserItem[]>([])
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const userRef = useRef(user)
  useEffect(() => { userRef.current = user }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    if (!open) return
    const loadMembers = async () => {
      try {
        const query = new URLSearchParams()
        if (search) {
          query.append("_q", search) //_search_fields
          query.append("_search_fields", "email,first_name,last_name,display_name")
        }
        const response = await fetchMembers(query.toString())
        const members = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: {
            id: number
            email: string
            first_name: string
            last_name: string
            display_name: string
            avatar: string
          }[]
        }
        const selectedById = new Map(userRef.current.map((u) => [u.id, u]))
        const users = members.payload.map((member) => {
          const existing = selectedById.get(member.id)
          return (
            existing ?? {
              id: member.id,
              name:
                member.display_name ||
                `${member.first_name} ${member.last_name}`,
              email: member.email,
              avatar: member.avatar,
            }
          )
        })
        const existingIds = new Set(users.map((u) => u.id))
        const missing = userRef.current.filter((u) => !existingIds.has(u.id))
        setItems([...users, ...missing])
      } catch (error) {
        console.error("Error fetching members:", error)
      }
    }
    loadMembers()
  }, [open, search])

  return (
    <>
      <Combobox
        multiple
        items={items}
        value={user}
        onOpenChange={setOpen}
        filter={() => true}
        onValueChange={(newValue) => {
          const seen = new Set<number>()
          setUser(
            newValue.filter((item) => {
              if (seen.has(item.id)) return false
              seen.add(item.id)
              return true
            }),
          )
        }}
      >
        <ComboboxTrigger
          nativeButton={false}
          render={
            <AvatarGroup>
              {user?.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="size-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              ))}

              {user && user.length > 3 && (
                <AvatarGroupCount className="size-6">
                  {user.length - 3}+
                </AvatarGroupCount>
              )}
              <AvatarGroupCount className="size-6 cursor-pointer">
                <User />
              </AvatarGroupCount>
            </AvatarGroup>
          }
        />
        <ComboboxContent className="min-w-48" align="end">
          <ComboboxInput
            showTrigger={false}
            placeholder="Search"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item} className="gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.name}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  )
}
