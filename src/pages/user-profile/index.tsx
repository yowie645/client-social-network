import { Button, Card, Image, useDisclosure } from "@nextui-org/react"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { resetUser, selectCurrent } from "../../features/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { GoBack } from "../../components/go-back"
import { BASE_URL, DEFAULT_AVATAR } from "../../constants"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"
import { ProfileInfo } from "../../components/profile-info"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { CountInfo } from "../../components/count-info"
import { EditProfile } from "../../components/edit-profile"

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useSelector(selectCurrent)
  const { data, isLoading, isError } = useGetUserByIdQuery(id ?? "")
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const dispatch = useDispatch()

  const profileIdNum = id ? Number(id) : null
  const currentUserIdNum = currentUser?.id ? Number(currentUser.id) : null

  useEffect(() => {
    return () => {
      dispatch(resetUser())
    }
  }, [dispatch])

  const getAvatarUrl = () => {
    if (!data?.avatarUrl) return DEFAULT_AVATAR
    return data.avatarUrl.startsWith("http")
      ? data.avatarUrl
      : `${BASE_URL}${data.avatarUrl}`
  }

  const handleFollow = async () => {
    try {
      if (profileIdNum === null) return

      const payload = { followingId: profileIdNum }

      if (data?.isFollowing) {
        await unfollowUser(payload).unwrap()
      } else {
        await followUser(payload).unwrap()
      }

      await triggerGetUserByIdQuery(id!)
      await triggerCurrentQuery()
    } catch (error) {
      console.error("Follow operation failed:", error)
    }
  }

  const handleClose = async () => {
    try {
      if (id) {
        await triggerGetUserByIdQuery(id)
        await triggerCurrentQuery()
        onClose()
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  if (isLoading) return <div>Загрузка профиля...</div>
  if (isError) return <div>Ошибка загрузки профиля</div>
  if (!data) return null

  return (
    <>
      <GoBack />
      <div className="flex items-center gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={getAvatarUrl()}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white object-cover"
            onError={() => console.error("Error loading avatar")}
            fallbackSrc={DEFAULT_AVATAR}
          />
          <div className="flex flex-col text-2xl font-bold gap-4 item-center">
            {data.name}
            {currentUserIdNum !== null &&
            profileIdNum !== null &&
            currentUserIdNum !== profileIdNum ? (
              <Button
                color={data.isFollowing ? "default" : "primary"}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                endContent={
                  data.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data.isFollowing ? "Отписаться" : "Подписаться"}
              </Button>
            ) : (
              <Button endContent={<CiEdit />} onClick={onOpen}>
                Редактировать
              </Button>
            )}
          </div>
        </Card>
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title="Почта" info={data.email} />
          <ProfileInfo title="Город" info={data.location} />
          <ProfileInfo
            title="Дата рождения"
            info={formatToClientDate(data.dateOfBirth)}
          />
          <ProfileInfo title="Обо мне" info={data.bio} />
          <div className="flex gap-2">
            <CountInfo count={data.followers.length} title="Подписчики" />
            <CountInfo count={data.following.length} title="Подписки" />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
    </>
  )
}
