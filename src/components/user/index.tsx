import { User as NextUser } from "@nextui-org/react"
import type React from "react"
import { BASE_URL, DEFAULT_AVATAR } from "../../constants"

type Props = {
  name: string
  avatarUrl?: string | null
  description?: string
  className?: string
}

export const User: React.FC<Props> = ({
  name = "",
  avatarUrl = "",
  description = "",
  className = "",
}) => {
  const getAvatarUrl = () => {
    if (!avatarUrl) return DEFAULT_AVATAR
    return avatarUrl.startsWith("http") ? avatarUrl : `${BASE_URL}${avatarUrl}`
  }

  return (
    <NextUser
      name={name}
      className={className}
      description={description}
      avatarProps={{
        src: getAvatarUrl(),
        className: "object-cover",
        isBordered: true,
        fallback: <div className="bg-default-200 w-full h-full" />,
      }}
    />
  )
}
