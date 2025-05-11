import type React from "react"
import type { IconType } from "react-icons"

type Props = {
  count: number
  Icon: IconType
  iconColor?: string
}

export const MetaInfo: React.FC<Props> = ({ count, Icon, iconColor }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {count > 0 && (
        <p className="font-semibold text-default-400 text-l">{count}</p>
      )}
      <p
        className={`${iconColor || "text-default-400"} text-xl hover:text-2xl ease-in duration-150`}
      >
        <Icon />
      </p>
    </div>
  )
}
