import { useState } from "react"
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
import { Plus } from "lucide-react"

const countries = [
  { id: 1, name: "my name", avatar: "https://example.com/us-flag.png" },
  { id: 2, name: "another name", avatar: "https://example.com/ca-flag.png" },
  { id: 3, name: "third name", avatar: "https://example.com/uk-flag.png" },
  { id: 4, name: "fourth name", avatar: "https://example.com/de-flag.png" },
]

type UserItem = {
  id: number
  name: string
  avatar: string
}

export function SelectMultipleUser({
  user,
  setUser,
}: {
  user: UserItem[]
  setUser: (user: UserItem[]) => void
}) {
  const [items, setItems] = useState<UserItem[]>(countries)

  return (
    <>
      <Combobox multiple items={items} value={user} onValueChange={setUser}>
        <ComboboxTrigger
          nativeButton={false}
          render={
            <AvatarGroup className="grayscale">
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
                <Plus />
              </AvatarGroupCount>
            </AvatarGroup>
          }
        />
        <ComboboxContent className="w-48" align="end">
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  )
}
