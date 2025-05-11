import React from "react"
import { useSelector } from "react-redux"
import { selectCurrent } from "../../features/user/userSlice"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { MdAlternateEmail } from "react-icons/md"
import { BASE_URL } from "../../constants"

export const Profile = () => {
  const current = useSelector(selectCurrent)
  if (!current) {
    return null
  }
  const { name, email, avatarUrl, id } = current

  const getAvatarUrl = () => {
    if (!avatarUrl) return ""
    return avatarUrl.startsWith("http") ? avatarUrl : `${BASE_URL}${avatarUrl}`
  }

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <Image
          alt="card profile"
          className="object-cover rounded-xl"
          src={getAvatarUrl()}
          width={370}
          fallbackSrc="https://i.pinimg.com/736x/bc/a6/1f/bca61feaa9516a0bdf69c79207177917.jpg"
        />
      </CardHeader>
      <CardBody>
        <Link to={`/users/${id}`}>
          <h4 className="font-bold text-large mb-2">{name}</h4>
        </Link>
        <p className="text-default-500 flex items-center gap-2">
          <MdAlternateEmail />
          {email}
        </p>
      </CardBody>
    </Card>
  )
}
