import { cn } from '../../lib/utils.js'
import React from 'react'

const UserAvatar = ({avatarUrl,size,className}) => {
  return (
    <img
     src={avatarUrl || "https://avatar.iran.liara.run/public/boy"}
     alt="User avatar"
     width={size ?? 48}
     height={size ?? 48}
     className={
        cn(
            "bg-secondary aspect-square h-fit flex-none rounded-full object-cover",
            className,
        )
     }
    />
  )
}

export default UserAvatar