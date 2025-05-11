import type React from "react"
import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextUiCard,
  Spinner,
} from "@nextui-org/react"
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../app/services/likesApi"
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../app/services/postsApi"
import { useDeleteCommentMutation } from "../../app/services/commentsApi"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { selectCurrent } from "../../features/user/userSlice"
import { useSelector } from "react-redux"
import { User } from "../user"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { RiDeleteBinLine } from "react-icons/ri"
import { Typography } from "../typography"
import { MetaInfo } from "../meta-info"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { FaRegComment } from "react-icons/fa"
import { ErrorMessage } from "../error-message"
import { hasErrorField } from "../../utils/has-error-field"
import { DEFAULT_AVATAR } from "../../constants"

type Props = {
  avatarUrl?: string
  name: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: "comment" | "post" | "current-post"
  likedByUser?: boolean
}

export const Card: React.FC<Props> = ({
  avatarUrl = "",
  name = "",
  authorId = "",
  content = "",
  commentId = "",
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  id = "",
  cardFor = "post",
  likedByUser = false,
}) => {
  const [likedPost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComent, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrent)

  // Функция для обработки URL аватарки
  const getAvatarUrl = () => {
    if (!avatarUrl) return DEFAULT_AVATAR
    if (avatarUrl.startsWith("http")) return avatarUrl
    if (avatarUrl.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL || ""}${avatarUrl}`
    }
    return DEFAULT_AVATAR
  }

  const refetchPosts = async () => {
    switch (cardFor) {
      case "post":
        await triggerGetAllPosts().unwrap()
        break
      case "current-post":
        await triggerGetAllPosts().unwrap()
        break
      case "comment":
        await triggerGetPostById(id).unwrap()
        break
      default:
        throw new Error("Проблема аргумента cardFor")
    }
  }

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "post":
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case "current-post":
          await deletePost(id).unwrap()
          navigate("/")
          break
        case "comment":
          await deleteComent(commentId).unwrap()
          await refetchPosts()
          break
        default:
          throw new Error("Проблема аргумента cardFor")
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  const handleClick = async () => {
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likedPost({ postId: id }).unwrap()

      if (cardFor === "current-post") {
        await triggerGetPostById(id).unwrap()
      }

      if (cardFor === "post") {
        await triggerGetAllPosts().unwrap()
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      } else {
        setError(error as string)
      }
    }
  }

  return (
    <NextUiCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={getAvatarUrl()} // Используем обработанный URL
            description={
              createdAt ? formatToClientDate(createdAt).toString() : undefined
            }
          />
        </Link>
        {authorId === currentUser?.id && (
          <div className="cursor-pointer" onClick={handleDelete}>
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <RiDeleteBinLine className="text-danger" />
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-2 py-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>
      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div onClick={handleClick} className="cursor-pointer">
              <MetaInfo
                count={likesCount}
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                iconColor={likedByUser ? "text-danger" : "text-default-500"}
              />
            </div>
            <Link to={`/posts/${id}`}>
              <MetaInfo
                count={commentsCount}
                Icon={FaRegComment}
                iconColor="text-default-500"
              />
            </Link>
          </div>
          <ErrorMessage error={error} />
        </CardFooter>
      )}
    </NextUiCard>
  )
}
